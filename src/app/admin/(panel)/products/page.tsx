import Image from "next/image";
import Link from "next/link";
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { CsvDownloadButton } from "@/components/admin/csv-download-button";
import { requireAdmin } from "@/lib/admin-auth";
import { formatColomboDateKey } from "@/lib/date-time";
import { listAdminProducts } from "@/lib/db/products";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const flash = await searchParams;
  const products = await listAdminProducts();
  const productRows = products.map((product) => ({
    sku: product.slug.slice(0, 8).toUpperCase(),
    name: product.name,
    category: product.category,
    price: Number(product.price).toFixed(2),
    sale_price: product.sale_price ? Number(product.sale_price).toFixed(2) : "",
    stock: product.stock_quantity,
    status: product.is_active ? "Active" : "Draft",
    updated: formatColomboDateKey(product.updated_at),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="admin-muted mt-2 text-sm">
          Manage catalog records, inventory, prices, and publication status.
        </p>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />
      <div className="admin-card overflow-visible">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#ece7df] p-4">
          <label className="relative min-w-72 flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#81796f]" />
            <input
              className="admin-input admin-search-input w-full"
              placeholder="Search products by SKU, name, brand, or category"
              type="search"
            />
          </label>
          <button className="admin-secondary-action flex items-center gap-2 px-3 py-2.5" type="button">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <CsvDownloadButton
            columns={[
              { key: "sku", label: "SKU" },
              { key: "name", label: "Product" },
              { key: "category", label: "Category" },
              { key: "price", label: "Price" },
              { key: "sale_price", label: "Sale Price" },
              { key: "stock", label: "Stock" },
              { key: "status", label: "Status" },
              { key: "updated", label: "Updated" },
            ]}
            filename="neverfoundco-products"
            rows={productRows}
            title="Never Found Co Products"
          />
          <Link
            className="admin-action flex items-center gap-2 px-4 py-2.5"
            href="/admin/products/new"
          >
            <Plus className="h-4 w-4" />
            Create product
          </Link>
        </div>
        <div className="flex border-b border-[#ece7df] px-3 py-2">
          <span className="rounded-md bg-[#332c26] px-4 py-2 text-sm font-semibold text-white">
            Active <span className="ml-2 opacity-65">{products.filter((product) => product.is_active).length}</span>
          </span>
          <span className="px-4 py-2 text-sm font-semibold text-[#9a9288]">
            Trash 0
          </span>
        </div>
        <div className="overflow-x-visible pb-28">
          <table className="admin-table min-w-[980px]">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Updated</th>
                <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="font-semibold text-[#4a4037]">
                  {product.slug.slice(0, 8).toUpperCase()}
                </td>
                <td>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border border-[#ece7df] bg-[#f6f3ef]">
                      {product.main_image_url || product.product_images?.[0]?.image_url ? (
                        <Image
                          alt={product.name}
                          className="object-cover"
                          fill
                          sizes="48px"
                          src={product.main_image_url ?? product.product_images[0].image_url}
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <Link className="font-semibold hover:text-[#a7835d]" href={`/admin/products/${product.id}/edit`}>
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>
                  {formatCurrency(Number(product.sale_price ?? product.price))}
                </td>
                <td>{product.stock_quantity}</td>
                <td>
                  <span className={`rounded-md border px-3 py-1.5 text-[0.7rem] font-semibold uppercase ${
                    product.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-400"
                      : "border-zinc-200 bg-zinc-50 text-zinc-400"
                  }`}>
                    {product.is_active ? "Active" : "Draft"}
                  </span>
                </td>
                <td>{formatColomboDateKey(product.updated_at)}</td>
                <td className="text-right">
                  <details className="relative z-20 inline-block">
                    <summary className="admin-secondary-action flex h-9 w-9 cursor-pointer items-center justify-center marker:content-['']">
                      <MoreHorizontal className="h-4 w-4" />
                    </summary>
                    <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-40 p-2 text-left">
                      <Link
                        className="rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]"
                        href={`/admin/products/${product.id}/edit`}
                      >
                        Edit
                      </Link>
                      <form action={`/api/admin/products/${product.id}`} method="post">
                        <input name="_method" type="hidden" value="TOGGLE_ACTIVE" />
                        <input
                          name="is_active"
                          type="hidden"
                          value={product.is_active ? "false" : "true"}
                        />
                        <button
                          className="w-full rounded px-3 py-2 text-left text-sm font-semibold hover:bg-[#f6f3ef]"
                          type="submit"
                        >
                          {product.is_active ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={`/api/admin/products/${product.id}`} method="post">
                        <input name="_method" type="hidden" value="DELETE" />
                        <button
                          className="w-full rounded px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                          type="submit"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="admin-card p-6 text-sm text-[#81796f]">
          No products yet.
        </p>
      ) : null}
    </div>
  );
}
