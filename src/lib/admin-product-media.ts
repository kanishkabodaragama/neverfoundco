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

export async function removeProductImageStoragePaths(paths: Array<string | null | undefined>) {
  const storagePaths = paths.filter((path): path is string => Boolean(path));
  if (!storagePaths.length) return;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from("product-images").remove(storagePaths);
  if (error) throw new Error(error.message);
}

export async function tryRemoveProductImageStoragePaths(paths: Array<string | null | undefined>) {
  try {
    await removeProductImageStoragePaths(paths);
  } catch {
    // The database row is the source of truth; stale storage cleanup must not fail a saved product.
  }
}

export function getImageFiles(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function getProductImageStoragePathFromUrl(url: string | null | undefined) {
  if (!url) return null;

  const marker = "/storage/v1/object/public/product-images/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return null;

  return decodeURIComponent(
    url.slice(markerIndex + marker.length).split("?")[0] ?? "",
  );
}
