import { ZodError } from "zod";
import { adminRedirect, getErrorMessage } from "@/lib/admin-forms";
import {
  getImageFiles,
  removeProductImageStoragePaths,
  uploadProductImageFile,
} from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productFormSchema } from "@/lib/validation/admin";
import {
  findDuplicateVariantKey,
  normalizeVariantCombination,
} from "@/lib/product-variants";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name"))),
    short_description: formData.get("short_description") || undefined,
    description: formData.get("description") || undefined,
    main_image_url: null,
    category: formData.get("category") || "T-Shirts",
    product_status: getProductStatus(formData),
    stock_tracking_enabled: formData.get("stock_tracking_enabled") === "true",
    preorder_enabled: formData.get("preorder_enabled") === "true",
    preorder_start_at: formData.get("preorder_start_at") || null,
    preorder_end_at: formData.get("preorder_end_at") || null,
    preorder_quantity_limit: formData.get("preorder_quantity_limit") || null,
    colors: splitOptions(formData.get("colors")),
    sizes: splitOptions(formData.get("sizes")),
    genders: formData.getAll("genders").map(String),
    price: formData.get("price"),
    sale_price: formData.get("sale_price") || null,
    unit_cost: formData.get("unit_cost") || null,
    stock_quantity: formData.get("stock_quantity"),
    show_stock_count: formData.get("show_stock_count") === "true",
    is_active: getProductStatus(formData) === "published",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/products/new", {
      error: formatValidationError(parsed.error),
    });
  }

  const supabase = getSupabaseAdminClient();
  const variantRows = parseVariants(formData);

  if (findDuplicateVariantKey(variantRows)) {
    return adminRedirect(request, "/admin/products/new", {
      error: "Each variant must use a unique gender, color, and size combination.",
    });
  }

  if (
    parsed.data.stock_tracking_enabled &&
    variantRows.reduce((total, variant) => total + variant.stock_quantity, 0) >
      parsed.data.stock_quantity
  ) {
    return adminRedirect(request, "/admin/products/new", {
      error: "Variant stock cannot be greater than total product stock.",
    });
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert(parsed.data)
    .select("id, name")
    .single();

  if (error) {
    return adminRedirect(request, "/admin/products/new", { error: error.message });
  }

  try {
    const featuredFile = getImageFiles(formData, "featured_file")[0];
    let uploadedFeaturedImageUrl: string | null = null;
    if (featuredFile) {
      const uploaded = await uploadProductImageFile({
        file: featuredFile,
        productId: product.id,
        prefix: "featured",
      });
      uploadedFeaturedImageUrl = uploaded.imageUrl;

      const { error: featuredUpdateError } = await supabase
        .from("products")
        .update({ main_image_url: uploaded.imageUrl })
        .eq("id", product.id);
      if (featuredUpdateError) {
        await removeProductImageStoragePaths([uploaded.storagePath]);
        throw featuredUpdateError;
      }
    }

    const galleryFiles = getImageFiles(formData, "gallery_files");
    if (galleryFiles.length) {
      const galleryStoragePaths: string[] = [];
      const rows = await Promise.all(
        galleryFiles.map(async (file, index) => {
          const uploaded = await uploadProductImageFile({
            file,
            productId: product.id,
            prefix: "gallery",
          });
          galleryStoragePaths.push(uploaded.storagePath);

          return {
            product_id: product.id,
            image_url: uploaded.imageUrl,
            storage_path: uploaded.storagePath,
            alt_text: product.name,
            sort_order: index,
          };
        }),
      );

      const { error: galleryInsertError } = await supabase.from("product_images").insert(rows);
      if (galleryInsertError) {
        await removeProductImageStoragePaths(galleryStoragePaths);
        throw galleryInsertError;
      }

      if (!uploadedFeaturedImageUrl && rows[0]?.image_url) {
        const { error: fallbackFeaturedError } = await supabase
          .from("products")
          .update({ main_image_url: rows[0].image_url })
          .eq("id", product.id);
        if (fallbackFeaturedError) throw fallbackFeaturedError;
      }
    }

    if (variantRows.length) {
      const variantStoragePaths: string[] = [];
      const variantInsertRows = await Promise.all(
        variantRows.map(async (variant) => {
          const variantFile = getImageFiles(formData, `variant_image_${variant.key}`)[0];
          const uploaded = variantFile
            ? await uploadProductImageFile({
                file: variantFile,
                productId: product.id,
                prefix: `variant-${variant.key}`,
              })
            : null;
          if (uploaded) variantStoragePaths.push(uploaded.storagePath);

          return {
            product_id: product.id,
            gender: variant.gender,
            size: variant.size,
            color: variant.color,
            stock_quantity: variant.stock_quantity,
            price: variant.price || null,
            sale_price: variant.sale_price || null,
            unit_cost: variant.unit_cost || null,
            image_url: uploaded?.imageUrl ?? null,
            storage_path: uploaded?.storagePath ?? null,
          };
        }),
      );

      const { error: variantInsertError } = await supabase
        .from("product_variants")
        .insert(variantInsertRows);
      if (variantInsertError) {
        await removeProductImageStoragePaths(variantStoragePaths);
        throw variantInsertError;
      }
    }
  } catch (uploadError) {
    return adminRedirect(request, `/admin/products/${product.id}/edit`, {
      error:
        uploadError instanceof Error
          ? uploadError.message
          : "Product created, but media or variant sync failed.",
    });
  }

  return adminRedirect(request, "/admin/products", {
    success: "Product created.",
  });
}

function formatValidationError(error: ZodError) {
  return error.issues[0]?.message ?? getErrorMessage(error, "Invalid product details.");
}

function splitOptions(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getProductStatus(formData: FormData) {
  return String(formData.get("submit_status") || formData.get("product_status") || "draft");
}

function parseVariants(formData: FormData) {
  const raw = String(formData.get("variants_json") ?? "[]");
  try {
    const variants = JSON.parse(raw) as Array<{
      gender: "Male" | "Female" | "Unisex";
      size: string;
      color: string;
      key: string;
      stock_quantity: number;
      price?: string;
      sale_price?: string;
      unit_cost?: string;
    }>;

    return variants
      .map(normalizeVariantCombination)
      .filter((variant) => variant.gender && variant.size && variant.color);
  } catch {
    return [];
  }
}
