import { NextResponse } from "next/server";
import { adminRedirect } from "@/lib/admin-forms";
import {
  removeProductImageStoragePaths,
  tryRemoveProductImageStoragePaths,
  uploadProductImageFile,
} from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestUrl = new URL(request.url);
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const auth = await requireAdminApi(wantsJson ? undefined : request);
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const redirectTo = String(
    formData.get("redirect_to") ??
      requestUrl.searchParams.get("redirect_to") ??
      "/admin/products",
  );
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    if (wantsJson) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    return adminRedirect(request, redirectTo, {
      error: "Choose an image to upload.",
    });
  }

  const supabase = getSupabaseAdminClient();
  let uploaded: Awaited<ReturnType<typeof uploadProductImageFile>>;

  try {
    uploaded = await uploadProductImageFile({
      file,
      productId: `variants/${id}`,
      prefix: "variant",
    });
  } catch (uploadError) {
    const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
    if (wantsJson) return NextResponse.json({ error: message }, { status: 400 });
    return adminRedirect(request, redirectTo, { error: message });
  }

  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (variantError || !variant) {
    await removeProductImageStoragePaths([uploaded.storagePath]);
    const message = variantError?.message ?? "Variant not found.";
    if (wantsJson) return NextResponse.json({ error: message }, { status: 404 });
    return adminRedirect(request, redirectTo, { error: message });
  }

  const { data: updatedVariant, error } = await supabase
    .from("product_variants")
    .update({
      image_url: uploaded.imageUrl,
      storage_path: uploaded.storagePath,
    })
    .eq("id", id)
    .select("image_url, storage_path")
    .single();

  if (error) {
    await removeProductImageStoragePaths([uploaded.storagePath]);
    if (wantsJson) return NextResponse.json({ error: error.message }, { status: 400 });
    return adminRedirect(request, redirectTo, { error: error.message });
  }
  if (
    updatedVariant?.image_url !== uploaded.imageUrl ||
    updatedVariant?.storage_path !== uploaded.storagePath
  ) {
    await removeProductImageStoragePaths([uploaded.storagePath]);
    const message = "Variant image was uploaded but could not be verified in the database.";
    if (wantsJson) return NextResponse.json({ error: message }, { status: 400 });
    return adminRedirect(request, redirectTo, { error: message });
  }

  if (variant.storage_path) {
    await tryRemoveProductImageStoragePaths([variant.storage_path]);
  }

  if (wantsJson) {
    return NextResponse.json({
      imageUrl: uploaded.imageUrl,
      storagePath: uploaded.storagePath,
    });
  }

  return adminRedirect(request, redirectTo, {
    success: "Variant image uploaded.",
  });
}
