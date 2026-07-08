import { adminRedirect } from "@/lib/admin-forms";
import {
  getImageFiles,
  removeProductImageStoragePaths,
  tryRemoveProductImageStoragePaths,
  uploadYouMayAlsoLikeFeatureImageFile,
} from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

async function updateItem(request: Request, id: string, formData: FormData) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const productId = String(formData.get("product_id") ?? "");
  const displayOrder = Math.max(1, Number(formData.get("display_order") ?? 0));
  const file = getImageFiles(formData, "file")[0];
  const supabase = getSupabaseAdminClient();

  if (!productId) {
    return adminRedirect(request, "/admin/features", {
      error: "Select a product.",
    });
  }

  const { data: existingItem, error: existingError } = await supabase
    .from("you_may_also_like_items")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return adminRedirect(request, "/admin/features", { error: existingError.message });
  }

  if (!existingItem) {
    return adminRedirect(request, "/admin/features", {
      error: "You May Also Like product was not found.",
    });
  }

  let uploaded:
    | {
        imageUrl: string;
        storagePath: string;
      }
    | null = null;

  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (productError) throw productError;
    if (!product) throw new Error("Selected product was not found or is inactive.");

    if (file) {
      uploaded = await uploadYouMayAlsoLikeFeatureImageFile({
        file,
        productId,
      });
    }

    const { error } = await supabase
      .from("you_may_also_like_items")
      .update({
        exclude_current_product: formData.get("exclude_current_product") === "on",
        ...(uploaded
          ? {
              image_url: uploaded.imageUrl,
              storage_path: uploaded.storagePath,
            }
          : {}),
        product_id: productId,
        sort_order: Number.isFinite(displayOrder) ? displayOrder - 1 : 0,
      })
      .eq("id", id);

    if (error) throw error;

    if (uploaded) {
      await tryRemoveProductImageStoragePaths([existingItem.storage_path]);
    }
  } catch (error) {
    await removeProductImageStoragePaths([uploaded?.storagePath]);

    return adminRedirect(request, "/admin/features", {
      error:
        error instanceof Error
          ? error.message
          : "You May Also Like product could not be updated.",
    });
  }

  return adminRedirect(request, "/admin/features", {
    success: "You May Also Like product updated.",
  });
}

async function deleteItem(request: Request, id: string) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { data: item, error: itemError } = await supabase
    .from("you_may_also_like_items")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (itemError) {
    return adminRedirect(request, "/admin/features", { error: itemError.message });
  }

  const { error } = await supabase
    .from("you_may_also_like_items")
    .delete()
    .eq("id", id);

  if (error) {
    return adminRedirect(request, "/admin/features", { error: error.message });
  }

  await tryRemoveProductImageStoragePaths([item?.storage_path]);

  return adminRedirect(request, "/admin/features", {
    success: "You May Also Like product deleted.",
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  const method = String(formData.get("_method") ?? "").toUpperCase();

  if (method === "PATCH") {
    return updateItem(request, id, formData);
  }

  return deleteItem(request, id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  return updateItem(request, id, formData);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return deleteItem(request, id);
}
