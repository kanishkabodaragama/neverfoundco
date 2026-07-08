"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { UploadButton, UploadThumb, type UploadPreview } from "@/components/admin/upload-thumbnail";
import type { ProductWithImages } from "@/lib/db/products";

const MAX_FEATURE_IMAGE_SIZE_MB = 4;
const MAX_FEATURE_IMAGE_SIZE = MAX_FEATURE_IMAGE_SIZE_MB * 1024 * 1024;

export function YouMayAlsoLikeFeatureForm({
  products,
}: {
  products: ProductWithImages[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [preview, setPreview] = useState<UploadPreview | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;

    return products.filter((product) =>
      `${product.name} ${product.slug}`.toLowerCase().includes(trimmed),
    );
  }, [products, query]);

  const selectedProduct = products.find((product) => product.id === selectedProductId);

  function resetUpload() {
    setPreview(null);
    formRef.current?.reset();
    if (inputRef.current) inputRef.current.value = "";
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const file = formData.get("file");

    if (!selectedProductId) {
      setMessage("Select a product.");
      return;
    }

    if (!(file instanceof File) || file.size === 0) {
      setMessage("Upload a feature image.");
      return;
    }

    if (file.size > MAX_FEATURE_IMAGE_SIZE) {
      setMessage(`Image must be ${MAX_FEATURE_IMAGE_SIZE_MB} MB or smaller.`);
      return;
    }

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/features/you-may-also-like");
    setIsUploading(true);
    setMessage("");

    request.upload.onprogress = (progressEvent) => {
      if (!progressEvent.lengthComputable) return;
      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      setPreview((current) =>
        current ? { ...current, complete: progress === 100, progress } : current,
      );
    };

    request.onload = () => {
      setIsUploading(false);
      if (request.status >= 200 && request.status < 400) {
        window.location.assign(request.responseURL || "/admin/features");
        return;
      }
      setMessage(request.responseText || "Feature item could not be created.");
    };

    request.onerror = () => {
      setIsUploading(false);
      setMessage("Feature item could not be created.");
    };

    request.send(formData);
  }

  return (
    <form
      action="/api/admin/features/you-may-also-like"
      className="grid gap-4 border-b border-[#ece7df] p-4 lg:grid-cols-[1fr_1fr_auto]"
      encType="multipart/form-data"
      method="post"
      onSubmit={submit}
      ref={formRef}
    >
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
            size={Math.min(7, Math.max(3, filteredProducts.length))}
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
                src={selectedProduct.main_image_url ?? selectedProduct.product_images[0]?.image_url ?? "/images/products/home-drop/never-found-logo-tee.png"}
                unoptimized
              />
            </div>
            <p className="text-sm font-semibold">{selectedProduct.name}</p>
          </div>
        ) : null}
      </div>

      <div className="grid content-start gap-4">
        <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
          Product image
          <UploadButton
            disabled={Boolean(preview) || isUploading}
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
                complete: false,
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                progress: 0,
                url: URL.createObjectURL(file),
              });
            }}
          >
            {preview ? "Image selected" : "Upload product image"}
          </UploadButton>
          <span className="text-[0.65rem] text-[#9a9288]">
            Max {MAX_FEATURE_IMAGE_SIZE_MB} MB
          </span>
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            defaultChecked
            name="exclude_current_product"
            type="checkbox"
          />
          Avoid showing the same product on its own product page
        </label>
        {preview ? <UploadThumb item={preview} onRemove={resetUpload} /> : null}
      </div>

      <div className="flex flex-col items-start gap-3">
        <button
          className="admin-action w-fit px-4 py-2.5 text-sm disabled:opacity-50"
          disabled={isUploading}
          type="submit"
        >
          {isUploading ? "Creating..." : "Create"}
        </button>
        {message ? <p className="text-sm font-semibold text-red-500">{message}</p> : null}
      </div>
    </form>
  );
}
