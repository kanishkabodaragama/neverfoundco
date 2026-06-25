import { requireAdmin } from "@/lib/admin-auth";
import { listAdminOrders } from "@/lib/db/admin";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const orders = await listAdminOrders();
  const customers = Array.from(
    orders.reduce((map, order) => {
      const existing = map.get(order.customer_email);
      map.set(order.customer_email, {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
        orders: (existing?.orders ?? 0) + 1,
        spent: (existing?.spent ?? 0) + Number(order.total),
        lastOrderAt:
          !existing || new Date(order.created_at) > new Date(existing.lastOrderAt)
            ? order.created_at
            : existing.lastOrderAt,
      });
      return map;
    }, new Map<string, { name: string; email: string; phone: string; orders: number; spent: number; lastOrderAt: string }>()),
  ).map(([, customer]) => customer).sort((a, b) => +new Date(b.lastOrderAt) - +new Date(a.lastOrderAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="admin-muted mt-2 text-sm">Customers are created automatically from checkout orders.</p>
      </div>
      <section className="admin-card overflow-x-auto">
        <table className="admin-table min-w-[860px]">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th>Latest order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.email}>
                <td className="font-semibold">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
                <td>{formatCurrency(customer.spent)}</td>
                <td>{new Date(customer.lastOrderAt).toLocaleString("en-US")}</td>
              </tr>
            ))}
            {!customers.length ? (
              <tr><td className="admin-muted" colSpan={6}>No customers yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
