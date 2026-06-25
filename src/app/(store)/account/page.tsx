import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
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
    <div className="min-h-screen bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main className="px-5 py-10 md:px-8 xl:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-pixel text-2xl uppercase md:text-3xl">My orders</h1>
            <p className="mt-2 text-sm font-bold">{email}</p>
          </div>
          <form action="/api/account/logout" method="post">
            <button className="border border-[#10131A] px-4 py-3 text-xs font-black uppercase" type="submit">
              Logout
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4">
          {orders.map((order) => (
            <section className="border border-[#10131A]/15 bg-[#FFF9EF] p-5" key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-pixel text-sm uppercase">{order.order_number}</h2>
                  <p className="mt-2 text-sm font-bold">{new Date(order.created_at).toLocaleString("en-US")}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-black uppercase">
                  <span className="border border-[#10131A]/15 px-3 py-2">Payment: {order.payment_status}</span>
                  <span className="border border-[#F05267] px-3 py-2 text-[#F05267]">Order: {order.order_status}</span>
                </div>
              </div>
              <div className="mt-5 divide-y divide-[#10131A]/10">
                {order.order_items.map((item) => (
                  <div className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm font-bold" key={item.id}>
                    <span>{item.quantity} x {item.product_name}</span>
                    <span>{formatMoney(Number(item.total_price), "USD")}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#10131A]/10 pt-4">
                <p className="font-pixel text-sm uppercase">{formatMoney(Number(order.total), "USD")}</p>
                <a className="bg-[#10131A] px-4 py-3 text-xs font-black uppercase text-[#FFF9EF]" href={`/api/orders/${order.order_number}/receipt`}>
                  Download receipt
                </a>
              </div>
            </section>
          ))}
          {!orders.length ? (
            <p className="border border-[#10131A]/15 bg-[#FFF9EF] p-6 text-sm font-bold">
              No orders found for this account.
            </p>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
