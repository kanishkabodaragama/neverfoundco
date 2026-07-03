import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import { formatColomboDateTime } from "@/lib/date-time";
import { listCustomerOrders } from "@/lib/db/orders";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get("nf_customer_email")?.value;

  if (!email) redirect("/account/login");

  const orders = await listCustomerOrders(email);

  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
      <div className="px-5 py-10 md:px-8 xl:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">Customer file</p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">My orders</h1>
            <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/60">{email}</p>
          </div>
          <form action="/api/account/logout" method="post">
            <button className="border border-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] transition-colors hover:bg-ink hover:text-acid" type="submit">
              Logout
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4">
          {orders.map((order) => (
            <section className="border border-ink bg-transparent p-5" key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl uppercase leading-none">{order.order_number}</h2>
                  <p className="mt-2 font-mono text-xs font-bold uppercase tracking-wide text-ink/60">{formatColomboDateTime(order.created_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-wide">
                  <span className="border border-ink/15 px-3 py-2">Payment: {order.payment_status}</span>
                  <span className="border border-rust px-3 py-2 text-rust">Order: {order.order_status}</span>
                </div>
              </div>
              <div className="mt-5">
                {order.order_items.map((item) => (
                  <div className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm font-semibold text-ink/70" key={item.id}>
                    <span>{item.quantity} x {item.product_name}</span>
                    <span>{formatMoney(Number(item.total_price), "USD")}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4">
                <p className="font-mono text-sm font-bold uppercase">{formatMoney(Number(order.total), "USD")}</p>
                <a className="bg-ink px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-rust hover:text-ink" href={`/api/orders/${order.order_number}/receipt`}>
                  Download receipt
                </a>
              </div>
            </section>
          ))}
          {!orders.length ? (
            <p className="border border-ink bg-transparent p-6 text-sm font-semibold text-ink/70">
              No orders found for this account.
            </p>
          ) : null}
        </div>
      </div>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
