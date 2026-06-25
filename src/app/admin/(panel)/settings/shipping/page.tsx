import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { CsvDownloadButton } from "@/components/admin/csv-download-button";
import { AdminModal } from "@/components/admin/admin-modal";
import { ShippingRuleForm } from "@/components/admin/shipping-rule-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listShippingCountries, listShippingRules, type ShippingCountry, type ShippingRule } from "@/lib/db/shipping";

export const dynamic = "force-dynamic";

const countryChoices = [
  ["US", "United States", "USD"],
  ["LK", "Sri Lanka", "USD"],
  ["GB", "United Kingdom", "GBP"],
  ["CA", "Canada", "CAD"],
  ["AU", "Australia", "AUD"],
  ["IN", "India", "INR"],
  ["AE", "United Arab Emirates", "AED"],
  ["SG", "Singapore", "SGD"],
  ["MY", "Malaysia", "MYR"],
  ["DE", "Germany", "EUR"],
  ["FR", "France", "EUR"],
  ["IT", "Italy", "EUR"],
  ["NL", "Netherlands", "EUR"],
  ["JP", "Japan", "JPY"],
] as const;

export default async function ShippingSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const activeTab = params.tab === "countries" ? "countries" : "overview";
  const [countries, rules] = await Promise.all([listShippingCountries(), listShippingRules()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shipping</h1>
        <p className="admin-muted mt-2 text-sm">
          Manage countries, regions, and shipping rules used during checkout.
        </p>
      </div>
      <AdminAlert error={params.error} success={params.success} />

      <div className="flex gap-2">
        <a className={activeTab === "overview" ? "rounded-md bg-[#332c26] px-5 py-2.5 font-semibold text-white" : "admin-secondary-action px-5 py-2.5"} href="/admin/settings/shipping">
          Overview
        </a>
        <a className={activeTab === "countries" ? "rounded-md bg-[#332c26] px-5 py-2.5 font-semibold text-white" : "admin-secondary-action px-5 py-2.5"} href="/admin/settings/shipping?tab=countries">
          Countries
        </a>
      </div>

      {activeTab === "overview" ? (
        <ShippingRulesPanel countries={countries} rules={rules} />
      ) : (
        <CountriesPanel countries={countries} />
      )}
    </div>
  );
}

function ShippingRulesPanel({
  countries,
  rules,
}: {
  countries: ShippingCountry[];
  rules: ShippingRule[];
}) {
  const countryDefaultIds = new Set(
    rules
      .filter((rule) => rule.rule_type === "country_default" && rule.country_id)
      .map((rule) => rule.country_id),
  );
  const countryDefaultCountries = countries.filter((country) => countryDefaultIds.has(country.id));
  const ruleRows = rules.map((rule) => {
    const country = countries.find((item) => item.id === rule.country_id);
    const regionNames = country?.shipping_regions
      ?.filter((region) => Array.isArray(rule.region_ids) && rule.region_ids.map(String).includes(region.id))
      .map((region) => region.region_name);

    return {
      rule: formatRuleType(rule.rule_type),
      country: rule.rule_type === "international_default" ? "All other countries" : country?.country_name ?? "",
      regions: regionNames?.join(", ") ?? "",
      fee: Number(rule.fee).toFixed(2),
      currency: rule.currency,
      status: rule.is_active ? "Active" : "Inactive",
    };
  });

  return (
    <section className="admin-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece7df] p-4">
        <div>
          <h2 className="font-semibold">Shipping rules</h2>
          <p className="admin-muted mt-1 text-sm">International, country, and region-specific rates.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CsvDownloadButton
            columns={[
              { key: "rule", label: "Rule" },
              { key: "country", label: "Country" },
              { key: "regions", label: "Regions" },
              { key: "fee", label: "Fee" },
              { key: "currency", label: "Currency" },
              { key: "status", label: "Status" },
            ]}
            filename="neverfoundco-shipping-rules"
            rows={ruleRows}
            title="Never Found Co Shipping Rules"
          />
          <AdminModal
            title="Create shipping rule"
            trigger={<span className="admin-action flex items-center gap-2 px-4 py-2.5"><Plus className="h-4 w-4" />Create shipping rule</span>}
            width="w-[min(94vw,560px)]"
          >
            <ShippingRuleForm
              countries={countries}
              countryDefaultCountries={countryDefaultCountries}
              hasInternationalDefault={rules.some((rule) => rule.rule_type === "international_default" && rule.is_active)}
            />
          </AdminModal>
        </div>
      </div>
      <div className="overflow-x-visible">
        <table className="admin-table min-w-[900px]">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Country</th>
              <th>Regions</th>
              <th>Fee</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => {
              const country = countries.find((item) => item.id === rule.country_id);
              const regionNames = country?.shipping_regions
                ?.filter((region) => Array.isArray(rule.region_ids) && rule.region_ids.map(String).includes(region.id))
                .map((region) => region.region_name);

              return (
                <tr key={rule.id}>
                  <td>{formatRuleType(rule.rule_type)}</td>
                  <td>{rule.rule_type === "international_default" ? "All other countries" : country?.country_name ?? "-"}</td>
                  <td>{regionNames?.length ? regionNames.join(", ") : "-"}</td>
                  <td>{rule.currency} {Number(rule.fee).toFixed(2)}</td>
                  <td>{rule.is_active ? "Active" : "Inactive"}</td>
                  <td className="text-right">
                    <details className="relative z-20 inline-block">
                      <summary className="admin-secondary-action inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center marker:content-['']">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-36 p-2 text-left">
                        <AdminModal
                          title="Edit shipping rule"
                          trigger={<span className="block rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]">Edit</span>}
                          width="w-[min(92vw,560px)]"
                        >
                        <ShippingRuleForm
                          countries={countries}
                          countryDefaultCountries={countryDefaultCountries}
                          rule={rule}
                        />
                        </AdminModal>
                        <form action={`/api/admin/shipping-rules/${rule.id}`} method="post">
                          <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50" name="_method" type="submit" value="DELETE">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
            {rules.length === 0 ? (
              <tr>
                <td className="admin-muted" colSpan={6}>No shipping rules yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CountriesPanel({ countries }: { countries: ShippingCountry[] }) {
  const countryRows = countries.map((country) => ({
    country: country.country_name,
    code: country.country_code,
    currency: country.currency,
    regions: country.shipping_regions?.map((region) => region.region_name).join(", ") ?? "",
    status: country.is_active ? "Active" : "Inactive",
  }));

  return (
    <section className="admin-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ece7df] p-4">
        <div>
          <h2 className="font-semibold">Countries</h2>
          <p className="admin-muted mt-1 text-sm">Countries and manually entered regions available for shipping rules.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CsvDownloadButton
            columns={[
              { key: "country", label: "Country" },
              { key: "code", label: "Code" },
              { key: "currency", label: "Currency" },
              { key: "regions", label: "Regions" },
              { key: "status", label: "Status" },
            ]}
            filename="neverfoundco-shipping-countries"
            rows={countryRows}
            title="Never Found Co Shipping Countries"
          />
          <AdminModal
            title="Create country"
            trigger={<span className="admin-action flex items-center gap-2 px-4 py-2.5"><Plus className="h-4 w-4" />Create country</span>}
            width="w-[min(94vw,520px)]"
          >
            <CountryForm />
          </AdminModal>
        </div>
      </div>
      <div className="overflow-x-visible">
        <table className="admin-table min-w-[900px]">
          <thead>
            <tr>
              <th>Country</th>
              <th>Code</th>
              <th>Currency</th>
              <th>Regions</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.id}>
                <td>{country.country_name}</td>
                <td>{country.country_code}</td>
                <td>{country.currency}</td>
                <td>{country.shipping_regions?.map((region) => region.region_name).join(", ") || "-"}</td>
                <td>{country.is_active ? "Active" : "Inactive"}</td>
                <td className="text-right">
                  <details className="relative z-20 inline-block">
                    <summary className="admin-secondary-action inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center marker:content-['']">
                      <MoreHorizontal className="h-4 w-4" />
                    </summary>
                    <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-36 p-2 text-left">
                      <AdminModal
                        title="Edit country"
                        trigger={<span className="block rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]">Edit</span>}
                        width="w-[min(92vw,520px)]"
                      >
                        <CountryForm country={country} />
                      </AdminModal>
                      <form action={`/api/admin/shipping-countries/${country.id}`} method="post">
                        <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50" name="_method" type="submit" value="DELETE">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
            {countries.length === 0 ? (
              <tr>
                <td className="admin-muted" colSpan={6}>No countries created yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CountryForm({ country }: { country?: ShippingCountry }) {
  const action = country ? `/api/admin/shipping-countries/${country.id}` : "/api/admin/shipping-countries";
  const regions = country?.shipping_regions?.map((region) => region.region_name).join("\n") ?? "";

  return (
    <form action={action} className="grid gap-5" method="post">
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Country
        <select className="admin-input" defaultValue={country?.country_code ?? "US"} name="country_code">
          {countryChoices.map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </label>
      <input name="country_name" type="hidden" value={country?.country_name ?? ""} />
      <input name="currency" type="hidden" value={country?.currency ?? "USD"} />
      <input name="default_fee" type="hidden" value={country?.default_fee ?? 0} />
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Regions
        <textarea className="admin-input min-h-32" defaultValue={regions} name="regions" placeholder={"California\nNew York\nColombo"} />
      </label>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input defaultChecked={country?.is_active ?? true} name="is_active" type="checkbox" value="true" />
        Active country
      </label>
      <div className="flex justify-between gap-2">
        <button className="admin-action px-4 py-2.5 text-xs" type="submit">
          {country ? "Save country" : "Create country"}
        </button>
      </div>
    </form>
  );
}

function formatRuleType(type: ShippingRule["rule_type"]) {
  if (type === "international_default") return "International Default";
  if (type === "country_default") return "Country Default";
  return "Country Region Override";
}
