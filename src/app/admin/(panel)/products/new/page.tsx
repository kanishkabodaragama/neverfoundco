import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
          Catalog
        </p>
        <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
          Add product
        </h1>
      </div>
      <ProductForm />
    </div>
  );
}
