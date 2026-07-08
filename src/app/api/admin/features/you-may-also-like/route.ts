import { adminRedirect } from "@/lib/admin-forms";
import {
  getImageFiles,
  removeProductImageStoragePaths,
  uploadYouMayAlsoLikeFeatureImageFile,
} from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const productId = String(formData.get("product_id") ?? "");
  const file = getImageFiles(formData, "file")[0];
  const displayOrder = Math.max(1, Number(formData.get("display_order") ?? 0));

  if (!productId) {
    return adminRedirect(request, "/admin/features", {
      error: "Select a product.",
    });
  }

  if (!file) {
    return adminRedirect(request, "/admin/features", {
      error: "Upload a feature image.",
    });
  }

  let uploaded:
    | {
        imageUrl: string;
        storagePath: string;
      }
    | null = null;

  try {
    const supabase = getSupabaseAdminClient();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (productError) throw productError;
    if (!product) throw new Error("Selected product was not found or is inactive.");

    const { count, error: countError } = await supabase
      .from("you_may_also_like_items")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    uploaded = await uploadYouMayAlsoLikeFeatureImageFile({
      file,
      productId,
    });

    const { error } = await supabase.from("you_may_also_like_items").insert({
      exclude_current_product: formData.get("exclude_current_product") === "on",
      image_url: uploaded.imageUrl,
      product_id: productId,
      sort_order: Number.isFinite(displayOrder)
        ? displayOrder - 1
        : count ?? 0,
      storage_path: uploaded.storagePath,
    });

    if (error) throw error;
  } catch (error) {
    await removeProductImageStoragePaths([uploaded?.storagePath]);

    return adminRedirect(request, "/admin/features", {
      error:
        error instanceof Error
          ? error.message
          : "You May Also Like product could not be created.",
    });
  }

  return adminRedirect(request, "/admin/features", {
    success: "You May Also Like product created.",
  });
}
