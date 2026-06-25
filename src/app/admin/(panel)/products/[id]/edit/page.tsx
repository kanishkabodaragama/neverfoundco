import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminAlert } from "@/components/admin/admin-alert";
import { ProductImageUploadForm } from "@/components/admin/product-image-upload-form";
import { ProductForm } from "@/components/admin/product-form";
import { VariantImageUploadForm } from "@/components/admin/variant-image-upload-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listProductCategories } from "@/lib/db/categories";
import { getAdminProduct } from "@/lib/db/products";
import { listVariantOptions } from "@/lib/db/variant-options";
import { ArrowLeft, Eye, Shuffle, Trash2, X } from "lucide-react";

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
      <section className="admin-card space-y-4 p-4">
        <div>
          <h2 className="text-lg font-semibold">Product images</h2>
          <p className="admin-muted mt-1 text-sm">Upload gallery images. Each image must be below 2 MB.</p>
        </div>
        <ProductImageUploadForm action={`/api/admin/products/${product.id}/images`} />
        <div className="grid gap-3">
          {product.product_images?.map((image) => (
            <div className="grid gap-4 rounded-md border border-[#ece7df] p-3 md:grid-cols-[96px_1fr]" key={image.id}>
              <div className="relative h-24 w-24 overflow-hidden rounded-md border border-[#ece7df]">
                <Image
                  alt={image.alt_text ?? product.name}
                  className="object-cover"
                  fill
                  sizes="96px"
                  unoptimized
                  src={image.image_url}
                />
                <a
                  aria-label={`Quick view gallery image ${image.sort_order + 1}`}
                  className="absolute inset-0 grid place-items-center bg-[#111]/0 text-white opacity-0 transition hover:bg-[#111]/35 hover:opacity-100"
                  href={image.image_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Eye className="h-5 w-5" />
                </a>
              </div>
              <div className="space-y-3">
                <p className="admin-muted text-sm">Gallery image #{image.sort_order + 1}</p>
                <form
                  action={`/api/admin/product-images/${image.id}`}
                  className="grid gap-3 md:grid-cols-[1fr_120px_auto_auto]"
                  method="post"
                >
                  <input
                    name="redirect_to"
                    type="hidden"
                    value={`/admin/products/${product.id}/edit`}
                  />
                  <input
                    className="admin-input"
                    defaultValue={image.alt_text ?? ""}
                    name="alt_text"
                    placeholder="Alt text"
                  />
                  <input
                    className="admin-input"
                    defaultValue={image.sort_order}
                    name="sort_order"
                    type="number"
                  />
                  <button className="admin-secondary-action px-3 py-2.5 text-xs" type="submit">
                    Save
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                    formAction={`/api/admin/product-images/${image.id}`}
                    name="_method"
                    type="submit"
                    value="DELETE"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
          {product.product_images?.length ? null : (
            <p className="admin-muted text-sm">No images added yet.</p>
          )}
        </div>
      </section>

      <section className="admin-card space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Variants</h2>
            <p className="admin-muted mt-1 text-sm">
              Generated from selected genders, colors, and sizes.
            </p>
          </div>
          <form action={`/api/admin/products/${product.id}/variants/generate`} method="post">
            <button className="admin-action flex items-center gap-2 px-4 py-2.5 text-sm" type="submit">
              <Shuffle className="h-5 w-5" />
              Generate variants
            </button>
          </form>
        </div>
        <div className="grid gap-3">
          {product.product_variants?.map((variant) => (
            <div
              className="grid gap-4 rounded-md border border-[#ece7df] p-3 md:grid-cols-[96px_1fr]"
              key={variant.id}
            >
              <div className="space-y-3">
                {variant.image_url ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border border-[#ece7df]">
                    <Image
                      alt={`${variant.gender} ${variant.size} ${variant.color}`}
                      className="object-cover"
                      fill
                      sizes="96px"
                      src={variant.image_url}
                      unoptimized
                    />
                    <a
                      aria-label={`Quick view ${variant.gender} ${variant.size} ${variant.color}`}
                      className="absolute inset-0 grid place-items-center bg-[#111]/0 text-white opacity-0 transition hover:bg-[#111]/35 hover:opacity-100"
                      href={variant.image_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Eye className="h-5 w-5" />
                    </a>
                  </div>
                ) : (
                  <div className="admin-muted flex aspect-square w-24 items-center justify-center rounded-md border border-[#ece7df] text-center text-[0.65rem] font-semibold uppercase">
                    No image
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <form
                  action={`/api/admin/product-variants/${variant.id}`}
                  className="grid gap-3 md:grid-cols-[90px_90px_1fr_100px_110px_110px_110px_auto_auto]"
                  method="post"
                >
                  <input
                    name="redirect_to"
                    type="hidden"
                    value={`/admin/products/${product.id}/edit`}
                  />
                  <input className="admin-input" defaultValue={variant.gender} name="gender" />
                  <input className="admin-input" defaultValue={variant.size} name="size" />
                  <input className="admin-input" defaultValue={variant.color} name="color" />
                  <input
                    className="admin-input"
                    defaultValue={variant.stock_quantity}
                    name="stock_quantity"
                    type="number"
                  />
                  <input className="admin-input" defaultValue={variant.price ?? ""} name="price" placeholder="Price USD" step="0.01" type="number" />
                  <input className="admin-input" defaultValue={variant.sale_price ?? ""} name="sale_price" placeholder="Sale USD" step="0.01" type="number" />
                  <input className="admin-input" defaultValue={variant.unit_cost ?? ""} name="unit_cost" placeholder="Cost USD" step="0.01" type="number" />
                  <input
                    className="admin-input"
                    defaultValue={variant.image_url ?? ""}
                    name="image_url"
                    placeholder="Variant image URL"
                    type="url"
                  />
                  <button className="admin-secondary-action px-3 py-2.5 text-xs" type="submit">
                    Save
                  </button>
                  <button
                    className="flex items-center justify-center rounded-md border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                    name="_method"
                    type="submit"
                    value="DELETE"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
                <VariantImageUploadForm
                  action={`/api/admin/product-variants/${variant.id}/image?redirect_to=/admin/products/${product.id}/edit`}
                />
              </div>
            </div>
          ))}
          {product.product_variants?.length ? null : (
            <p className="admin-muted text-sm">
              No variants yet. Save product colors, sizes, and gender options, then generate variants.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
