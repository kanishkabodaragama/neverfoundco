import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminOrders } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
            Fulfillment
          </p>
          <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
            Orders
          </h1>
        </div>
        <p className="text-sm text-[#F7F1E6]/60">{orders.length} records</p>
      </div>

      <form className="grid gap-3 border border-[#F7F1E6]/10 bg-[#0B111C] p-4 md:grid-cols-[1fr_180px_180px_auto]">
        <input
          className="border border-[#F7F1E6]/10 bg-[#070B12] px-4 py-3 text-sm outline-none focus:border-[#F05267]"
          defaultValue={query.q ?? ""}
          name="q"
          placeholder="Search order, customer, email"
        />
        <Select defaultValue={query.status ?? "all"} name="status">
          <option value="all">All statuses</option>
          {["pending", "processing", "shipped", "completed", "cancelled"].map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ),
          )}
        </Select>
        <Select defaultValue={query.payment ?? "all"} name="payment">
          <option value="all">All payments</option>
          {["pending", "paid", "failed", "cancelled"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <button
          className="bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
          type="submit"
        >
          Filter
        </button>
      </form>

      <div className="overflow-x-auto border border-[#F7F1E6]/10 bg-[#0B111C]">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="text-xs uppercase text-[#F7F1E6]/50">
            <tr className="border-b border-[#F7F1E6]/10">
              <th className="px-4 py-4">Order</th>
              <th className="px-4 py-4">Customer</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Payment</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Total</th>
              <th className="px-4 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-b border-[#F7F1E6]/10" key={order.id}>
                <td className="px-4 py-4 font-mono">
                  <Link className="text-[#FFF9EF]" href={`/admin/orders/${order.id}`}>
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <span className="block text-[#FFF9EF]">{order.customer_name}</span>
                  <span className="text-xs text-[#F7F1E6]/50">{order.customer_email}</span>
                </td>
                <td className="px-4 py-4 text-[#F7F1E6]/60">
                  {new Date(order.created_at).toLocaleDateString("en-LK")}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={order.payment_status} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={order.order_status} />
                </td>
                <td className="px-4 py-4 text-right">
                  {formatCurrency(Number(order.total))}
                </td>
                <td className="px-4 py-4 text-right">
                  <details className="relative inline-block">
                    <summary className="cursor-pointer border border-[#F7F1E6]/20 px-3 py-2 text-xs font-black uppercase marker:content-[''] hover:border-[#F05267]">
                      Actions
                    </summary>
                    <div className="absolute right-0 z-20 mt-2 grid w-36 border border-[#F7F1E6]/10 bg-[#070B12] p-2 text-left shadow-xl">
                      <Link
                        className="px-3 py-2 text-xs font-black uppercase hover:bg-[#F05267] hover:text-[#FFF9EF]"
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
      {!orders.length ? (
        <p className="border border-[#F7F1E6]/10 bg-[#0B111C] p-6 text-sm text-[#F7F1E6]/55">
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
      className="border border-[#F7F1E6]/10 bg-[#070B12] px-4 py-3 text-sm capitalize outline-none focus:border-[#F05267]"
      defaultValue={defaultValue}
      name={name}
    >
      {children}
    </select>
  );
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span className="border border-[#B8A8E8]/40 px-2 py-1 text-xs uppercase text-[#B8A8E8]">
      {value}
    </span>
  );
}
