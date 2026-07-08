"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminModal } from "@/components/admin/admin-modal";
import {
  UploadButton,
  UploadThumb,
  type UploadPreview,
} from "@/components/admin/upload-thumbnail";
import type { ProductWithImages } from "@/lib/db/products";
import type { YouMayAlsoLikeItem } from "@/lib/db/you-may-also-like";

const MAX_FEATURE_IMAGE_SIZE_MB = 4;
const MAX_FEATURE_IMAGE_SIZE = MAX_FEATURE_IMAGE_SIZE_MB * 1024 * 1024;
const FALLBACK_PRODUCT_IMAGE =
  "/images/products/home-drop/never-found-logo-tee.png";

export function YouMayAlsoLikeFeatureManager({
  items,
  products,
  recommendationsEnabled,
}: {
  items: YouMayAlsoLikeItem[];
  products: ProductWithImages[];
  recommendationsEnabled: boolean;
}) {
  return (
    <section className="admin-card overflow-visible">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece7df] p-4">
        <div>
          <h2 className="font-semibold">You May Also Like</h2>
          <p className="admin-muted mt-1 text-sm">
            Items are shown in the carousel by order from top to bottom.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminModal
            title="Create You May Also Like item"
            trigger={
              <span className="admin-action flex items-center gap-2 px-4 py-2.5">
                <Plus className="h-4 w-4" />
                Create
              </span>
            }
            width="w-[min(94vw,760px)]"
          >
            <FeatureItemForm
              action="/api/admin/features/you-may-also-like"
              defaultDisplayOrder={items.length + 1}
              products={products}
              submitLabel="Create"
            />
          </AdminModal>
          <form
            action="/api/admin/settings/product-recommendations"
            className="flex flex-wrap items-center gap-3 rounded-md border border-[#ece7df] bg-white px-3 py-2"
            method="post"
          >
            <input name="redirect_to" type="hidden" value="/admin/features" />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                defaultChecked={recommendationsEnabled}
                name="product_recommendations_enabled"
                type="checkbox"
              />
              Visible
            </label>
            <button className="admin-secondary-action px-3 py-1.5 text-xs" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>

      {items.length ? (
        <div className="overflow-x-visible">
          <table className="admin-table min-w-[980px]">
            <thead>
              <tr>
                <th>Order</th>
                <th>Image</th>
                <th>Product</th>
                <th>Same product rule</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">#{item.sort_order + 1}</td>
                  <td>
                    <div className="relative h-24 w-20 overflow-hidden rounded-md border border-[#ece7df] bg-[#f6f3ef]">
                      <Image
                        alt={item.products?.name ?? "You may also like product"}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={item.image_url}
                        unoptimized
                      />
                    </div>
                  </td>
                  <td>
                    {item.products ? (
                      <div className="grid gap-1">
                        <Link
                          className="font-semibold underline underline-offset-4"
                          href={`/admin/products/${item.products.id}/edit`}
                        >
                          {item.products.name}
                        </Link>
                        <span className="admin-muted text-xs">{item.products.slug}</span>
                      </div>
                    ) : (
                      <span className="text-red-600">Product missing</span>
                    )}
                  </td>
                  <td>
                    {item.exclude_current_product
                      ? "Hidden on its own product page"
                      : "Can show on its own product page"}
                  </td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                  <td className="text-right">
                    <details className="relative z-20 inline-block">
                      <summary className="admin-secondary-action inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center marker:content-['']">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="admin-menu absolute right-0 top-full z-[1000] mt-2 grid w-36 p-2 text-left">
                        <AdminModal
                          title="Edit You May Also Like item"
                          trigger={
                            <span className="flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </span>
                          }
                          width="w-[min(94vw,760px)]"
                        >
                          <FeatureItemForm
                            action={`/api/admin/features/you-may-also-like/${item.id}`}
                            item={item}
                            products={products}
                            submitLabel="Save"
                          />
                        </AdminModal>
                        <form action={`/api/admin/features/you-may-also-like/${item.id}`} method="post">
                          <button
                            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
                            name="_method"
                            type="submit"
                            value="DELETE"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-sm font-semibold text-[#81796f]">
          No You May Also Like products yet.
        </div>
      )}
    </section>
  );
}

function FeatureItemForm({
  action,
  defaultDisplayOrder,
  item,
  products,
  submitLabel,
}: {
  action: string;
  defaultDisplayOrder?: number;
  item?: YouMayAlsoLikeItem;
  products: ProductWithImages[];
  submitLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    item?.product_id ?? products[0]?.id ?? "",
  );
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [message, setMessage] = useState("");

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;

    return products.filter((product) =>
      `${product.name} ${product.slug}`.toLowerCase().includes(trimmed),
    );
  }, [products, query]);

  const selectedProduct = products.find((product) => product.id === selectedProductId);
  const displayOrder = item ? item.sort_order + 1 : defaultDisplayOrder ?? 1;

  function resetUpload() {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <form
      action={action}
      className="grid gap-5"
      encType="multipart/form-data"
      method="post"
    >
      {item ? <input name="_method" type="hidden" value="PATCH" /> : null}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3">
          <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
            Search product
            <input
              className="admin-input"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or slug"
              type="search"
              value={query}
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
            Product
            <select
              className="admin-input"
              name="product_id"
              onChange={(event) => setSelectedProductId(event.target.value)}
              required
              size={Math.min(8, Math.max(3, filteredProducts.length))}
              value={selectedProductId}
            >
              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          {selectedProduct ? (
            <div className="flex items-center gap-3 rounded-md border border-[#ece7df] p-2">
              <div className="relative h-14 w-12 overflow-hidden rounded bg-[#f6f3ef]">
                <Image
                  alt={selectedProduct.name}
                  className="object-cover"
                  fill
                  sizes="48px"
                  src={
                    selectedProduct.main_image_url ??
                    selectedProduct.product_images[0]?.image_url ??
                    FALLBACK_PRODUCT_IMAGE
                  }
                  unoptimized
                />
              </div>
              <p className="text-sm font-semibold">{selectedProduct.name}</p>
            </div>
          ) : null}
        </div>

        <div className="grid content-start gap-4">
          <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
            Carousel order
            <input
              className="admin-input"
              defaultValue={displayOrder}
              min="1"
              name="display_order"
              required
              type="number"
            />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
            Product image
            <UploadButton
              disabled={Boolean(preview)}
              inputRef={inputRef}
              name="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > MAX_FEATURE_IMAGE_SIZE) {
                  setMessage(`Image must be ${MAX_FEATURE_IMAGE_SIZE_MB} MB or smaller.`);
                  event.target.value = "";
                  return;
                }
                setMessage("");
                setPreview({
                  complete: true,
                  id: `${file.name}-${file.lastModified}`,
                  name: file.name,
                  progress: 100,
                  url: URL.createObjectURL(file),
                });
              }}
            >
              {preview ? "Image selected" : item ? "Replace image" : "Upload product image"}
            </UploadButton>
            <span className="text-[0.65rem] text-[#9a9288]">
              Max {MAX_FEATURE_IMAGE_SIZE_MB} MB
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            {item ? (
              <span className="grid gap-2">
                <span className="text-xs font-semibold uppercase text-[#81796f]">
                  Current
                </span>
                <span className="relative block h-20 w-16 overflow-hidden rounded-md border border-[#ece7df] bg-[#f6f3ef]">
                  <Image
                    alt={item.products?.name ?? "Current feature image"}
                    className="object-cover"
                    fill
                    sizes="64px"
                    src={item.image_url}
                    unoptimized
                  />
                </span>
              </span>
            ) : null}
            {preview ? <UploadThumb item={preview} onRemove={resetUpload} size={64} /> : null}
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              defaultChecked={item?.exclude_current_product ?? true}
              name="exclude_current_product"
              type="checkbox"
            />
            Avoid showing the same product on its own product page
          </label>
        </div>
      </div>

      {message ? <p className="text-sm font-semibold text-red-500">{message}</p> : null}

      <div className="flex justify-end">
        <button className="admin-action px-4 py-2.5 text-sm" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
