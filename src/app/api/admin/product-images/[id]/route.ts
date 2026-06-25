import { NextResponse } from "next/server";
import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

async function deleteImage(request: Request, id: string, redirectTo?: string) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { data: image } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (image?.storage_path) {
    await supabase.storage.from("product-images").remove([image.storage_path]);
  }

  const { error } = await supabase.from("product_images").delete().eq("id", id);

  if (error) {
    if (redirectTo) return adminRedirect(request, redirectTo, { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (redirectTo) return adminRedirect(request, redirectTo, { success: "Image deleted." });
  return NextResponse.json({ ok: true });
}

async function updateImage(
  request: Request,
  id: string,
  redirectTo: string,
  formData: FormData,
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("product_images")
    .update({
      alt_text: formData.get("alt_text") || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);

  if (error) return adminRedirect(request, redirectTo, { error: error.message });
  return adminRedirect(request, redirectTo, { success: "Image updated." });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return deleteImage(request, id);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  const redirectTo =
    typeof formData.get("redirect_to") === "string"
      ? String(formData.get("redirect_to"))
      : "/admin/products";

  if (formData.get("_method") === "DELETE") {
    return deleteImage(request, id, redirectTo);
  }

  return updateImage(request, id, redirectTo, formData);
}
