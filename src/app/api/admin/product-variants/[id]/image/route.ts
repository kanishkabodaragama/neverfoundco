import { NextResponse } from "next/server";
import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const requestUrl = new URL(request.url);
  const redirectTo = String(
    formData.get("redirect_to") ??
      requestUrl.searchParams.get("redirect_to") ??
      "/admin/products",
  );
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return adminRedirect(request, redirectTo, {
      error: "Choose an image to upload.",
    });
  }

  if (file.size > MAX_FILE_SIZE) {
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

  const { data: variant } = await supabase
    .from("product_variants")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (variant?.storage_path) {
    await supabase.storage.from("product-images").remove([variant.storage_path]);
  }

  const { error } = await supabase
    .from("product_variants")
    .update({
      image_url: publicUrl,
      storage_path: storagePath,
    })
    .eq("id", id);

  if (error) {
    return adminRedirect(request, redirectTo, { error: error.message });
  }

  return adminRedirect(request, redirectTo, {
    success: "Variant image uploaded.",
  });
}
