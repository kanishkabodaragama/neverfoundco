import { ProductForm } from "@/components/admin/product-form";
import { AdminAlert } from "@/components/admin/admin-alert";
import { requireAdmin } from "@/lib/admin-auth";
import { listProductCategories } from "@/lib/db/categories";
import { listVariantOptions } from "@/lib/db/variant-options";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const flash = await searchParams;
  const [variantOptions, categories] = await Promise.all([
    listVariantOptions(),
    listProductCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create product</h1>
          <p className="admin-muted mt-2 text-sm">
            Create a draft product, assign catalog records, and prepare variations.
          </p>
        </div>
        <Link className="admin-secondary-action flex items-center gap-2 px-3 py-2.5" href="/admin/products">
          <ArrowLeft className="h-5 w-5" />
          Back to products
        </Link>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />
      <ProductForm categories={categories} variantOptions={variantOptions} />
    </div>
  );
}
