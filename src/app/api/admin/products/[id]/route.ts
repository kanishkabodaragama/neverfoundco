import { ZodError } from "zod";
import { adminRedirect, getErrorMessage } from "@/lib/admin-forms";
import {
  getImageFiles,
  getProductImageStoragePathFromUrl,
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

async function updateProduct(request: Request, id: string) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();

  if (formData.get("_method") === "DELETE") {
    return deleteProduct(request, id);
  }

  if (formData.get("_method") === "TOGGLE_ACTIVE") {
    return toggleProduct(request, id, formData.get("is_active") === "true");
  }

  const submittedVariants = parseVariants(formData);
  if (findDuplicateVariantKey(submittedVariants)) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: "Each variant must use a unique gender, color, and size combination.",
    });
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

  if (
    parsed.data.stock_tracking_enabled &&
    submittedVariants.reduce((total, variant) => total + variant.stock_quantity, 0) >
      parsed.data.stock_quantity
  ) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: "Variant stock cannot be greater than total product stock.",
    });
  }

  const supabase = getSupabaseAdminClient();
  const updateData: typeof parsed.data & { main_image_url?: string | null } = {
    ...parsed.data,
  };
  const removeFeaturedImage = formData.get("remove_featured_image") === "true";
  const { data: currentMedia } = await supabase
    .from("products")
    .select("main_image_url, product_images(image_url)")
    .eq("id", id)
    .maybeSingle();
  const galleryImageUrls = new Set(
    (currentMedia?.product_images ?? []).map((image) => image.image_url),
  );
  let featuredStoragePathToRemove: string | null = null;

  try {
    const featuredFile = getImageFiles(formData, "featured_file")[0];
    const currentFeaturedUrl = currentMedia?.main_image_url ?? null;

    if (featuredFile) {
      const uploaded = await uploadProductImageFile({
        file: featuredFile,
        productId: id,
        prefix: "featured",
      });
      updateData.main_image_url = uploaded.imageUrl;
    } else if (removeFeaturedImage) {
      updateData.main_image_url = null;
    }

    if (
      (featuredFile || removeFeaturedImage) &&
      currentFeaturedUrl &&
      !galleryImageUrls.has(currentFeaturedUrl)
    ) {
      featuredStoragePathToRemove = getProductImageStoragePathFromUrl(currentFeaturedUrl);
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

  if (featuredStoragePathToRemove) {
    await supabase.storage.from("product-images").remove([featuredStoragePathToRemove]);
  }

  try {
    await syncReplacedGalleryImages({
      formData,
      productId: id,
      productName: parsed.data.name,
    });
  } catch (galleryReplacementError) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error:
        galleryReplacementError instanceof Error
          ? galleryReplacementError.message
          : "Product saved, but gallery replacement failed.",
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
      variants: submittedVariants,
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

async function syncReplacedGalleryImages({
  formData,
  productId,
  productName,
}: {
  formData: FormData;
  productId: string;
  productName: string;
}) {
  const imageIds = formData
    .getAll("remove_gallery_image_ids")
    .map(String)
    .filter(Boolean);

  if (!imageIds.length) return;

  const supabase = getSupabaseAdminClient();

  for (const imageId of imageIds) {
    const { data: existingImage, error: existingError } = await supabase
      .from("product_images")
      .select("id, storage_path")
      .eq("id", imageId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existingImage) continue;

    const replacementFile = getImageFiles(formData, `replace_gallery_image_${imageId}`)[0];

    if (!replacementFile) {
      const { error: deleteError } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);
      if (deleteError) throw deleteError;

      if (existingImage.storage_path) {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove([existingImage.storage_path]);
        if (removeError) throw removeError;
      }

      continue;
    }

    const uploaded = await uploadProductImageFile({
      file: replacementFile,
      productId,
      prefix: `gallery-replace-${imageId}`,
    });

    const { error: updateError } = await supabase
      .from("product_images")
      .update({
        image_url: uploaded.imageUrl,
        storage_path: uploaded.storagePath,
        alt_text: productName,
      })
      .eq("id", imageId);

    if (updateError) throw updateError;

    if (existingImage.storage_path) {
      const { error: removeError } = await supabase.storage
        .from("product-images")
        .remove([existingImage.storage_path]);
      if (removeError) throw removeError;
    }
  }
}

async function syncProductVariants({
  formData,
  productId,
  variants,
}: {
  formData: FormData;
  productId: string;
  variants: ReturnType<typeof parseVariants>;
}) {
  const supabase = getSupabaseAdminClient();
  const removedVariantImageIds = new Set(
    formData.getAll("remove_variant_image_ids").map(String).filter(Boolean),
  );
  const { data: existingVariants, error: existingError } = await supabase
    .from("product_variants")
    .select("id, storage_path")
    .eq("product_id", productId);

  if (existingError) throw existingError;

  const existingVariantMap = new Map(
    (existingVariants ?? []).map((variant) => [variant.id, variant]),
  );
  const submittedIds = new Set(
    variants
      .map((variant) => variant.id)
      .filter((id): id is string => Boolean(id)),
  );
  const removedVariantIds = (existingVariants ?? [])
    .map((variant) => variant.id)
    .filter((id) => !submittedIds.has(id));

  if (removedVariantIds.length) {
    const removedStoragePaths = removedVariantIds
      .map((variantId) => existingVariantMap.get(variantId)?.storage_path)
      .filter((path): path is string => Boolean(path));
    const { error: deleteError } = await supabase
      .from("product_variants")
      .delete()
      .in("id", removedVariantIds);

    if (deleteError) throw deleteError;

    if (removedStoragePaths.length) {
      const { error: removeError } = await supabase.storage
        .from("product-images")
        .remove(removedStoragePaths);

      if (removeError) throw removeError;
    }
  }

  for (const variant of variants) {
    const variantFile = getImageFiles(formData, `variant_image_${variant.key}`)[0];
    const removeVariantImage = variant.id ? removedVariantImageIds.has(variant.id) : false;
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
        : removeVariantImage
          ? {
              image_url: null,
              storage_path: null,
            }
        : {}),
    };

    if (variant.id) {
      const existingVariant = existingVariantMap.get(variant.id);
      const { error } = await supabase
        .from("product_variants")
        .update(payload)
        .eq("id", variant.id);
      if (error) throw error;

      if ((uploaded || removeVariantImage) && existingVariant?.storage_path) {
        const { error: removeError } = await supabase.storage
          .from("product-images")
          .remove([existingVariant.storage_path]);

        if (removeError) throw removeError;
      }

      continue;
    }

    const { error } = await supabase.from("product_variants").insert(payload);
    if (error) throw error;
  }
}

async function deleteProduct(request: Request, id: string) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return adminRedirect(request, "/admin/products", { error: error.message });
  }

  return adminRedirect(request, "/admin/products", { success: "Product deleted." });
}

async function toggleProduct(request: Request, id: string, isActive: boolean) {
  const auth = await requireAdminApi(request);
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
  const auth = await requireAdminApi(request);
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

    return variants
      .map(normalizeVariantCombination)
      .filter((variant) => variant.gender && variant.size && variant.color);
  } catch {
    return [];
  }
}
