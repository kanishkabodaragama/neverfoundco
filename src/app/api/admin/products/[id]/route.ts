import { ZodError } from "zod";
import { adminRedirect, getErrorMessage } from "@/lib/admin-forms";
import { getImageFiles, uploadProductImageFile } from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productFormSchema } from "@/lib/validation/admin";
import { slugify } from "@/lib/utils";

async function updateProduct(request: Request, id: string) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();

  if (formData.get("_method") === "DELETE") {
    return deleteProduct(request, id);
  }

  if (formData.get("_method") === "TOGGLE_ACTIVE") {
    return toggleProduct(request, id, formData.get("is_active") === "true");
  }

  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name"))),
    short_description: formData.get("short_description") || undefined,
    description: formData.get("description") || undefined,
    main_image_url: undefined,
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
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: formatValidationError(parsed.error),
    });
  }

  const supabase = getSupabaseAdminClient();
  const updateData = { ...parsed.data };

  try {
    const featuredFile = getImageFiles(formData, "featured_file")[0];
    if (featuredFile) {
      const uploaded = await uploadProductImageFile({
        file: featuredFile,
        productId: id,
        prefix: "featured",
      });
      updateData.main_image_url = uploaded.imageUrl;
    }
  } catch (uploadError) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error:
        uploadError instanceof Error
          ? uploadError.message
          : "Featured image upload failed.",
    });
  }

  const { error } = await supabase.from("products").update(updateData).eq("id", id);

  if (error) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: error.message,
    });
  }

  try {
    const galleryFiles = getImageFiles(formData, "gallery_files");
    if (galleryFiles.length) {
      const { count } = await supabase
        .from("product_images")
        .select("*", { count: "exact", head: true })
        .eq("product_id", id);
      const { data: existingProduct } = await supabase
        .from("products")
        .select("main_image_url")
        .eq("id", id)
        .maybeSingle();
      const rows = await Promise.all(
        galleryFiles.map(async (file, index) => {
          const uploaded = await uploadProductImageFile({
            file,
            productId: id,
            prefix: "gallery",
          });

          return {
            product_id: id,
            image_url: uploaded.imageUrl,
            storage_path: uploaded.storagePath,
            alt_text: parsed.data.name,
            sort_order: (count ?? 0) + index,
          };
        }),
      );

      await supabase.from("product_images").insert(rows);

      if (!existingProduct?.main_image_url && (count ?? 0) === 0 && rows[0]?.image_url) {
        await supabase
          .from("products")
          .update({ main_image_url: rows[0].image_url })
          .eq("id", id);
      }
    }
  } catch (uploadError) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error:
        uploadError instanceof Error
          ? uploadError.message
          : "Product saved, but gallery upload failed.",
    });
  }

  try {
    await syncProductVariants({
      formData,
      productId: id,
      productName: parsed.data.name,
      request,
    });
  } catch (variantError) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error:
        variantError instanceof Error
          ? variantError.message
          : "Product saved, but variant update failed.",
    });
  }

  return adminRedirect(request, `/admin/products/${id}/edit`, {
    success: "Product saved.",
  });
}

async function syncProductVariants({
  formData,
  productId,
}: {
  formData: FormData;
  productId: string;
  productName: string;
  request: Request;
}) {
  const supabase = getSupabaseAdminClient();
  const variants = parseVariants(formData);
  const submittedIds = variants
    .map((variant) => variant.id)
    .filter((id): id is string => Boolean(id));

  if (submittedIds.length) {
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId)
      .not("id", "in", `(${submittedIds.join(",")})`);
  } else {
    await supabase.from("product_variants").delete().eq("product_id", productId);
  }

  for (const variant of variants) {
    const variantFile = getImageFiles(formData, `variant_image_${variant.key}`)[0];
    const uploaded = variantFile
      ? await uploadProductImageFile({
          file: variantFile,
          productId,
          prefix: `variant-${variant.key}`,
        })
      : null;
    const payload = {
      product_id: productId,
      gender: variant.gender,
      size: variant.size,
      color: variant.color,
      stock_quantity: variant.stock_quantity,
      price: variant.price || null,
      sale_price: variant.sale_price || null,
      unit_cost: variant.unit_cost || null,
      ...(uploaded
        ? {
            image_url: uploaded.imageUrl,
            storage_path: uploaded.storagePath,
          }
        : {}),
    };

    if (variant.id) {
      const { error } = await supabase
        .from("product_variants")
        .update(payload)
        .eq("id", variant.id);
      if (error) throw error;
      continue;
    }

    const { error } = await supabase.from("product_variants").insert(payload);
    if (error) throw error;
  }
}

async function deleteProduct(request: Request, id: string) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return adminRedirect(request, "/admin/products", { error: error.message });
  }

  return adminRedirect(request, "/admin/products", { success: "Product deleted." });
}

async function toggleProduct(request: Request, id: string, isActive: boolean) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return adminRedirect(request, "/admin/products", { error: error.message });
  }

  return adminRedirect(request, "/admin/products", {
    success: isActive ? "Product published." : "Product unpublished.",
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return updateProduct(request, id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return updateProduct(request, id);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  return deleteProduct(request, id);
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
      id?: string;
      gender: "Male" | "Female" | "Unisex";
      size: string;
      color: string;
      key: string;
      stock_quantity: number;
      price?: string;
      sale_price?: string;
      unit_cost?: string;
    }>;

    return variants.filter(
      (variant) => variant.gender && variant.size && variant.color,
    );
  } catch {
    return [];
  }
}
