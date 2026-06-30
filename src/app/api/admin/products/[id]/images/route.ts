import { adminRedirect } from "@/lib/admin-forms";
import { removeProductImageStoragePaths, uploadProductImageFile } from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productImageSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get("file");
  let uploadedImage:
    | {
        image_url: string;
        storage_path: string;
      }
    | null = null;

  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadProductImageFile({
        file,
        productId: id,
        prefix: "gallery",
      });

      uploadedImage = {
        image_url: uploaded.imageUrl,
        storage_path: uploaded.storagePath,
      };
    } catch (uploadError) {
      return adminRedirect(request, `/admin/products/${id}/edit`, {
        error:
          uploadError instanceof Error
            ? uploadError.message
            : "Image upload failed.",
      });
    }
  }

  const parsed = productImageSchema.safeParse({
    image_url: uploadedImage?.image_url || formData.get("image_url") || undefined,
    storage_path:
      uploadedImage?.storage_path || formData.get("storage_path") || undefined,
    alt_text: formData.get("alt_text") || undefined,
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
    await removeProductImageStoragePaths([uploadedImage?.storage_path]);
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: parsed.error.issues[0]?.message ?? "Invalid image details.",
    });
  }

  if (!parsed.data.image_url) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: "Upload an image file or provide an image URL.",
    });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("product_images").insert({
    ...parsed.data,
    product_id: id,
  });

  if (error) {
    await removeProductImageStoragePaths([uploadedImage?.storage_path]);
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: error.message,
    });
  }

  return adminRedirect(request, `/admin/products/${id}/edit`, {
    success: "Image added.",
  });
}
