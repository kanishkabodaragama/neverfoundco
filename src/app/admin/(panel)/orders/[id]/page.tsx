import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOrder } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
            Order detail
          </p>
          <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
            {order.order_number}
          </h1>
          <p className="mt-2 text-sm text-[#F7F1E6]/55">
            {new Date(order.created_at).toLocaleString("en-LK")}
          </p>
        </div>
        <form
          action={`/api/admin/orders/${order.id}/status`}
          className="flex flex-wrap gap-3"
          method="post"
        >
          <select
            className="border border-[#F7F1E6]/10 bg-[#0B111C] px-4 py-3 text-sm capitalize outline-none focus:border-[#F05267]"
            defaultValue={order.order_status}
            name="order_status"
          >
            {["pending", "processing", "shipped", "completed", "cancelled"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ),
            )}
          </select>
          <button
            className="bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
            type="submit"
          >
            Update status
          </button>
        </form>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-5 border border-[#F7F1E6]/10 bg-[#0B111C] p-5">
          <h2 className="font-mono text-xl font-black uppercase">Customer</h2>
          <div className="space-y-2 text-sm text-[#F7F1E6]/70">
            <p className="text-[#FFF9EF]">{order.customer_name}</p>
            <p>{order.customer_email}</p>
            <p>{order.customer_phone}</p>
            <p>
              {order.address_line_1}
              {order.address_line_2 ? `, ${order.address_line_2}` : ""}, {order.city},{" "}
              {order.district}
              {order.country_code ? `, ${order.country_code}` : ""}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs uppercase">
            <Status label="Payment" value={order.payment_status} />
            <Status label="Order" value={order.order_status} />
          </div>
        </section>

        <section className="border border-[#F7F1E6]/10 bg-[#0B111C] p-5">
          <h2 className="font-mono text-xl font-black uppercase">Items</h2>
          <div className="mt-5 divide-y divide-[#F7F1E6]/10">
            {order.order_items?.map((item) => (
              <div className="grid grid-cols-[1fr_auto] gap-4 py-4" key={item.id}>
                <div>
                  <p className="font-black uppercase text-[#FFF9EF]">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-[#F7F1E6]/55">
                    Qty {item.quantity} x {formatCurrency(Number(item.unit_price))}
                  </p>
                </div>
                <p>{formatCurrency(Number(item.total_price))}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-[#F7F1E6]/10 pt-5 text-sm">
            <Row label="Subtotal" value={formatCurrency(Number(order.subtotal))} />
            <Row label="Discount" value={formatCurrency(Number(order.discount_amount ?? 0))} />
            <Row label="Shipping" value={formatCurrency(Number(order.shipping_fee))} />
            <Row label="Total" strong value={formatCurrency(Number(order.total))} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#F7F1E6]/10 p-3">
      <p className="text-[#F7F1E6]/45">{label}</p>
      <p className="mt-2 text-[#B8A8E8]">{value}</p>
    </div>
  );
}

function Row({
  label,
  strong,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-lg font-black" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
