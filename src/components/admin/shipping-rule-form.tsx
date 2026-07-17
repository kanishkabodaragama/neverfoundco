"use client";

import { useMemo, useState } from "react";
import type { ShippingCountry, ShippingRule } from "@/lib/db/shipping";

function labelClass() {
  return "grid gap-2 text-xs font-semibold uppercase text-[#81796f]";
}

export function ShippingRuleForm({
  countries,
  countryDefaultCountries,
  hasInternationalDefault,
  rule,
}: {
  countries: ShippingCountry[];
  countryDefaultCountries: ShippingCountry[];
  hasInternationalDefault?: boolean;
  rule?: ShippingRule;
}) {
  const action = rule ? `/api/admin/shipping-rules/${rule.id}` : "/api/admin/shipping-rules";
  const [ruleType, setRuleType] = useState<ShippingRule["rule_type"]>(
    rule?.rule_type ?? "country_default",
  );
  const [countryId, setCountryId] = useState(rule?.country_id ?? "");
  const overrideCountries = countryDefaultCountries.length ? countryDefaultCountries : countries;
  const countryOptions = ruleType === "country_region_override" ? overrideCountries : countries;
  const selectedCountry = useMemo(
    () => countries.find((country) => country.id === countryId),
    [countries, countryId],
  );
  const regionOptions = ruleType === "country_region_override"
    ? selectedCountry?.shipping_regions ?? []
    : [];

  return (
    <form action={action} className="grid gap-5" method="post">
      <label className={labelClass()}>
        Rule type
        <select
          className="admin-input"
          name="rule_type"
          onChange={(event) => {
            const nextType = event.target.value as ShippingRule["rule_type"];
            setRuleType(nextType);
            if (nextType === "international_default") setCountryId("");
          }}
          value={ruleType}
        >
          {!hasInternationalDefault || rule?.rule_type === "international_default" ? (
            <option value="international_default">International Default</option>
          ) : null}
          <option value="country_default">Country Default</option>
          <option value="country_region_override">Country Region Override</option>
        </select>
      </label>

      <div className={ruleType === "international_default" ? "grid gap-3" : "grid gap-4 md:grid-cols-2"}>
        {ruleType !== "international_default" ? (
          <label className={labelClass()}>
            Country
            <select
              className="admin-input"
              name="country_id"
              onChange={(event) => setCountryId(event.target.value)}
              required
              value={countryId}
            >
              <option value="">Select country</option>
              {countryOptions.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <input name="country_id" type="hidden" value="" />
        )}

        <label className={labelClass()}>
          Fee (LKR)
          <input
            className="admin-input"
            defaultValue={rule?.fee ?? ""}
            min="0"
            name="fee"
            required
            step="0.01"
            type="number"
          />
        </label>
      </div>

      <input name="currency" type="hidden" value="LKR" />

      {ruleType === "country_region_override" ? (
        <div className="rounded-md border border-[#ece7df] p-4">
          <p className="text-xs font-semibold uppercase text-[#81796f]">Regions</p>
          <div className="mt-3 grid max-h-52 gap-2 overflow-auto sm:grid-cols-2">
            {regionOptions.map((region) => (
              <label className="flex items-center gap-2 text-sm" key={region.id}>
                <input
                  defaultChecked={Array.isArray(rule?.region_ids) && rule?.region_ids.map(String).includes(region.id)}
                  name="region_ids"
                  type="checkbox"
                  value={region.id}
                />
                {region.region_name}
              </label>
            ))}
            {countryId && regionOptions.length === 0 ? (
              <p className="admin-muted text-sm">No regions have been added for this country.</p>
            ) : null}
            {!countryId ? <p className="admin-muted text-sm">Select a country first.</p> : null}
          </div>
        </div>
      ) : null}

      <button className="admin-action w-fit px-4 py-2.5 text-xs" type="submit">
        {rule ? "Save rule" : "Create rule"}
      </button>
    </form>
  );
}
