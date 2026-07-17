import { requireAdmin } from "@/lib/admin-auth";
import { CsvDownloadButton } from "@/components/admin/csv-download-button";
import { formatColomboDate, formatColomboDateTime } from "@/lib/date-time";
import { getReportData } from "@/lib/db/reports";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const report = await getReportData(params.from, params.to);
  const maxSales = Math.max(...report.daily.map((day) => day.sales), 1);
  const periodLabel = `${report.start} to ${report.end}`;
  const dailyRows = report.daily.map((day) => ({
    date: day.key,
    sales: day.sales.toFixed(2),
    profit: day.profit.toFixed(2),
    orders: day.orders,
  }));
  const orderRows = report.orders.map((order) => ({
    order: order.order_number,
    date: formatColomboDateTime(order.created_at),
    customer: order.customer_name,
    email: order.customer_email,
    total: Number(order.total).toFixed(2),
    payment: order.payment_status,
    status: order.order_status,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="admin-muted mt-2 text-sm">Sales, profit, and order performance for a custom time period.</p>
      </div>
      <form className="admin-card flex flex-wrap items-end gap-3 p-4">
        <label className="grid gap-2 font-semibold">
          From
          <input className="admin-input" defaultValue={params.from ?? ""} name="from" type="date" />
        </label>
        <label className="grid gap-2 font-semibold">
          To
          <input className="admin-input" defaultValue={params.to ?? ""} name="to" type="date" />
        </label>
        <button className="admin-action px-4 py-2.5" type="submit">Generate report</button>
      </form>
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Sales" value={formatCurrency(report.sales)} />
        <Metric label="Profit" value={formatCurrency(report.profit)} />
        <Metric label="Orders" value={String(report.orderCount)} />
        <Metric label="Average order" value={formatCurrency(report.averageOrder)} />
      </section>
      <section className="admin-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Sales by day</h2>
            <p className="admin-muted mt-1 text-sm">{periodLabel}</p>
          </div>
          <CsvDownloadButton
            columns={[
              { key: "date", label: "Date" },
              { key: "sales", label: "Sales (LKR)" },
              { key: "profit", label: "Profit (LKR)" },
              { key: "orders", label: "Orders" },
            ]}
            filename={`neverfoundco-daily-report-${report.start}-to-${report.end}`}
            meta={[`Period: ${periodLabel}`]}
            rows={dailyRows}
            title="Never Found Co Daily Sales Report"
          />
        </div>
        <div className="mt-6 grid h-64 items-end gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(report.daily.length, 31)}, minmax(28px, 1fr))` }}>
          {report.daily.map((day) => (
            <div className="grid h-full items-end gap-2" key={day.key}>
              <div className="rounded-t-md bg-[#a7835d]" style={{ height: `${Math.max(8, (day.sales / maxSales) * 100)}%` }} />
              <p className="text-center text-xs font-semibold">{day.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece7df] p-4">
          <div>
            <h2 className="font-semibold">Orders in report</h2>
            <p className="admin-muted mt-1 text-sm">{report.orders.length} orders for {periodLabel}</p>
          </div>
          <CsvDownloadButton
            columns={[
              { key: "order", label: "Order" },
              { key: "date", label: "Date" },
              { key: "customer", label: "Customer" },
              { key: "email", label: "Email" },
              { key: "total", label: "Total (LKR)" },
              { key: "payment", label: "Payment" },
              { key: "status", label: "Order Status" },
            ]}
            filename={`neverfoundco-orders-report-${report.start}-to-${report.end}`}
            meta={[`Period: ${periodLabel}`]}
            rows={orderRows}
            title="Never Found Co Orders Report"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[860px]">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total (LKR)</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {report.orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{formatColomboDate(order.created_at)}</td>
                  <td>{order.customer_name}</td>
                  <td>{formatCurrency(Number(order.total))}</td>
                  <td>{order.payment_status}</td>
                  <td>{order.order_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-card p-4">
      <p className="admin-muted text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-4 text-2xl font-semibold">{value}</p>
    </div>
  );
}
