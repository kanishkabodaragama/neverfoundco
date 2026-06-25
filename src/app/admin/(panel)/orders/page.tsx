import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminOrders } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";
import { Download, Filter, MoreHorizontal, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; payment?: string; q?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const orders = await listAdminOrders({
    status: query.status ?? "all",
    payment: query.payment ?? "all",
    search: query.q,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="admin-muted mt-2 text-sm">
          Review order timing, payment state, customer details, and fulfillment status.
        </p>
      </div>

      <div className="admin-card overflow-hidden">
        <form className="flex flex-wrap items-center gap-3 border-b border-[#ece7df] p-4">
          <label className="relative min-w-72 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#81796f]" />
            <input
              className="admin-input admin-search-input w-full"
              defaultValue={query.q ?? ""}
              name="q"
              placeholder="Search orders by ID, customer, date, or status"
            />
          </label>
          <Select defaultValue={query.status ?? "all"} name="status">
            <option value="all">All statuses</option>
            {["pending", "processing", "shipped", "completed", "cancelled"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>
          <button className="admin-secondary-action flex items-center gap-2 px-3 py-2.5" type="submit">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="admin-secondary-action flex items-center gap-2 px-3 py-2.5" type="button">
            <Download className="h-4 w-4" />
            Download
          </button>
        </form>
        <div className="overflow-x-visible">
        <table className="admin-table min-w-[980px]">
          <thead>
            <tr>
              <th className="px-4 py-4">Order</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Total</th>
              <th className="px-4 py-4">Payment</th>
              <th className="px-4 py-4">Order Status</th>
              <th className="px-4 py-4">Details</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 font-semibold">
                  <Link href={`/admin/orders/${order.id}`}>
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  {new Date(order.created_at).toLocaleDateString("en-LK")}
                </td>
                <td className="px-4 py-4">
                  {order.customer_name}
                </td>
                <td className="px-4 py-4">
                  {formatCurrency(Number(order.total))}
                </td>
                <td className="px-4 py-4">
                  {order.payment_status.toUpperCase()}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={order.order_status} />
                </td>
                <td className="px-4 py-4">
                  {order.city || order.district}
                </td>
                <td className="px-4 py-4 text-right">
                  <details className="relative z-20 inline-block">
                    <summary className="admin-secondary-action flex h-9 w-9 cursor-pointer items-center justify-center marker:content-['']">
                      <MoreHorizontal className="h-4 w-4" />
                    </summary>
                    <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-36 p-2 text-left">
                      <Link
                        className="rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]"
                        href={`/admin/orders/${order.id}`}
                      >
                        View order
                      </Link>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      {!orders.length ? (
        <p className="admin-card p-6 text-sm text-[#81796f]">
          No orders match these filters.
        </p>
      ) : null}
    </div>
  );
}

function Select({
  children,
  defaultValue,
  name,
}: {
  children: ReactNode;
  defaultValue: string;
  name: string;
}) {
  return (
    <select
      className="admin-input min-w-44 capitalize"
      defaultValue={defaultValue}
      name={name}
    >
      {children}
    </select>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold uppercase text-red-300">
      {value}
    </span>
  );
}
