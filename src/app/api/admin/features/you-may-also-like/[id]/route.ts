import { adminRedirect } from "@/lib/admin-forms";
import { tryRemoveProductImageStoragePaths } from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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
  return deleteItem(request, id);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return deleteItem(request, id);
}
