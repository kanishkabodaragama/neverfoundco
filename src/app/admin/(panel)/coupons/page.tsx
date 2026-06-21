import { requireAdmin } from "@/lib/admin-auth";
import { listAdminCoupons } from "@/lib/db/admin";
import { listAdminProducts } from "@/lib/db/products";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await requireAdmin();
  const [coupons, products] = await Promise.all([
    listAdminCoupons(),
    listAdminProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
            Promotions
          </p>
          <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
            Coupons
          </h1>
        </div>
        <details className="relative">
          <summary className="cursor-pointer bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF] marker:content-['']">
            Create coupon code
          </summary>
          <div className="absolute right-0 z-30 mt-3 w-[min(92vw,720px)] border border-[#F7F1E6]/10 bg-[#0B111C] p-5 shadow-2xl">
            <CouponForm products={products} />
          </div>
        </details>
      </div>

      <div className="overflow-x-auto border border-[#F7F1E6]/10 bg-[#0B111C]">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase text-[#F7F1E6]/50">
            <tr className="border-b border-[#F7F1E6]/10">
              <th className="px-4 py-4">Code</th>
              <th className="px-4 py-4">Discount</th>
              <th className="px-4 py-4">Usage</th>
              <th className="px-4 py-4">Date range</th>
              <th className="px-4 py-4">Products</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr className="border-b border-[#F7F1E6]/10" key={coupon.id}>
                <td className="px-4 py-4 font-mono font-black text-[#FFF9EF]">
                  {coupon.code}
                </td>
                <td className="px-4 py-4">
                  {coupon.discount_type === "flat"
                    ? formatCurrency(Number(coupon.discount_value))
                    : `${coupon.discount_value}%`}
                </td>
                <td className="px-4 py-4">
                  {coupon.used_count}
                  {coupon.usage_limit ? ` / ${coupon.usage_limit}` : " / unlimited"}
                </td>
                <td className="px-4 py-4 text-[#F7F1E6]/60">
                  {formatDate(coupon.starts_at)} - {formatDate(coupon.ends_at)}
                </td>
                <td className="px-4 py-4">
                  {coupon.coupon_products.length
                    ? `${coupon.coupon_products.length} selected`
                    : "All products"}
                </td>
                <td className="px-4 py-4">
                  <span className="border border-[#B8A8E8]/40 px-2 py-1 text-xs uppercase text-[#B8A8E8]">
                    {coupon.is_active ? "Active" : "Paused"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <details className="relative inline-block">
                    <summary className="cursor-pointer border border-[#F7F1E6]/20 px-3 py-2 text-xs font-black uppercase marker:content-[''] hover:border-[#F05267]">
                      Actions
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 grid w-36 border border-[#F7F1E6]/10 bg-[#070B12] p-2 text-left shadow-xl">
                      <form action={`/api/admin/coupons/${coupon.id}`} method="post">
                        <input name="_method" type="hidden" value="TOGGLE_ACTIVE" />
                        <input
                          name="is_active"
                          type="hidden"
                          value={coupon.is_active ? "false" : "true"}
                        />
                        <button className="w-full px-3 py-2 text-left text-xs font-black uppercase hover:bg-[#F05267]" type="submit">
                          {coupon.is_active ? "Pause" : "Activate"}
                        </button>
                      </form>
                      <form action={`/api/admin/coupons/${coupon.id}`} method="post">
                        <input name="_method" type="hidden" value="DELETE" />
                        <button className="w-full px-3 py-2 text-left text-xs font-black uppercase text-[#F05267] hover:bg-[#F05267] hover:text-[#FFF9EF]" type="submit">
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
      {coupons.length === 0 ? (
        <p className="border border-[#F7F1E6]/10 bg-[#0B111C] p-6 text-sm text-[#F7F1E6]/55">
          No coupon codes yet.
        </p>
      ) : null}
    </div>
  );
}

function CouponForm({ products }: { products: Awaited<ReturnType<typeof listAdminProducts>> }) {
  return (
    <form action="/api/admin/coupons" className="grid gap-4" method="post">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Code" name="code" placeholder="DROP10" />
        <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
          Discount type
          <select className="admin-input" name="discount_type">
            <option value="flat">Flat amount off</option>
            <option value="percentage">Percentage off</option>
          </select>
        </label>
        <Field label="Discount value" name="discount_value" placeholder="500" type="number" />
        <Field label="Usage limit" name="usage_limit" placeholder="100" type="number" />
        <Field label="Starts at" name="starts_at" type="datetime-local" />
        <Field label="Ends at" name="ends_at" type="datetime-local" />
      </div>
      <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
        Description
        <textarea className="admin-input min-h-24" name="description" />
      </label>
      <label className="flex items-center gap-3 text-sm font-black uppercase">
        <input defaultChecked name="is_active" type="checkbox" value="true" />
        Active coupon
      </label>
      <details className="border border-[#F7F1E6]/10 p-4">
        <summary className="cursor-pointer text-sm font-black uppercase text-[#B8A8E8]">
          Advanced settings
        </summary>
        <div className="mt-4 grid max-h-56 gap-2 overflow-auto">
          {products.map((product) => (
            <label className="flex items-center gap-3 text-sm" key={product.id}>
              <input name="product_ids" type="checkbox" value={product.id} />
              <span>{product.name}</span>
            </label>
          ))}
          {products.length === 0 ? (
            <p className="text-sm text-[#F7F1E6]/50">Add products before restricting coupons.</p>
          ) : null}
        </div>
      </details>
      <button className="bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF]" type="submit">
        Save coupon
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
      {label}
      <input className="admin-input" name={name} placeholder={placeholder} type={type} />
    </label>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Open";
  return new Date(value).toLocaleDateString("en-LK");
}
