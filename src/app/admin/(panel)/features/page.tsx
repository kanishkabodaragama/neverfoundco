import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { YouMayAlsoLikeFeatureForm } from "@/components/admin/you-may-also-like-feature-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/db/products";
import { listAdminYouMayAlsoLikeItems } from "@/lib/db/you-may-also-like";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [flash, products, items] = await Promise.all([
    searchParams,
    listAdminProducts(),
    listAdminYouMayAlsoLikeItems(),
  ]);
  const activeProducts = products.filter((product) => product.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Features</h1>
        <p className="admin-muted mt-2 text-sm">
          Manage storefront feature sections. The active tab is You May Also Like.
        </p>
      </div>

      <AdminAlert error={flash.error} success={flash.success} />

      <div className="flex gap-2 border-b border-[#ece7df]">
        <button
          className="border-b-2 border-[#332c26] px-4 py-3 text-sm font-semibold"
          type="button"
        >
          You May Also Like
        </button>
      </div>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-[#ece7df] p-4">
          <h2 className="font-semibold">Add product</h2>
          <p className="admin-muted mt-1 text-sm">
            Upload the image used in the product-page carousel, then choose the product it links to.
          </p>
        </div>
        <YouMayAlsoLikeFeatureForm products={activeProducts} />

        {items.length ? (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[920px]">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Same product rule</th>
                  <th>Created</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="relative h-24 w-20 overflow-hidden rounded-md border border-[#ece7df] bg-[#f6f3ef]">
                        <Image
                          alt={item.products?.name ?? "You may also like product"}
                          className="object-cover"
                          fill
                          sizes="80px"
                          src={item.image_url}
                          unoptimized
                        />
                      </div>
                    </td>
                    <td>
                      {item.products ? (
                        <Link
                          className="font-semibold underline underline-offset-4"
                          href={`/admin/products/${item.products.id}/edit`}
                        >
                          {item.products.name}
                        </Link>
                      ) : (
                        <span className="text-red-600">Product missing</span>
                      )}
                    </td>
                    <td>
                      {item.exclude_current_product
                        ? "Hidden on its own product page"
                        : "Can show on its own product page"}
                    </td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td className="text-right">
                      <form action={`/api/admin/features/you-may-also-like/${item.id}`} method="post">
                        <button
                          aria-label="Delete feature item"
                          className="admin-secondary-action inline-flex h-9 w-9 items-center justify-center text-red-500"
                          type="submit"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-sm font-semibold text-[#81796f]">
            No You May Also Like products yet.
          </div>
        )}
      </section>
    </div>
  );
}
