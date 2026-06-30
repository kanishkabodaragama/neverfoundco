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
    <div className="min-h-screen bg-bone text-ink">
      <Header />
      <main className="mx-auto grid min-h-[70vh] w-full max-w-xl place-items-center px-5 py-12">
        <form action="/api/account/login" className="w-full border border-ink bg-bone p-6" method="post">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">Customer file</p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none">Order login</h1>
          <p className="mt-4 text-sm font-semibold leading-relaxed text-ink/70">
            Use your email and latest order number to see all orders, receipts, and tracking status.
          </p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wide">
              Email
              <input className="border border-ink bg-bone px-4 py-3 outline-none focus:border-rust" name="email" required type="email" />
            </label>
            <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wide">
              Latest order number
              <input className="border border-ink bg-bone px-4 py-3 outline-none focus:border-rust" name="order_number" placeholder="NF-..." required />
            </label>
          </div>
          <button className="mt-6 bg-acid px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ink hover:text-acid" type="submit">
            Login
          </button>
          {error ? <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wide text-rust">{error}</p> : null}
        </form>
      </main>
      <Footer />
    </div>
  );
}
