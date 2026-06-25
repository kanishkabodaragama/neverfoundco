import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Customer Login",
};

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main className="mx-auto grid min-h-[70vh] w-full max-w-xl place-items-center px-5 py-12">
        <form action="/api/account/login" className="w-full border border-[#10131A]/15 bg-[#FFF9EF] p-6" method="post">
          <h1 className="font-pixel text-2xl uppercase">Order login</h1>
          <p className="mt-3 text-sm font-bold leading-relaxed">
            Use your email and latest order number to see all orders, receipts, and tracking status.
          </p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-xs font-black uppercase">
              Email
              <input className="border border-[#10131A]/20 bg-white px-4 py-3 outline-none focus:border-[#F05267]" name="email" required type="email" />
            </label>
            <label className="grid gap-2 text-xs font-black uppercase">
              Latest order number
              <input className="border border-[#10131A]/20 bg-white px-4 py-3 outline-none focus:border-[#F05267]" name="order_number" placeholder="NF-..." required />
            </label>
          </div>
          <button className="mt-6 bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF]" type="submit">
            Login
          </button>
          {error ? <p className="mt-4 text-sm font-black text-[#F05267]">{error}</p> : null}
        </form>
      </main>
      <Footer />
    </div>
  );
}
