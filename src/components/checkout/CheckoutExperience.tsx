"use client";

import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  formatLkr,
  mockCartItems,
} from "@/components/cart/cart-data";
import { useCart } from "@/components/store/cart-provider";
import type { ShippingCountry } from "@/lib/db/shipping";

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function CheckoutExperience({ countries }: { countries: ShippingCountry[] }) {
  const cart = useCart();
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState(countries[0]?.country_code ?? "LK");
  const [district, setDistrict] = useState("Default");

  const items = useMemo<CheckoutItem[]>(() => {
    if (cart.items.length) {
      return cart.items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
      }));
    }

    return mockCartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
  }, [cart.items]);

  const selectedCountry = countries.find((country) => country.country_code === countryCode);
  const selectedOverride = selectedCountry?.shipping_area_overrides.find(
    (override) => override.area_name === district,
  );
  const shippingFee = Number(selectedOverride?.fee ?? selectedCountry?.default_fee ?? 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const total = subtotal + shippingFee;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "PayHere is selected, but payment integration is not connected yet.",
    );
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
            <CheckoutInput label="Full Name" name="name" />
            <CheckoutInput label="Email Address" name="email" type="email" />
            <CheckoutInput label="Phone Number" name="phone" />
            <CheckoutInput label="City" name="city" />
          </div>
        </Panel>

        <Panel title="Shipping Address">
          <div className="grid gap-4">
            <CheckoutInput label="Address Line 1" name="addressLine1" />
            <CheckoutInput label="Address Line 2" name="addressLine2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Country</span>
                <select
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                  name="countryCode"
                  onChange={(event) => {
                    setCountryCode(event.target.value);
                    setDistrict("Default");
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
                  {selectedCountry?.shipping_area_overrides.map((override) => (
                    <option key={override.id} value={override.area_name}>
                      {override.area_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutInput label="City" name="city" />
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
                  This is a placeholder payment selection for now. The real
                  PayHere redirect and callback verification will be connected
                  later on the server.
                </span>
              </span>
            </span>
          </label>
        </Panel>

        <button
          className="pixel-edge bg-[#F05267] px-8 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
          type="submit"
        >
          Continue With PayHere -&gt;
        </button>
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
                  {formatLkr(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 text-sm font-black uppercase">
            <SummaryRow label="Subtotal" value={formatLkr(subtotal)} />
            <SummaryRow label="Shipping" value={formatLkr(shippingFee)} />
            <SummaryRow
              highlight
              label="Total"
              value={formatLkr(total)}
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
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none placeholder:text-[#10131A]/45 focus:border-[#F05267]"
        name={name}
        placeholder={label}
        type={type}
      />
    </label>
  );
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
