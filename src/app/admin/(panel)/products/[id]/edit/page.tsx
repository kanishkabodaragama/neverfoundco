import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAlert } from "@/components/admin/admin-alert";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listProductCategories } from "@/lib/db/categories";
import { getAdminProduct } from "@/lib/db/products";
import { listVariantOptions } from "@/lib/db/variant-options";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const flash = await searchParams;
  const [product, variantOptions] = await Promise.all([
    getAdminProduct(id),
    listVariantOptions(),
  ]);
  const categories = await listProductCategories();

  if (!product) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit product</h1>
          <p className="admin-muted mt-2 text-sm">{product.name}</p>
        </div>
        <Link className="admin-secondary-action flex items-center gap-2 px-3 py-2.5" href="/admin/products">
          <ArrowLeft className="h-5 w-5" />
          Back to products
        </Link>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />
      <ProductForm categories={categories} product={product} variantOptions={variantOptions} />
    </div>
  );
}
