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
    }
  } catch (uploadError) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error:
        uploadError instanceof Error
          ? uploadError.message
          : "Product saved, but gallery upload failed.",
    });
  }

  return adminRedirect(request, `/admin/products/${id}/edit`, {
    success: "Product saved.",
  });
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
