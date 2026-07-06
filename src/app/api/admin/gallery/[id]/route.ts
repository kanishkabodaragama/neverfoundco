import { adminRedirect } from "@/lib/admin-forms";
import { tryRemoveProductImageStoragePaths } from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  const { data: image, error: imageError } = await supabase
    .from("storefront_gallery_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (imageError) {
    return adminRedirect(request, "/admin/gallery", {
      error: imageError.message,
    });
  }

  const { error } = await supabase
    .from("storefront_gallery_images")
    .delete()
    .eq("id", id);

  if (error) {
    return adminRedirect(request, "/admin/gallery", {
      error: error.message,
    });
  }

  await tryRemoveProductImageStoragePaths([image?.storage_path]);

  return adminRedirect(request, "/admin/gallery", {
    success: "Gallery image deleted.",
  });
}

