import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { admin } = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
          Control panel
        </p>
        <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[#F7F1E6]/60">Signed in as {admin.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Revenue" value={formatCurrency(stats.totalRevenue)} />
        <Metric label="Orders" value={String(stats.orderCount)} />
        <Metric label="Pending" value={String(stats.pendingOrders)} />
        <Metric label="Products" value={String(stats.productCount)} />
        <Metric label="Coupons" value={String(stats.activeCoupons)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="border border-[#F7F1E6]/10 bg-[#0B111C] p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-mono text-xl font-black uppercase">Recent orders</h2>
            <Link className="text-xs font-black uppercase text-[#F05267]" href="/admin/orders">
              View all
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase text-[#F7F1E6]/50">
                <tr className="border-b border-[#F7F1E6]/10">
                  <th className="py-3">Order</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr className="border-b border-[#F7F1E6]/10" key={order.id}>
                    <td className="py-3">
                      <Link className="text-[#FFF9EF]" href={`/admin/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 text-[#F7F1E6]/70">{order.customer_name}</td>
                    <td className="py-3">
                      <span className="border border-[#B8A8E8]/40 px-2 py-1 text-xs uppercase text-[#B8A8E8]">
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">{formatCurrency(Number(order.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.recentOrders.length === 0 ? (
              <p className="py-8 text-sm text-[#F7F1E6]/55">No orders yet.</p>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3">
          {[
            ["Add product", "/admin/products/new"],
            ["Create coupon", "/admin/coupons"],
            ["Shipping rules", "/admin/settings/shipping"],
          ].map(([label, href]) => (
            <Link
              className="border border-[#F7F1E6]/10 bg-[#0B111C] p-5 font-mono text-sm font-black uppercase transition hover:translate-x-0.5 hover:border-[#F05267]"
              href={href}
              key={href}
            >
              {label} -&gt;
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#F7F1E6]/10 bg-[#0B111C] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-[#B8A8E8]">
        {label}
      </p>
      <p className="mt-3 font-mono text-2xl font-black uppercase text-[#FFF9EF]">
        {value}
      </p>
    </div>
  );
}
