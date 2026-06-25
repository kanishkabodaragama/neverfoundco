"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useCart } from "@/components/store/cart-provider";
import { useStoreCurrency } from "@/components/store/currency-provider";
import type { ShippingCountry } from "@/lib/db/shipping";
import type { PayHereCheckoutPayload } from "@/types/commerce";

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function CheckoutExperience({ countries }: { countries: ShippingCountry[] }) {
  const cart = useCart();
  const { format, rateSource } = useStoreCurrency();
  const initialCountry = getInitialCountry(countries);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState(initialCountry.country_code);
  const [phoneCode, setPhoneCode] = useState(getCallingCode(initialCountry.country_code));
  const [district, setDistrict] = useState(
    initialCountry.shipping_regions?.[0]?.region_name ?? "Default",
  );

  const items = useMemo<CheckoutItem[]>(() => {
    return cart.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
    }));
  }, [cart.items]);

  const selectedCountry = countries.find((country) => country.country_code === countryCode);
  const shippingFee = Number(selectedCountry?.default_fee ?? 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const total = subtotal + shippingFee;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (cart.items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.get("customerName"),
          customerEmail: formData.get("customerEmail"),
          customerPhone: `${phoneCode} ${formData.get("customerPhone") ?? ""}`.trim(),
          addressLine1: formData.get("addressLine1"),
          addressLine2: formData.get("addressLine2"),
          countryCode: formData.get("countryCode"),
          city: formData.get("city"),
          district: formData.get("district"),
          postalCode: formData.get("postalCode"),
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const result = (await response.json()) as
        | { payhere: PayHereCheckoutPayload }
        | { error: string };

      if (!response.ok || "error" in result) {
        setMessage("error" in result ? result.error : "Checkout failed.");
        setIsSubmitting(false);
        return;
      }

      cart.clearCart();
      submitPayHere(result.payhere);
    } catch {
      setMessage("Checkout failed. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid w-full gap-6 bg-[#F7F1E6] px-5 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-8 xl:px-12">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#F05267]">
            Checkout
          </p>
          <h1 className="font-pixel mt-3 text-2xl font-black uppercase md:text-3xl">
            Complete order
          </h1>
        </div>
        <Panel title="Customer Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <CheckoutInput label="Full Name" name="customerName" required />
            <CheckoutInput label="Email Address" name="customerEmail" required type="email" />
            <label className="grid gap-2 sm:col-span-2">
              <span className="sr-only">Phone Number</span>
              <span className="grid grid-cols-[120px_1fr] gap-3">
                <select
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-3 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                  onChange={(event) => setPhoneCode(event.target.value)}
                  value={phoneCode}
                >
                  {countries.map((country) => (
                    <option key={`phone-${country.country_code}`} value={getCallingCode(country.country_code)}>
                      {getCallingCode(country.country_code)} {country.country_code}
                    </option>
                  ))}
                </select>
                <input
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none placeholder:text-[#10131A]/45 focus:border-[#F05267]"
                  name="customerPhone"
                  placeholder="Phone Number"
                  required
                  type="tel"
                />
              </span>
            </label>
          </div>
        </Panel>

        <Panel title="Shipping Address">
          <div className="grid gap-4">
            <CheckoutInput label="Address Line 1" name="addressLine1" required />
            <CheckoutInput label="Address Line 2" name="addressLine2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Country</span>
                <select
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                  name="countryCode"
                  onChange={(event) => {
                    setCountryCode(event.target.value);
                    const nextCountry = countries.find(
                      (country) => country.country_code === event.target.value,
                    );
                    setPhoneCode(getCallingCode(event.target.value));
                    setDistrict(
                      nextCountry?.shipping_regions?.[0]?.region_name ?? "Default",
                    );
                  }}
                  value={countryCode}
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.country_code}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="sr-only">District</span>
                <select
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                  name="district"
                  onChange={(event) => setDistrict(event.target.value)}
                  value={district}
                >
                  <option value="Default">Default district price</option>
                  {selectedCountry?.shipping_regions?.map((region) => (
                    <option key={region.id} value={region.region_name}>
                      {region.region_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutInput label="City" name="city" required />
              <CheckoutInput label="Postal Code" name="postalCode" />
            </div>
          </div>
        </Panel>

        <Panel title="Payment Option">
          <label className="block cursor-pointer bg-[#070B12] p-5 text-[#FFF9EF] transition hover:translate-x-0.5">
            <span className="flex items-start gap-4">
              <input
                className="mt-1 h-5 w-5 accent-[#F05267]"
                defaultChecked
                name="payment"
                type="radio"
                value="payhere"
              />
              <span>
                <span className="block font-pixel text-base uppercase">
                  PayHere
                </span>
                <span className="mt-2 block text-sm font-black uppercase text-[#B8A8E8]">
                  Visa / MasterCard card payments
                </span>
                <span className="mt-3 block max-w-xl text-sm font-bold leading-relaxed">
                  Orders are created on the server, then redirected to PayHere
                  with a verified checkout hash.
                </span>
              </span>
            </span>
          </label>
        </Panel>

        <button
          className="pixel-edge bg-[#F05267] px-8 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
          disabled={isSubmitting || cart.items.length === 0}
          type="submit"
        >
          {isSubmitting ? "Preparing payment..." : "Continue With PayHere ->"}
        </button>
        <p className="max-w-xl text-xs font-bold leading-relaxed text-[#10131A]/65">
          Converted using live exchange data from {rateSource}. Actual bank
          buying and selling rates may differ slightly.
        </p>
        {message ? (
          <p className="text-sm font-black uppercase text-[#F05267]">
            {message}
          </p>
        ) : null}
      </form>

      <aside className="space-y-5">
        <div className="bg-[#070B12] p-5 text-[#FFF9EF]">
          <h2 className="font-pixel text-base font-black uppercase">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                className="grid grid-cols-[1fr_auto] gap-4 bg-[#FFF9EF] p-4 text-[#10131A]"
                key={item.id}
              >
                <div>
                  <p className="font-black uppercase">{item.name}</p>
                  <p className="text-sm font-bold uppercase">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="font-black uppercase">
                  {format(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 text-sm font-black uppercase">
            <SummaryRow label="Subtotal" value={format(subtotal)} />
            <SummaryRow label="Shipping" value={format(shippingFee)} />
            <SummaryRow
              highlight
              label="Total"
              value={format(total)}
            />
          </div>
        </div>

        <div className="bg-[#B8A8E8] p-5 text-[#10131A]">
          <p className="font-pixel text-base font-black uppercase">No Restocks</p>
          <p className="mt-2 font-bold leading-relaxed">
            Orders stay pending until a verified PayHere callback marks payment
            as paid in the real checkout flow.
          </p>
        </div>
      </aside>
    </section>
  );
}

function getCallingCode(countryCode: string) {
  const callingCodes: Record<string, string> = {
    AE: "+971",
    AU: "+61",
    CA: "+1",
    DE: "+49",
    FR: "+33",
    GB: "+44",
    IN: "+91",
    IT: "+39",
    JP: "+81",
    LK: "+94",
    MY: "+60",
    NL: "+31",
    SG: "+65",
    US: "+1",
  };

  return callingCodes[countryCode] ?? "+";
}

function getInitialCountry(countries: ShippingCountry[]) {
  const fallback = countries[0] ?? {
    country_code: "US",
    currency: "USD",
    shipping_regions: [],
  };

  if (typeof navigator === "undefined") return fallback;

  const localeRegion = navigator.language.split("-")[1]?.toUpperCase();
  return countries.find((country) => country.country_code === localeRegion) ?? fallback;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-pixel text-base font-black uppercase">{title}</h2>
      <div className="border border-[#10131A]/10 bg-[#FFF9EF] p-4">{children}</div>
    </div>
  );
}

function CheckoutInput({
  label,
  name,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  onChange?: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none placeholder:text-[#10131A]/45 focus:border-[#F05267]"
        name={name}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={label}
        required={required}
        type={type}
      />
    </label>
  );
}

function submitPayHere(payload: PayHereCheckoutPayload) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payload.actionUrl;

  Object.entries(payload.fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className={highlight ? "text-2xl text-[#F05267]" : ""}>
        {value}
      </span>
    </div>
  );
}
