import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { CouponForm } from "@/components/admin/coupon-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCoupon } from "@/lib/db/admin";
import { listAdminProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function EditCouponPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [{ id }, flash] = await Promise.all([params, searchParams]);
  const [coupon, products] = await Promise.all([
    getAdminCoupon(id),
    listAdminProducts(),
  ]);

  if (!coupon) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit coupon</h1>
          <p className="admin-muted mt-2 text-sm">
            Update discount, usage, dates, status, and product restrictions for {coupon.code}.
          </p>
        </div>
        <Link className="admin-secondary-action flex items-center gap-2 px-4 py-2.5" href="/admin/coupons">
          <ArrowLeft className="h-4 w-4" />
          Back to coupons
        </Link>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />
      <section className="admin-card p-5">
        <CouponForm coupon={coupon} products={products} />
      </section>
    </div>
  );
}
