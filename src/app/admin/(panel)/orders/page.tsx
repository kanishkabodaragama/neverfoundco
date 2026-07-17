import Link from "next/link";
import type { ReactNode } from "react";
import { CsvDownloadButton } from "@/components/admin/csv-download-button";
import { requireAdmin } from "@/lib/admin-auth";
import { formatColomboDate, formatColomboTime } from "@/lib/date-time";
import { listAdminOrders } from "@/lib/db/admin";
import { cn, formatCurrency } from "@/lib/utils";
import { Filter, MoreHorizontal, Search } from "lucide-react";

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
  const orderRows = orders.map((order) => ({
    order: order.order_number,
    date: formatColomboDate(order.created_at),
    time: formatColomboTime(order.created_at),
    customer: order.customer_name,
    email: order.customer_email,
    total: Number(order.total).toFixed(2),
    payment: order.payment_status,
    status: order.order_status,
    city: order.city,
    region: order.district,
  }));

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
          <CsvDownloadButton
            columns={[
              { key: "order", label: "Order" },
              { key: "date", label: "Date" },
              { key: "time", label: "Time" },
              { key: "customer", label: "Customer" },
              { key: "email", label: "Email" },
              { key: "total", label: "Total (LKR)" },
              { key: "payment", label: "Payment" },
              { key: "status", label: "Order Status" },
              { key: "city", label: "City" },
              { key: "region", label: "Region" },
            ]}
            filename="neverfoundco-orders"
            rows={orderRows}
            title="Never Found Co Orders"
          />
        </form>
        <div className="overflow-x-visible">
        <table className="admin-table min-w-[1060px]">
          <thead>
            <tr>
              <th className="px-4 py-4">Order</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Time</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Total (LKR)</th>
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
                  {formatColomboDate(order.created_at)}
                </td>
                <td className="px-4 py-4 font-mono text-xs uppercase text-[#81796f] dark:text-[#b9afa4]">
                  {formatColomboTime(order.created_at)}
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

const statusBadgeClasses: Record<string, string> = {
  pending:
    "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/12 dark:text-amber-200",
  processing:
    "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-400/35 dark:bg-sky-400/12 dark:text-sky-200",
  shipped:
    "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-400/35 dark:bg-indigo-400/12 dark:text-indigo-200",
  completed:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-400/12 dark:text-emerald-200",
  cancelled:
    "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/35 dark:bg-rose-400/12 dark:text-rose-200",
};

function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-3 py-2 text-xs font-semibold uppercase",
        statusBadgeClasses[value] ??
          "border-[#d8d0c6] bg-[#f6f3ef] text-[#5f564d] dark:border-white/15 dark:bg-white/8 dark:text-[#f8f4ee]",
      )}
    >
      {value}
    </span>
  );
}
