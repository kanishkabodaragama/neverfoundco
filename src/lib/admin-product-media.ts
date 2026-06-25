import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export async function uploadProductImageFile({
  file,
  productId,
  prefix = "gallery",
}: {
  file: File;
  productId: string;
  prefix?: string;
}) {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const storagePath = `${productId}/${prefix}-${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage
    .from("product-images")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(storagePath);

  return {
    imageUrl: publicUrl,
    storagePath,
  };
}

export function getImageFiles(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}
