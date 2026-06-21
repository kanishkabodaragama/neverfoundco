import { requireAdmin } from "@/lib/admin-auth";
import { listShippingCountries } from "@/lib/db/shipping";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ShippingSettingsPage() {
  await requireAdmin();
  const countries = await listShippingCountries();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
            Delivery
          </p>
          <h1 className="mt-3 font-mono text-3xl font-black uppercase md:text-5xl">
            Shipping
          </h1>
        </div>
        <details className="relative">
          <summary className="cursor-pointer bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF] marker:content-['']">
            Add country
          </summary>
          <div className="absolute right-0 z-30 mt-3 w-[min(92vw,520px)] border border-[#F7F1E6]/10 bg-[#0B111C] p-5 shadow-2xl">
            <CountryForm />
          </div>
        </details>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {countries.map((country) => (
          <section className="border border-[#F7F1E6]/10 bg-[#0B111C] p-5" key={country.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-mono text-xl font-black uppercase">
                  {country.country_name}
                </h2>
                <p className="mt-2 text-sm text-[#F7F1E6]/55">
                  {country.country_code} / {country.currency} /{" "}
                  {country.is_active ? "Active" : "Paused"}
                </p>
              </div>
              <p className="font-mono text-2xl font-black text-[#B8A8E8]">
                {formatCurrency(Number(country.default_fee))}
              </p>
            </div>

            <form
              action={`/api/admin/shipping-countries/${country.id}`}
              className="mt-5 grid gap-3 md:grid-cols-2"
              method="post"
            >
              <input defaultValue={country.country_name} name="country_name" type="hidden" />
              <input defaultValue={country.country_code} name="country_code" type="hidden" />
              <input defaultValue={country.currency} name="currency" type="hidden" />
              <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
                Default country price
                <input
                  className="admin-input"
                  defaultValue={country.default_fee}
                  name="default_fee"
                  step="0.01"
                  type="number"
                />
              </label>
              <label className="flex items-end gap-3 pb-3 text-sm font-black uppercase">
                <input
                  defaultChecked={country.is_active}
                  name="is_active"
                  type="checkbox"
                  value="true"
                />
                Active country
              </label>
              <button className="border border-[#F7F1E6]/20 px-4 py-3 text-sm font-black uppercase hover:border-[#F05267]" type="submit">
                Save country
              </button>
            </form>

            <div className="mt-6 border-t border-[#F7F1E6]/10 pt-5">
              <h3 className="text-sm font-black uppercase text-[#B8A8E8]">
                Area / district overrides
              </h3>
              <div className="mt-3 grid gap-2">
                {country.shipping_area_overrides.map((override) => (
                  <div
                    className="flex items-center justify-between gap-4 border border-[#F7F1E6]/10 px-3 py-2 text-sm"
                    key={override.id}
                  >
                    <span>{override.area_name}</span>
                    <span>{formatCurrency(Number(override.fee))}</span>
                  </div>
                ))}
                {country.shipping_area_overrides.length === 0 ? (
                  <p className="text-sm text-[#F7F1E6]/50">No overrides yet.</p>
                ) : null}
              </div>
              <form
                action={`/api/admin/shipping-countries/${country.id}/areas`}
                className="mt-4 grid gap-3 md:grid-cols-[1fr_140px_auto]"
                method="post"
              >
                <input className="admin-input" name="area_name" placeholder="Colombo district" />
                <input className="admin-input" name="fee" placeholder="350" step="0.01" type="number" />
                <button className="bg-[#F05267] px-4 py-3 text-sm font-black uppercase text-[#FFF9EF]" type="submit">
                  Add override
                </button>
              </form>
            </div>
          </section>
        ))}
      </div>
      {countries.length === 0 ? (
        <p className="border border-[#F7F1E6]/10 bg-[#0B111C] p-6 text-sm text-[#F7F1E6]/55">
          Add a country to make it available during checkout.
        </p>
      ) : null}
    </div>
  );
}

function CountryForm() {
  return (
    <form action="/api/admin/shipping-countries" className="grid gap-4" method="post">
      <Field label="Country" name="country_name" placeholder="Sri Lanka" />
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Code" name="country_code" placeholder="LK" />
        <Field label="Currency" name="currency" placeholder="LKR" />
        <Field label="Default fee" name="default_fee" placeholder="400" type="number" />
      </div>
      <label className="flex items-center gap-3 text-sm font-black uppercase">
        <input defaultChecked name="is_active" type="checkbox" value="true" />
        Active on checkout
      </label>
      <button className="bg-[#F05267] px-5 py-3 text-sm font-black uppercase text-[#FFF9EF]" type="submit">
        Save country
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-black uppercase text-[#F7F1E6]/60">
      {label}
      <input className="admin-input" name={name} placeholder={placeholder} type={type} />
    </label>
  );
}
