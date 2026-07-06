import { CheckCircle2, CreditCard } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { requireAdmin } from "@/lib/admin-auth";
import { listPaymentGateways } from "@/lib/db/payment-gateways";
import {
  getCheckoutPaymentTimeoutMinutes,
  getProductRecommendationsEnabled,
} from "@/lib/db/site-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [flash, gateways, checkoutPaymentTimeoutMinutes, recommendationsEnabled] = await Promise.all([
    searchParams,
    listPaymentGateways(),
    getCheckoutPaymentTimeoutMinutes(),
    getProductRecommendationsEnabled(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="admin-muted mt-2 text-sm">Configure operational rules for the storefront.</p>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />

      <section className="admin-card overflow-hidden">
        <div className="border-b border-[#ece7df] p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <CreditCard className="h-4 w-4" />
            Payment gateways
          </h2>
          <p className="admin-muted mt-1 text-sm">
            Select the payment gateway the storefront should use at checkout.
          </p>
        </div>
        <div className="grid gap-3 p-4">
          {gateways.map((gateway) => (
            <form
              action={`/api/admin/payment-gateways/${gateway.id}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-[#ece7df] p-4"
              key={gateway.id}
              method="post"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{gateway.name}</h3>
                  {gateway.is_enabled ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[0.7rem] font-semibold uppercase text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Selected
                    </span>
                  ) : null}
                </div>
                <p className="admin-muted mt-1 text-sm">
                  {gateway.description ??
                    (gateway.gateway_key === "payhere"
                      ? "PayHere card and local payment flow."
                      : gateway.gateway_key === "manual_bank"
                        ? "Manual payment review for bank transfer orders."
                        : "Gateway available for future checkout integration.")}
                </p>
                {!gateway.is_integrated ? (
                  <p className="mt-2 text-xs font-semibold uppercase text-[#a7835d]">
                    Available in admin, checkout wiring pending
                  </p>
                ) : null}
              </div>
              <button className="admin-action px-4 py-2.5 text-xs" disabled={gateway.is_enabled} type="submit">
                {gateway.is_enabled ? "Active" : "Select gateway"}
              </button>
            </form>
          ))}
          {gateways.length === 0 ? (
            <p className="admin-muted p-4 text-sm">No payment gateways have been seeded yet.</p>
          ) : null}
        </div>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-[#ece7df] p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <CreditCard className="h-4 w-4" />
            Checkout timing
          </h2>
          <p className="admin-muted mt-1 text-sm">
            Set how long customers have to complete PayHere payment before a
            pending order is cancelled.
          </p>
        </div>
        <form
          action="/api/admin/checkout-settings"
          className="grid gap-4 p-4 sm:max-w-sm"
          method="post"
        >
          <label className="grid gap-2 text-sm font-semibold">
            Payment window in minutes
            <input
              className="admin-input"
              defaultValue={checkoutPaymentTimeoutMinutes}
              max={120}
              min={1}
              name="checkout_payment_timeout_minutes"
              step={1}
              type="number"
            />
          </label>
          <p className="admin-muted text-xs">
            Default is 15 minutes. Pending unpaid orders older than this window
            are cancelled automatically when order/payment endpoints run.
          </p>
          <button className="admin-action w-fit px-4 py-2.5" type="submit">
            Save timing
          </button>
        </form>
      </section>

      <section className="admin-card overflow-hidden">
        <div className="border-b border-[#ece7df] p-4">
          <h2 className="font-semibold">Product recommendations</h2>
          <p className="admin-muted mt-1 text-sm">
            Turn the product page &quot;You may also like&quot; section on or off.
          </p>
        </div>
        <form
          action="/api/admin/settings/product-recommendations"
          className="flex flex-wrap items-center justify-between gap-4 p-4"
          method="post"
        >
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              className="h-5 w-5 accent-[#332c26]"
              defaultChecked={recommendationsEnabled}
              name="product_recommendations_enabled"
              type="checkbox"
            />
            Show &quot;You may also like&quot; on product pages
          </label>
          <button className="admin-action px-4 py-2.5" type="submit">
            Save recommendation setting
          </button>
        </form>
      </section>
    </div>
  );
}
