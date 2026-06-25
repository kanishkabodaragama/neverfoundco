import Link from "next/link";
import { MoreHorizontal, Percent, Plus, Search, Trash2 } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { CsvDownloadButton } from "@/components/admin/csv-download-button";
import { AdminModal } from "@/components/admin/admin-modal";
import { CouponForm } from "@/components/admin/coupon-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminCoupons } from "@/lib/db/admin";
import { listAdminProducts } from "@/lib/db/products";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [flash, coupons, products] = await Promise.all([
    searchParams,
    listAdminCoupons(),
    listAdminProducts(),
  ]);
  const couponRows = coupons.map((coupon) => ({
    code: coupon.code,
    discount:
      coupon.discount_type === "flat"
        ? Number(coupon.discount_value).toFixed(2)
        : `${coupon.discount_value}%`,
    usage: coupon.used_count,
    limit: coupon.usage_limit ?? "Unlimited",
    starts: formatDate(coupon.starts_at),
    ends: formatDate(coupon.ends_at),
    products: coupon.coupon_products.length
      ? `${coupon.coupon_products.length} selected`
      : "All products",
    status: coupon.is_active ? "Active" : "Paused",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="admin-muted mt-2 text-sm">
            Manage discount codes, active dates, usage limits, and product restrictions.
          </p>
        </div>
        <AdminModal
          title="Create coupon"
          trigger={<span className="admin-action flex items-center gap-2 px-4 py-2.5"><Plus className="h-4 w-4" />Create coupon</span>}
          width="w-[min(92vw,760px)]"
        >
          <CouponForm products={products} />
        </AdminModal>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />

      <section className="admin-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#ece7df] p-4">
          <label className="relative min-w-72 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#81796f]" />
            <input className="admin-input admin-search-input w-full" placeholder="Search coupons by code or status" />
          </label>
          <CsvDownloadButton
            columns={[
              { key: "code", label: "Code" },
              { key: "discount", label: "Discount" },
              { key: "usage", label: "Total Usage" },
              { key: "limit", label: "Limit" },
              { key: "starts", label: "Starts" },
              { key: "ends", label: "Ends" },
              { key: "products", label: "Products" },
              { key: "status", label: "Status" },
            ]}
            filename="neverfoundco-coupons"
            rows={couponRows}
            title="Never Found Co Coupons"
          />
        </div>
        <div className="overflow-x-visible">
          <table className="admin-table min-w-[980px]">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Total usage</th>
                <th>Limit</th>
                <th>Date range</th>
                <th>Products</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>
                    <span className="inline-flex items-center gap-3 font-semibold">
                      <Percent className="h-4 w-4 text-[#a7835d]" />
                      {coupon.code}
                    </span>
                  </td>
                  <td>
                    {coupon.discount_type === "flat"
                      ? formatCurrency(Number(coupon.discount_value))
                      : `${coupon.discount_value}%`}
                  </td>
                  <td>
                    {coupon.used_count}
                  </td>
                  <td>
                    {coupon.usage_limit ? coupon.usage_limit : "Unlimited"}
                  </td>
                  <td className="admin-muted">
                    {formatDate(coupon.starts_at)} - {formatDate(coupon.ends_at)}
                  </td>
                  <td>
                    {coupon.coupon_products.length
                      ? `${coupon.coupon_products.length} selected`
                      : "All products"}
                  </td>
                  <td>
                    <span className={`rounded-md border px-3 py-1.5 text-[0.7rem] font-semibold uppercase ${
                      coupon.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                        : "border-zinc-200 bg-zinc-50 text-zinc-400"
                    }`}>
                      {coupon.is_active ? "Active" : "Paused"}
                    </span>
                  </td>
                  <td className="text-right">
                    <details className="relative z-20 inline-block">
                      <summary className="admin-secondary-action inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center marker:content-['']">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-40 p-2 text-left">
                        <Link className="rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]" href={`/admin/coupons/${coupon.id}/edit`}>
                          Edit
                        </Link>
                        <form action={`/api/admin/coupons/${coupon.id}`} method="post">
                          <input name="_method" type="hidden" value="TOGGLE_ACTIVE" />
                          <input name="is_active" type="hidden" value={coupon.is_active ? "false" : "true"} />
                          <button className="w-full rounded px-3 py-2 text-left text-sm font-semibold hover:bg-[#f6f3ef]" type="submit">
                            {coupon.is_active ? "Pause" : "Activate"}
                          </button>
                        </form>
                        <form action={`/api/admin/coupons/${coupon.id}`} method="post">
                          <input name="_method" type="hidden" value="DELETE" />
                          <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50" type="submit">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 ? (
                <tr>
                  <td className="admin-muted" colSpan={8}>No coupon codes yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Open";
  return new Date(value).toLocaleDateString("en-LK");
}
