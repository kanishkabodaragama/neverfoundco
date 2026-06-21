import { NextResponse } from "next/server";
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

  const parsed = productImageSchema.parse({
    image_url: uploadedImage?.image_url || formData.get("image_url") || undefined,
    storage_path:
      uploadedImage?.storage_path || formData.get("storage_path") || undefined,
    alt_text: formData.get("alt_text") || undefined,
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.image_url) {
    return NextResponse.json(
      { error: "Upload an image file or provide an image URL." },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("product_images").insert({
    ...parsed,
    product_id: id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(
    new URL(`/admin/products/${id}/edit`, request.url),
    303,
  );
}
