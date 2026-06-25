import { requireAdmin } from "@/lib/admin-auth";
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
        <h2 className="font-semibold">Sales this week</h2>
        <div className="mt-6 grid h-64 grid-cols-7 items-end gap-3">
          {report.daily.map((day) => (
            <div className="grid h-full items-end gap-2" key={day.key}>
              <div className="rounded-t-md bg-[#a7835d]" style={{ height: `${Math.max(8, (day.sales / maxSales) * 100)}%` }} />
              <p className="text-center text-xs font-semibold">{day.label}</p>
            </div>
          ))}
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
