import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { RefundStatusForm } from "@/components/admin/refund-status-form";
import { requireAdmin } from "@/lib/admin-auth";
import { formatColomboDateTime } from "@/lib/date-time";
import { getAdminOrder } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [{ id }, flash] = await Promise.all([params, searchParams]);
  const order = await getAdminOrder(id);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <AdminAlert error={flash.error} success={flash.success} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{order.order_number}</h1>
          <p className="admin-muted mt-2 text-sm">{formatColomboDateTime(order.created_at)}</p>
        </div>
        <Link className="admin-secondary-action flex items-center gap-2 px-3 py-2.5" href="/admin/orders">
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>

      <form action={`/api/admin/orders/${order.id}/status`} className="admin-card flex flex-wrap items-end gap-3 p-4" method="post">
        <label className="grid gap-2 font-semibold">
          Order status
          <select className="admin-input capitalize" defaultValue={order.order_status} name="order_status">
            {["pending", "processing", "shipped", "completed", "cancelled"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <button className="admin-action px-4 py-2.5" type="submit">Update status</button>
      </form>

      <RefundStatusForm
        action={`/api/admin/orders/${order.id}/refund`}
        orderTotal={Number(order.total)}
        refundAmount={order.refund_amount === null ? null : Number(order.refund_amount)}
        refundStatus={order.refund_status}
      />

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="admin-card space-y-5 p-5">
          <h2 className="font-semibold">Customer</h2>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">{order.customer_name}</p>
            <p className="admin-muted">{order.customer_email}</p>
            <p className="admin-muted">{order.customer_phone}</p>
            <p className="admin-muted">
              {order.address_line_1}
              {order.address_line_2 ? `, ${order.address_line_2}` : ""}, {order.city}, {order.district}
              {order.country_code ? `, ${order.country_code}` : ""}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Status label="Payment" value={order.payment_status} />
            <Status label="Order" value={order.order_status} />
            <Status label="Refund" value={formatRefundStatus(order.refund_status)} />
            <Status
              label="Refund amount"
              value={
                order.refund_amount
                  ? formatCurrency(Number(order.refund_amount))
                  : "None"
              }
            />
          </div>
        </section>

        <section className="admin-card p-5">
          <h2 className="font-semibold">Items</h2>
          <div className="mt-5 divide-y divide-[#ece7df]">
            {order.order_items?.map((item) => (
              <div className="grid grid-cols-[1fr_auto] gap-4 py-4" key={item.id}>
                <div>
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="admin-muted text-sm">Qty {item.quantity} x {formatCurrency(Number(item.unit_price))}</p>
                </div>
                <p>{formatCurrency(Number(item.total_price))}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-[#ece7df] pt-5 text-sm">
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

function formatRefundStatus(value: string) {
  if (value === "partial_refund") return "Partial refund";
  if (value === "full_refund") return "Full refund";
  return "Not refunded";
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#ece7df] p-3">
      <p className="admin-muted text-xs font-semibold uppercase">{label}</p>
      <p className="mt-2 font-semibold capitalize">{value}</p>
    </div>
  );
}

function Row({ label, strong, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "text-lg font-semibold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
