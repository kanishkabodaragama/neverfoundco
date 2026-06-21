import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/db/products";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await listAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
            Catalog
          </p>
          <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
            Products
          </h1>
        </div>
        <Link
          className="bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
          href="/admin/products/new"
        >
          Add product
        </Link>
      </div>
      <div className="overflow-x-auto border border-[#F7F1E6]/10 bg-[#0B111C]">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead className="text-xs uppercase text-[#F7F1E6]/50">
            <tr className="border-b border-[#F7F1E6]/10">
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Slug</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Stock</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-b border-[#F7F1E6]/10" key={product.id}>
                <td className="px-4 py-4 font-black uppercase text-[#FFF9EF]">
                  {product.name}
                </td>
                <td className="px-4 py-4 font-mono text-xs text-[#F7F1E6]/55">
                  {product.slug}
                </td>
                <td className="px-4 py-4">
                  {formatCurrency(Number(product.sale_price ?? product.price))}
                </td>
                <td className="px-4 py-4">{product.stock_quantity}</td>
                <td className="px-4 py-4">
                  <span className="border border-[#B8A8E8]/40 px-2 py-1 text-xs uppercase text-[#B8A8E8]">
                    {product.is_active ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <details className="relative inline-block">
                    <summary className="cursor-pointer border border-[#F7F1E6]/20 px-3 py-2 text-xs font-black uppercase marker:content-[''] hover:border-[#F05267]">
                      Actions
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 grid w-40 border border-[#F7F1E6]/10 bg-[#070B12] p-2 text-left shadow-xl">
                      <Link
                        className="px-3 py-2 text-xs font-black uppercase hover:bg-[#F05267] hover:text-[#FFF9EF]"
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
                          className="w-full px-3 py-2 text-left text-xs font-black uppercase hover:bg-[#F05267] hover:text-[#FFF9EF]"
                          type="submit"
                        >
                          {product.is_active ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={`/api/admin/products/${product.id}`} method="post">
                        <input name="_method" type="hidden" value="DELETE" />
                        <button
                          className="w-full px-3 py-2 text-left text-xs font-black uppercase text-[#F05267] hover:bg-[#F05267] hover:text-[#FFF9EF]"
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
      {products.length === 0 ? (
        <p className="border border-[#F7F1E6]/10 bg-[#0B111C] p-6 text-sm text-[#F7F1E6]/55">
          No products yet.
        </p>
      ) : null}
    </div>
  );
}
