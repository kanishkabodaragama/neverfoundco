import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProduct } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) notFound();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
          Catalog
        </p>
        <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
          Edit product
        </h1>
        <p className="mt-2 text-sm text-[#F7F1E6]/60">{product.name}</p>
      </div>
      <ProductForm product={product} />
      <section className="space-y-4 border border-[#F7F1E6]/10 bg-[#0B111C] p-5">
        <h2 className="font-mono text-xl font-black uppercase">Product images</h2>
        <form
          action={`/api/admin/products/${product.id}/images`}
          className="grid gap-4 md:grid-cols-2"
          encType="multipart/form-data"
          method="post"
        >
          <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
            Upload image
            <input accept="image/*" className="admin-input" name="file" type="file" />
          </label>
          <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
            Or image URL
            <input className="admin-input" name="image_url" type="url" />
          </label>
          <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
            Alt text
            <input className="admin-input" name="alt_text" />
          </label>
          <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
            Sort order
            <input className="admin-input" defaultValue="0" name="sort_order" />
          </label>
          <button className="w-fit bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF]" type="submit">
            Add image
          </button>
        </form>
        <div className="grid gap-3">
          {product.product_images?.map((image) => (
            <div className="border border-[#F7F1E6]/10 p-3" key={image.id}>
              <p className="break-all text-sm">{image.image_url}</p>
              <p className="text-sm text-[#F7F1E6]/50">Sort: {image.sort_order}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
