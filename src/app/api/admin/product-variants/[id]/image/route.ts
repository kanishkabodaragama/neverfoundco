import { NextResponse } from "next/server";
import { adminRedirect } from "@/lib/admin-forms";
import {
  removeProductImageStoragePaths,
  tryRemoveProductImageStoragePaths,
} from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

  if (file.size > MAX_FILE_SIZE) {
    if (wantsJson) {
      return NextResponse.json({ error: "Image must be 2 MB or smaller." }, { status: 400 });
    }
    return adminRedirect(request, redirectTo, {
      error: "Image must be 2 MB or smaller.",
    });
  }

  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `variants/${id}/${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseAdminClient();
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(storagePath);

  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (variantError || !variant) {
    await removeProductImageStoragePaths([storagePath]);
    const message = variantError?.message ?? "Variant not found.";
    if (wantsJson) return NextResponse.json({ error: message }, { status: 404 });
    return adminRedirect(request, redirectTo, { error: message });
  }

  const { error } = await supabase
    .from("product_variants")
    .update({
      image_url: publicUrl,
      storage_path: storagePath,
    })
    .eq("id", id);

  if (error) {
    await removeProductImageStoragePaths([storagePath]);
    if (wantsJson) return NextResponse.json({ error: error.message }, { status: 400 });
    return adminRedirect(request, redirectTo, { error: error.message });
  }

  if (variant.storage_path) {
    await tryRemoveProductImageStoragePaths([variant.storage_path]);
  }

  if (wantsJson) {
    return NextResponse.json({ imageUrl: publicUrl, storagePath });
  }

  return adminRedirect(request, redirectTo, {
    success: "Variant image uploaded.",
  });
}
