import { adminRedirect } from "@/lib/admin-forms";
import {
  removeProductImageStoragePaths,
  uploadStorefrontGalleryImageFile,
} from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return adminRedirect(request, "/admin/gallery", {
      error: "Choose an image to upload.",
    });
  }

  let uploadedImage:
    | {
        imageUrl: string;
        storagePath: string;
      }
    | null = null;

  try {
    uploadedImage = await uploadStorefrontGalleryImageFile({ file });

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("storefront_gallery_images").insert({
      image_url: uploadedImage.imageUrl,
      storage_path: uploadedImage.storagePath,
      alt_text: formData.get("alt_text") || null,
    });

    if (error) throw error;
  } catch (error) {
    await removeProductImageStoragePaths([uploadedImage?.storagePath]);

    return adminRedirect(request, "/admin/gallery", {
      error:
        error instanceof Error ? error.message : "Gallery image upload failed.",
    });
  }

  return adminRedirect(request, "/admin/gallery", {
    success: "Gallery image uploaded.",
  });
}

