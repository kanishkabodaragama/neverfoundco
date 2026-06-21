import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductForm({ product }: { product?: Product }) {
  const action = product ? `/api/admin/products/${product.id}` : "/api/admin/products";

  return (
    <form
      action={action}
      className="grid gap-5 border border-[#F7F1E6]/10 bg-[#0B111C] p-5"
      method="post"
    >
      {product ? <input name="_method" type="hidden" value="PATCH" /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["name", "Name", product?.name ?? ""],
          ["slug", "Slug", product?.slug ?? ""],
          ["short_description", "Short description", product?.short_description ?? ""],
          ["description", "Description", product?.description ?? ""],
          ["price", "Price", product?.price ?? "0"],
          ["sale_price", "Sale price", product?.sale_price ?? ""],
          ["stock_quantity", "Stock quantity", product?.stock_quantity ?? "0"],
          ["meta_title", "Meta title", product?.meta_title ?? ""],
          ["meta_description", "Meta description", product?.meta_description ?? ""],
        ].map(([name, label, defaultValue]) => (
          <label
            className={`grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60 ${
              name === "description" || name === "meta_description"
                ? "md:col-span-2"
                : ""
            }`}
            key={name}
          >
            {label}
            <input
              className="admin-input"
              defaultValue={String(defaultValue)}
              name={String(name)}
            />
          </label>
        ))}
      </div>
      {/*
        Keep inputs simple because the existing API accepts form posts and storage
        images are managed separately on the edit page.
      */}
      <label className="flex items-center gap-3 text-sm font-black uppercase">
        <input
          defaultChecked={product?.is_active ?? true}
          name="is_active"
          type="checkbox"
          value="true"
        />
        <span>Published</span>
      </label>
      <button
        className="w-fit bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF]"
        type="submit"
      >
        Save product
      </button>
    </form>
  );
}
