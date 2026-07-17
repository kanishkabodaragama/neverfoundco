import type { AdminCoupon } from "@/lib/db/admin";
import { formatColomboDateTimeLocalInput } from "@/lib/date-time";
import type { ProductWithImages } from "@/lib/db/products";
import { formatCurrency } from "@/lib/utils";

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatColomboDateTimeLocalInput(date);
}

export function CouponForm({
  coupon,
  products,
}: {
  coupon?: AdminCoupon;
  products: ProductWithImages[];
}) {
  const selectedProducts = new Set(
    coupon?.coupon_products.map((item) => item.product_id) ?? [],
  );

  return (
    <form
      action={coupon ? `/api/admin/coupons/${coupon.id}` : "/api/admin/coupons"}
      className="grid gap-4"
      method="post"
    >
      {coupon ? <input name="_method" type="hidden" value="PATCH" /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Code" name="code" placeholder="DROP10" value={coupon?.code} />
        <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
          Discount type
          <select
            className="admin-input"
            defaultValue={coupon?.discount_type ?? "flat"}
            name="discount_type"
          >
            <option value="flat">Flat amount off</option>
            <option value="percentage">Percentage off</option>
          </select>
        </label>
        <Field
          label="Discount value (LKR for flat discounts)"
          name="discount_value"
          placeholder="500"
          type="number"
          value={coupon?.discount_value}
        />
        <Field
          label="Usage limit"
          name="usage_limit"
          placeholder="100"
          type="number"
          value={coupon?.usage_limit ?? ""}
        />
        <Field
          label="Starts at"
          name="starts_at"
          type="datetime-local"
          value={toDateTimeLocal(coupon?.starts_at)}
        />
        <Field
          label="Ends at"
          name="ends_at"
          type="datetime-local"
          value={toDateTimeLocal(coupon?.ends_at)}
        />
      </div>
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Description
        <textarea
          className="admin-input min-h-24"
          defaultValue={coupon?.description ?? ""}
          name="description"
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input
          defaultChecked={coupon?.is_active ?? true}
          name="is_active"
          type="checkbox"
          value="true"
        />
        Active coupon
      </label>
      <details className="rounded-md border border-[#ece7df] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#4a4037]">
          Product restrictions
        </summary>
        <div className="mt-4 grid max-h-64 gap-2 overflow-auto">
          {products.map((product) => (
            <label
              className="flex items-center justify-between gap-3 rounded-md border border-[#ece7df] p-3 text-sm"
              key={product.id}
            >
              <span className="flex items-center gap-3">
                <input
                  defaultChecked={selectedProducts.has(product.id)}
                  name="product_ids"
                  type="checkbox"
                  value={product.id}
                />
                <span>{product.name}</span>
              </span>
              <span className="admin-muted">
                {formatCurrency(Number(product.sale_price ?? product.price))}
              </span>
            </label>
          ))}
          {products.length === 0 ? (
            <p className="admin-muted text-sm">
              Add products before restricting coupons.
            </p>
          ) : null}
        </div>
      </details>
      <button
        className="admin-action w-fit px-5 py-3 text-sm"
        type="submit"
      >
        Save coupon
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value?: string | number | null;
}) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
      {label}
      <input
        className="admin-input"
        defaultValue={value ?? ""}
        name={name}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        type={type}
      />
    </label>
  );
}
