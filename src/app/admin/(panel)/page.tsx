import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardStats } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";
import { Boxes, ClipboardList, Percent, Truck, type LucideIcon } from "lucide-react";

const quickActions: Array<[string, string, LucideIcon]> = [
  ["Create product", "/admin/products/new", Boxes],
  ["Review orders", "/admin/orders", ClipboardList],
  ["Create coupon", "/admin/coupons", Percent],
  ["Shipping rates", "/admin/settings/shipping", Truck],
];

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { admin } = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="admin-muted mt-2">
          Live ecommerce snapshot for orders, sales, catalog, and admin actions.
        </p>
        <p className="admin-muted mt-1 text-sm">Signed in as {admin.email}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Total sales" value={formatCurrency(stats.totalSales)} helper="paid orders" />
        <Metric label="Active orders" value={String(stats.activeOrders)} helper="not completed or cancelled" />
        <Metric label="Total orders" value={String(stats.orderCount)} helper="all time" />
        <Metric label="Total products" value={String(stats.productCount)} helper="catalog records" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="admin-card p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link className="text-sm font-semibold text-[#a7835d]" href="/admin/orders">
              View all
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="admin-table min-w-[620px]">
              <thead>
                <tr>
                  <th className="py-3">Order</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3">
                      <Link className="font-semibold" href={`/admin/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3">{order.customer_name}</td>
                    <td className="py-3">
                      <span className="rounded-md border border-[#ece7df] bg-[#f6f3ef] px-3 py-1 text-xs font-semibold uppercase text-[#81796f]">
                        {order.order_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">{formatCurrency(Number(order.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.recentOrders.length === 0 ? (
              <p className="admin-muted py-8 text-sm">No orders yet.</p>
            ) : null}
          </div>
        </section>

        <section className="admin-card p-4">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <p className="admin-muted mt-1 text-sm">Common admin tasks for the current storefront workflow.</p>
          <div className="mt-4 grid gap-2.5">
          {quickActions.map(([label, href, Icon]) => (
            <Link
              className="admin-secondary-action flex items-center gap-3 px-4 py-3"
              href={href}
              key={href}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ helper, label, value }: { helper: string; label: string; value: string }) {
  return (
    <div className="admin-card p-4">
      <p className="admin-muted text-xs font-semibold uppercase tracking-[0.35em]">
        {label}
      </p>
      <p className="mt-4 text-3xl font-light">
        {value}
      </p>
      <p className="admin-muted mt-3 text-sm">{helper}</p>
    </div>
  );
}
