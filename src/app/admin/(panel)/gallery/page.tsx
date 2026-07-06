import Image from "next/image";
import { X } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { StorefrontGalleryUploadForm } from "@/components/admin/storefront-gallery-upload-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listStorefrontGalleryImages } from "@/lib/db/storefront-gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [flash, images] = await Promise.all([
    searchParams,
    listStorefrontGalleryImages(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
          <p className="admin-muted mt-2 text-sm">
            Add and remove images used by the storefront Never Found gallery.
            Latest uploads appear first.
          </p>
        </div>
      </div>

      <AdminAlert error={flash.error} success={flash.success} />

      <section className="admin-card overflow-hidden">
        <StorefrontGalleryUploadForm />
        {images.length ? (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[1080px]">
              <thead>
                <tr>
                  {Array.from({ length: 6 }, (_, index) => (
                    <th className="text-center" key={index}>
                      Image {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chunkImages(images, 6).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: 6 }, (_, columnIndex) => {
                      const image = row[columnIndex];

                      return (
                        <td className="align-top" key={columnIndex}>
                          {image ? (
                            <div className="relative mx-auto h-36 w-28 overflow-hidden rounded-md border border-[#ece7df] bg-[#f6f3ef]">
                              <Image
                                alt={image.alt_text ?? "Gallery image"}
                                className="object-cover"
                                fill
                                sizes="112px"
                                src={image.image_url}
                                unoptimized
                              />
                              <form
                                action={`/api/admin/gallery/${image.id}`}
                                method="post"
                              >
                                <button
                                  aria-label="Delete gallery image"
                                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md bg-[#332c26] text-white shadow-sm transition hover:bg-red-600"
                                  type="submit"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </form>
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-sm font-semibold text-[#81796f]">
            No gallery images yet. Use the add image button above to upload the
            first image.
          </div>
        )}
      </section>
    </div>
  );
}

function chunkImages<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

