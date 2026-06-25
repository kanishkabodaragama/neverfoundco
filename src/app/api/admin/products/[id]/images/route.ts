import { NextResponse } from "next/server";
import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productImageSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
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
    if (file.size > 2 * 1024 * 1024) {
      return adminRedirect(request, `/admin/products/${id}/edit`, {
        error: "Image must be 2 MB or smaller.",
      });
    }

    const extension = file.name.split(".").pop() || "jpg";
    const storagePath = `${id}/${crypto.randomUUID()}.${extension}`;
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

    uploadedImage = {
      image_url: publicUrl,
      storage_path: storagePath,
    };
  }

  const parsed = productImageSchema.safeParse({
    image_url: uploadedImage?.image_url || formData.get("image_url") || undefined,
    storage_path:
      uploadedImage?.storage_path || formData.get("storage_path") || undefined,
    alt_text: formData.get("alt_text") || undefined,
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
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
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: error.message,
    });
  }

  return adminRedirect(request, `/admin/products/${id}/edit`, {
    success: "Image added.",
  });
}
