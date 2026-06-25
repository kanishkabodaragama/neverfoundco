"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Bold, CalendarClock, Italic, List, Plus, Trash2, X } from "lucide-react";
import { cropImageFilesToSquare, setInputFiles } from "@/components/admin/image-cropper";
import { UploadButton, UploadThumb, type UploadPreview } from "@/components/admin/upload-thumbnail";
import type { ProductCategory } from "@/lib/db/categories";
import type { ProductWithImages } from "@/lib/db/products";
import type { VariantOption } from "@/lib/db/variant-options";

type Gender = "Male" | "Female" | "Unisex";
type ProductStatus = "draft" | "published" | "inactive";
type VariantBasis = "color" | "size" | "gender";
type DraftVariant = {
  id?: string;
  key: string;
  color: string;
  size: string;
  gender: Gender;
  sku: string;
  stock_quantity: number;
  price: string;
  sale_price: string;
  unit_cost: string;
  image_url?: string | null;
};
type FileUploadPreview = UploadPreview & { file: File };

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const fallbackCategories = ["T-Shirts", "Hoodies", "Shirts", "Pants", "Accessories"];
const fallbackColors = ["Black", "Blue", "Blush", "Brown", "Cream", "Dark Navy Blue", "Green", "Ivory", "Mint", "Navy Blue", "Purple", "Sage Green", "Stone", "White", "Yellow"];
const fallbackSizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const fallbackGenders: Gender[] = ["Male", "Female", "Unisex"];

export function ProductForm({
  product,
  categories = [],
  variantOptions = [],
}: {
  product?: ProductWithImages;
  categories?: ProductCategory[];
  variantOptions?: VariantOption[];
}) {
  const action = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
  const [status, setStatus] = useState<ProductStatus>(product?.product_status ?? "draft");
  const [stockTracking, setStockTracking] = useState(product?.stock_tracking_enabled ?? true);
  const [showStockCount, setShowStockCount] = useState(product?.show_stock_count ?? false);
  const [preorderEnabled, setPreorderEnabled] = useState(product?.preorder_enabled ?? false);
  const [totalStock, setTotalStock] = useState(product?.stock_quantity ?? 0);
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [variantOpen, setVariantOpen] = useState(Boolean(product?.product_variants?.length));
  const [basis, setBasis] = useState<Record<VariantBasis, boolean>>({
    color: true,
    size: true,
    gender: true,
  });
  const [basisConfirmed, setBasisConfirmed] = useState(Boolean(product?.product_variants?.length));
  const [featuredRemoved, setFeaturedRemoved] = useState(false);
  const [removedGalleryImageIds, setRemovedGalleryImageIds] = useState<string[]>([]);
  const [removedVariantImageIds, setRemovedVariantImageIds] = useState<string[]>([]);
  const [colors, setColors] = useState(getJsonList(product?.colors, ["Black"]));
  const [sizes, setSizes] = useState(getJsonList(product?.sizes, ["M"]));
  const [genders, setGenders] = useState<Gender[]>(
    getJsonList(product?.genders, ["Unisex"]) as Gender[],
  );
  const [variants, setVariants] = useState<DraftVariant[]>(() =>
    (product?.product_variants ?? []).map((variant) => ({
      id: variant.id,
      key: variant.id,
      color: variant.color,
      size: variant.size,
      gender: variant.gender,
      sku: `SKU-${variant.color}-${variant.size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
      stock_quantity: variant.stock_quantity,
      price: variant.price === null ? "" : String(variant.price),
      sale_price: variant.sale_price === null ? "" : String(variant.sale_price),
      unit_cost: variant.unit_cost === null ? "" : String(variant.unit_cost),
      image_url: variant.image_url,
    })),
  );
  const availableColors = optionNames(variantOptions, "color", fallbackColors);
  const availableSizes = optionNames(variantOptions, "size", fallbackSizes);
  const availableGenders = optionNames(variantOptions, "gender", fallbackGenders) as Gender[];
  const categoryOptions = categories.length
    ? categories.filter((category) => category.is_active).map((category) => category.name)
    : fallbackCategories;
  const colorSwatches = Object.fromEntries(
    variantOptions
      .filter((option) => option.option_type === "color")
      .map((option) => [option.name, option.color_value]),
  );

  const assignedStock = useMemo(
    () => variants.reduce((total, variant) => total + Number(variant.stock_quantity || 0), 0),
    [variants],
  );
  const remainingStock = Math.max(0, Number(totalStock || 0) - assignedStock);
  const serializedVariants = useMemo(
    () => JSON.stringify(dedupeVariants(variants)),
    [variants],
  );
  const featuredImageUrl = product?.main_image_url ?? product?.product_images?.[0]?.image_url ?? null;

  function generateVariants() {
    const colorValues = basis.color ? colors : ["Default"];
    const sizeValues = basis.size ? sizes : ["Default"];
    const genderValues: Gender[] = basis.gender ? genders : ["Unisex"];
    const dedupedVariants = dedupeVariants(variants);
    const existingCombinations = new Set(dedupedVariants.map(getVariantCombinationKey));
    const generated = genderValues.flatMap((gender) =>
      colorValues.flatMap((color) =>
        sizeValues
          .filter((size) => !existingCombinations.has(getVariantCombinationKey({ gender, color, size })))
          .map((size) => ({
            key: `${gender}-${color}-${size}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            color,
            size,
            gender,
            sku: `SKU-${color}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-"),
            stock_quantity: 0,
            price: "",
            sale_price: "",
            unit_cost: "",
          })),
      ),
    );

    setVariants([...dedupedVariants, ...generated]);
  }

  function updateVariant(key: string, stock: number) {
    setVariants((current) =>
      current.map((variant) =>
        variant.key === key ? { ...variant, stock_quantity: Math.max(0, stock) } : variant,
      ),
    );
  }

  function updateVariantField(key: string, field: "price" | "sale_price" | "unit_cost", value: string) {
    setVariants((current) =>
      current.map((variant) => (variant.key === key ? { ...variant, [field]: value } : variant)),
    );
  }

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data" method="post">
      {product ? <input name="_method" type="hidden" value="PATCH" /> : null}
      {product ? <input name="redirect_to" type="hidden" value={`/admin/products/${product.id}/edit`} /> : null}
      <input name="colors" type="hidden" value={colors.join(",")} />
      <input name="sizes" type="hidden" value={sizes.join(",")} />
      <input name="variants_json" type="hidden" value={serializedVariants} />
      {featuredRemoved ? <input name="remove_featured_image" type="hidden" value="true" /> : null}
      {removedGalleryImageIds.map((id) => (
        <input key={id} name="remove_gallery_image_ids" type="hidden" value={id} />
      ))}
      {removedVariantImageIds.map((id) => (
        <input key={id} name="remove_variant_image_ids" type="hidden" value={id} />
      ))}
      {genders.map((gender) => (
        <input key={gender} name="genders" type="hidden" value={gender} />
      ))}

      <section className="admin-card p-4">
        <h2 className="font-semibold">Product details</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <label className="grid gap-2 font-semibold lg:col-span-2">
            Product name
            <input className="admin-input" defaultValue={product?.name ?? ""} name="name" required />
          </label>
          <label className="grid gap-2 font-semibold">
            Category
            <select className="admin-input" defaultValue={product?.category ?? "T-Shirts"} name="category">
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 font-semibold">
            Product status
            <select
              className="admin-input"
              name="product_status"
              onChange={(event) => setStatus(event.target.value as ProductStatus)}
              value={status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="grid gap-2 font-semibold">
            Slug
            <input className="admin-input" defaultValue={product?.slug ?? ""} name="slug" placeholder="auto generated" />
          </label>
          <label className="grid gap-2 font-semibold">
            Total stock
            <input
              className="admin-input"
              min="0"
              name="stock_quantity"
              onChange={(event) => setTotalStock(Number(event.target.value))}
              type="number"
              value={totalStock}
            />
          </label>
          <label className="grid gap-2 font-semibold">
            General price (USD)
            <input className="admin-input" defaultValue={product?.price ?? "0"} name="price" step="0.01" type="number" />
          </label>
          <label className="grid gap-2 font-semibold">
            General sale price (USD)
            <input className="admin-input" defaultValue={product?.sale_price ?? ""} name="sale_price" step="0.01" type="number" />
          </label>
          <label className="grid gap-2 font-semibold">
            Unit cost (USD)
            <input className="admin-input" defaultValue={product?.unit_cost ?? ""} name="unit_cost" placeholder="Used for profit reports" step="0.01" type="number" />
          </label>
        </div>
        <div className="mt-4 grid gap-3 rounded-md border border-[#ece7df] p-4 md:grid-cols-4">
          <ToggleField
            checked={stockTracking}
            label="Stock tracking enabled"
            name="stock_tracking_enabled"
            onChange={setStockTracking}
          />
          <ToggleField
            checked={showStockCount}
            label="Show stock count"
            name="show_stock_count"
            onChange={setShowStockCount}
          />
          <ToggleField
            checked={preorderEnabled}
            label="Pre order enabled"
            name="preorder_enabled"
            onChange={setPreorderEnabled}
          />
          <p className="admin-muted flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Variant stock {assignedStock} / {totalStock}. Remaining {remainingStock}.
          </p>
        </div>
        {preorderEnabled ? (
          <div className="mt-4 grid gap-4 rounded-md border border-[#ece7df] p-4 md:grid-cols-3">
            <label className="grid gap-2 font-semibold">
              Start date & time
              <input className="admin-input" defaultValue={toDateTimeLocal(product?.preorder_start_at)} name="preorder_start_at" type="datetime-local" />
            </label>
            <label className="grid gap-2 font-semibold">
              End date & time
              <input className="admin-input" defaultValue={toDateTimeLocal(product?.preorder_end_at)} name="preorder_end_at" type="datetime-local" />
            </label>
            <label className="grid gap-2 font-semibold">
              Quantity limit
              <input className="admin-input" defaultValue={product?.preorder_quantity_limit ?? ""} name="preorder_quantity_limit" placeholder="Unlimited" type="number" />
            </label>
          </div>
        ) : null}
      </section>

      <section className="admin-card p-4">
        <h2 className="font-semibold">Descriptions</h2>
        <div className="mt-4 grid gap-4">
          <RichTextarea
            label="Short description"
            name="short_description"
            onChange={setShortDescription}
            rows={5}
            value={shortDescription}
          />
          <RichTextarea
            label="Main description"
            name="description"
            onChange={setDescription}
            rows={10}
            value={description}
          />
        </div>
      </section>

      <section className="admin-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Variants</h2>
            <p className="admin-muted mt-1">Choose variant bases, select values, then generate all combinations.</p>
          </div>
          <button
            className="admin-secondary-action flex items-center gap-2 px-3 py-2"
            onClick={() => setVariantOpen((open) => !open)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add variant
          </button>
        </div>

        {variantOpen ? (
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 rounded-md border border-[#ece7df] p-4 md:grid-cols-3">
              {(["color", "size", "gender"] as VariantBasis[]).map((item) => (
                <label className="flex items-center gap-3 font-semibold capitalize" key={item}>
                  <input
                    checked={basis[item]}
                    onChange={(event) =>
                      setBasis((current) => ({ ...current, [item]: event.target.checked }))
                    }
                    type="checkbox"
                  />
                  {item}
                </label>
              ))}
            </div>
            <button
              className="admin-action px-4 py-2.5"
              onClick={() => setBasisConfirmed(true)}
              type="button"
            >
              Proceed
            </button>
            {basisConfirmed ? (
              <div className="grid gap-4 md:grid-cols-3">
                {basis.gender ? (
                  <OptionColumn label="Gender" options={availableGenders} selected={genders} setSelected={setGenders} />
                ) : null}
                {basis.color ? (
                  <OptionColumn colorSwatches={colorSwatches} label="Colors" options={availableColors} selected={colors} setSelected={setColors} />
                ) : null}
                {basis.size ? (
                  <OptionColumn label="Sizes" options={availableSizes} selected={sizes} setSelected={setSizes} />
                ) : null}
              </div>
            ) : null}
            {basisConfirmed ? (
              <button className="admin-action px-4 py-2.5" onClick={generateVariants} type="button">
                Generate missing variants
              </button>
            ) : null}

            <div className="overflow-x-auto rounded-md border border-[#ece7df]">
              <table className="admin-table min-w-[900px]">
                <thead>
                  <tr>
                    <th>Gender</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Variant SKU</th>
                    <th>Image</th>
                    <th>Stock amount</th>
                    <th>Variant price</th>
                    <th>Sale price</th>
                    <th>Unit cost</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {variants.length ? (
                    variants.map((variant) => (
                      <tr key={variant.key}>
                        <td>{variant.gender}</td>
                        <td>
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="h-4 w-4 rounded-full border border-[#ece7df]"
                              style={{ backgroundColor: colorSwatches[variant.color] ?? "#fff" }}
                            />
                            {variant.color}
                          </span>
                        </td>
                        <td>{variant.size}</td>
                        <td>{variant.sku}</td>
                        <td>
                          {variant.image_url && !removedVariantImageIds.includes(variant.id ?? "") ? (
                            <div className="mb-2">
                              <ExistingImagePreview
                                compact
                                name={variant.sku}
                                onRemove={
                                  variant.id
                                    ? () => setRemovedVariantImageIds((current) => addUnique(current, variant.id!))
                                    : undefined
                                }
                                url={variant.image_url}
                              />
                            </div>
                          ) : null}
                          {!variant.image_url || removedVariantImageIds.includes(variant.id ?? "") ? (
                            <FilePreviewInput compact name={`variant_image_${variant.key}`} />
                          ) : (
                            <p className="admin-muted max-w-28 text-[0.65rem]">
                              Remove image first to replace.
                            </p>
                          )}
                        </td>
                        <td>
                          <input
                            className="admin-input w-28"
                            min="0"
                            onChange={(event) => updateVariant(variant.key, Number(event.target.value))}
                            type="number"
                            value={variant.stock_quantity}
                          />
                        </td>
                        <td>
                          <input className="admin-input w-28" onChange={(event) => updateVariantField(variant.key, "price", event.target.value)} placeholder="USD" step="0.01" type="number" value={variant.price} />
                        </td>
                        <td>
                          <input className="admin-input w-28" onChange={(event) => updateVariantField(variant.key, "sale_price", event.target.value)} placeholder="USD" step="0.01" type="number" value={variant.sale_price} />
                        </td>
                        <td>
                          <input className="admin-input w-28" onChange={(event) => updateVariantField(variant.key, "unit_cost", event.target.value)} placeholder="USD" step="0.01" type="number" value={variant.unit_cost} />
                        </td>
                        <td className="text-right">
                          <button
                            className="admin-secondary-action inline-flex h-9 w-9 items-center justify-center text-red-500"
                            onClick={() => setVariants((current) => current.filter((item) => item.key !== variant.key))}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="admin-muted" colSpan={10}>
                        No variants generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>

      <section className="admin-card p-4">
        <h2 className="font-semibold">Media</h2>
        <p className="admin-muted mt-1">Upload one featured product image and gallery images. Each image must be below 2 MB.</p>
        {featuredImageUrl || product?.product_images?.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
            <div>
              {featuredImageUrl && !featuredRemoved ? (
                <ExistingImagePreview
                  label="Current featured image"
                  name={product?.name ?? "Product image"}
                  onRemove={() => setFeaturedRemoved(true)}
                  url={featuredImageUrl}
                />
              ) : (
                <FilePreviewInput label="Featured image replacement" name="featured_file" />
              )}
              {featuredImageUrl && !featuredRemoved ? (
                <p className="admin-muted mt-2 text-xs">Remove current featured image before replacing it.</p>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#81796f]">Current gallery</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {product?.product_images?.map((image) => (
                  <span className="grid gap-2" key={image.id}>
                    {removedGalleryImageIds.includes(image.id) ? (
                      <FilePreviewInput compact name={`replace_gallery_image_${image.id}`} />
                    ) : (
                      <ExistingImagePreview
                        compact
                        name={image.alt_text ?? product?.name ?? "Gallery image"}
                        onRemove={() => setRemovedGalleryImageIds((current) => addUnique(current, image.id))}
                        url={image.image_url}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {!featuredImageUrl ? <FilePreviewInput label="Featured image" name="featured_file" /> : null}
          <FilePreviewInput label="Gallery images" multiple name="gallery_files" />
        </div>
      </section>

      <section className="admin-card p-4">
        <h2 className="font-semibold">SEO</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 font-semibold">
            Meta title
            <input className="admin-input" defaultValue={product?.meta_title ?? ""} name="meta_title" />
          </label>
          <label className="grid gap-2 font-semibold">
            Meta description
            <input className="admin-input" defaultValue={product?.meta_description ?? ""} name="meta_description" />
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button className="admin-secondary-action px-4 py-2.5" name="submit_status" type="submit" value="draft">
          Save as draft
        </button>
        <button className="admin-action px-4 py-2.5" name="submit_status" type="submit" value="published">
          Publish product
        </button>
      </div>
    </form>
  );
}

function ToggleField({
  checked,
  label,
  name,
  onChange,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 font-semibold">
      <input name={name} type="hidden" value={checked ? "true" : "false"} />
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      {label}
    </label>
  );
}

function RichTextarea({
  label,
  name,
  onChange,
  rows,
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  rows: number;
  value: string;
}) {
  function wrap(before: string, after = before) {
    onChange(`${value}${before}text${after}`);
  }

  return (
    <label className="grid gap-2 font-semibold">
      {label}
      <span className="flex flex-wrap gap-2">
        <button className="admin-secondary-action px-3 py-2" onClick={() => wrap("**")} type="button">
          <Bold className="h-4 w-4" />
        </button>
        <button className="admin-secondary-action px-3 py-2" onClick={() => wrap("_")} type="button">
          <Italic className="h-4 w-4" />
        </button>
        <button className="admin-secondary-action px-3 py-2" onClick={() => onChange(`${value}\n- List item`)} type="button">
          <List className="h-4 w-4" />
        </button>
      </span>
      <textarea
        className="admin-input resize-y"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function OptionColumn<T extends string>({
  colorSwatches,
  label,
  options,
  selected,
  setSelected,
}: {
  colorSwatches?: Record<string, string | null>;
  label: string;
  options: T[];
  selected: T[];
  setSelected: (items: T[]) => void;
}) {
  return (
    <div className="rounded-md border border-[#ece7df] p-4">
      <p className="font-semibold">{label}</p>
      <div className="mt-3 grid gap-2">
        {options.map((option) => (
          <label className="flex items-center gap-2" key={option}>
            <input
              checked={selected.includes(option)}
              onChange={(event) =>
                setSelected(
                  event.target.checked
                    ? [...selected, option]
                    : selected.filter((item) => item !== option),
                )
              }
              type="checkbox"
            />
            {colorSwatches ? (
              <span
                className="h-4 w-4 rounded-full border border-[#ece7df]"
                style={{ backgroundColor: colorSwatches[option] ?? "#fff" }}
              />
            ) : null}
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function FilePreviewInput({
  compact,
  label,
  multiple,
  name,
}: {
  compact?: boolean;
  label?: string;
  multiple?: boolean;
  name: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<FileUploadPreview[]>([]);
  const [message, setMessage] = useState("");

  function animateProgress(items: FileUploadPreview[]) {
    setPreviews(items.map((item) => ({ ...item, progress: 12, complete: false })));
    [35, 68, 100].forEach((value, index) => {
      window.setTimeout(() => {
        setPreviews((current) =>
          current.map((item) => ({
            ...item,
            progress: value,
            complete: value === 100,
          })),
        );
      }, 140 * (index + 1));
    });
  }

  function removePreview(id: string) {
    const removed = previews.find((preview) => preview.id === id);
    const nextPreviews = previews.filter((preview) => preview.id !== id);

    if (removed) URL.revokeObjectURL(removed.url);
    setPreviews(nextPreviews);
    setMessage("");

    if (!inputRef.current) return;
    if (!nextPreviews.length) {
      inputRef.current.value = "";
      return;
    }

    const transfer = new DataTransfer();
    nextPreviews.forEach((preview) => transfer.items.add(preview.file));
    inputRef.current.files = transfer.files;
  }

  return (
    <label className="grid gap-2 font-semibold">
      {label}
      <UploadButton
        disabled={!multiple && previews.length > 0}
        inputRef={inputRef}
        multiple={multiple}
        name={name}
        onChange={async (event) => {
          const selectedFiles = Array.from(event.target.files ?? []);
          const files = await cropImageFilesToSquare(selectedFiles);
          const oversized = files.find((file) => file.size > MAX_FILE_SIZE);

          if (oversized) {
            setMessage(`${oversized.name} is larger than 2 MB after cropping.`);
            event.target.value = "";
            return;
          }

          setInputFiles(event.target, files);

          const items = files.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            url: URL.createObjectURL(file),
            name: file.name,
            progress: 0,
            complete: false,
            file,
          }));
          setMessage("");
          animateProgress(items);
        }}
      >
        {!multiple && previews.length ? "Image selected" : "Upload"}
      </UploadButton>
      {message ? <span className="text-xs font-semibold text-red-500">{message}</span> : null}
      {previews.length ? (
        <span className={`flex flex-wrap gap-2 ${compact ? "max-w-24" : ""}`}>
          {previews.map((preview) => (
            <UploadThumb
              item={preview}
              key={preview.id}
              onRemove={() => removePreview(preview.id)}
              size={compact ? 54 : 72}
            />
          ))}
        </span>
      ) : null}
    </label>
  );
}

function ExistingImagePreview({
  compact,
  label,
  name,
  onRemove,
  url,
}: {
  compact?: boolean;
  label?: string;
  name: string;
  onRemove?: () => void;
  url?: string | null;
}) {
  if (!url) {
    return (
      <div>
        {label ? <p className="text-xs font-semibold uppercase text-[#81796f]">{label}</p> : null}
        <div className="admin-muted mt-2 grid h-24 w-24 place-items-center rounded-md border border-[#ece7df] text-center text-[0.65rem] font-semibold uppercase">
          No image
        </div>
      </div>
    );
  }

  const size = compact ? 72 : 128;

  return (
    <div className="relative w-fit">
      {label ? <p className="text-xs font-semibold uppercase text-[#81796f]">{label}</p> : null}
      <a
        className="relative mt-2 block overflow-hidden rounded-md border border-[#ece7df] bg-[#f7f3ed]"
        href={url}
        rel="noreferrer"
        style={{ height: size, width: size }}
        target="_blank"
      >
        <Image
          alt={name}
          className="object-cover"
          fill
          sizes={`${size}px`}
          src={url}
          unoptimized
        />
      </a>
      {onRemove ? (
        <button
          aria-label={`Remove ${name}`}
          className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-md border border-[#ece7df] bg-white text-[#332c26] shadow-sm hover:text-red-500"
          onClick={onRemove}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

function dedupeVariants(variants: DraftVariant[]) {
  const seen = new Set<string>();

  return variants.filter((variant) => {
    const key = getVariantCombinationKey(variant);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getVariantCombinationKey({
  color,
  gender,
  size,
}: {
  color: string;
  gender: string;
  size: string;
}) {
  return `${gender}::${color}::${size}`.toLowerCase();
}

function addUnique(items: string[], value: string) {
  return items.includes(value) ? items : [...items, value];
}

function getJsonList(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.length ? value.map(String) : fallback;
}

function optionNames<T extends string>(
  options: VariantOption[],
  type: VariantOption["option_type"],
  fallback: T[],
) {
  const names = options.filter((option) => option.option_type === type).map((option) => option.name);
  return names.length ? (names as T[]) : fallback;
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}
