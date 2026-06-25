"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [billingCountryCode, setBillingCountryCode] = useState(initialCountry.country_code);
  const [billingRegion, setBillingRegion] = useState("");
  const [deliverySameAsBilling, setDeliverySameAsBilling] = useState(true);
  const [deliveryCountryCode, setDeliveryCountryCode] = useState(initialCountry.country_code);
  const [deliveryRegion, setDeliveryRegion] = useState("");
  const [phoneCode, setPhoneCode] = useState(getCallingCode(initialCountry.country_code));
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const items = useMemo<CheckoutItem[]>(() => {
    return cart.items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
    }));
  }, [cart.items]);

  const billingCountry = countries.find((country) => country.country_code === billingCountryCode);
  const deliveryCountry = countries.find((country) => country.country_code === deliveryCountryCode);
  const billingRegions = billingCountry?.shipping_regions ?? [];
  const deliveryRegions = deliveryCountry?.shipping_regions ?? [];
  const shippingCountryCode = deliverySameAsBilling
    ? billingCountryCode
    : deliveryCountryCode;
  const shippingRegion = deliverySameAsBilling ? billingRegion : deliveryRegion;
  const visibleShippingFee = shippingRegion ? shippingFee : null;
  const shippingForTotal = visibleShippingFee ?? 0;
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const appliedDiscount = cart.couponCode ? discountAmount : 0;
  const total = Math.max(0, subtotal - appliedDiscount) + shippingForTotal;

  useEffect(() => {
    if (!shippingRegion) {
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      countryCode: shippingCountryCode,
      district: shippingRegion,
    });

    fetch(`/api/shipping/quote?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { shippingFee?: number } | null) => {
        if (typeof result?.shippingFee === "number") {
          setShippingFee(result.shippingFee);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setShippingFee(null);
      });

    return () => controller.abort();
  }, [shippingCountryCode, shippingRegion]);

  useEffect(() => {
    if (!cart.couponCode || cart.items.length === 0) {
      return;
    }

    const controller = new AbortController();

    fetch("/api/cart/coupon", {
      body: JSON.stringify({
        couponCode: cart.couponCode,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { discountAmount?: number } | null) => {
        setDiscountAmount(Number(result?.discountAmount ?? 0));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setDiscountAmount(0);
      });

    return () => controller.abort();
  }, [cart.couponCode, cart.items]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (cart.items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const firstName = getFormValue(formData, "firstName");
    const lastName = getFormValue(formData, "lastName");
    const customerEmail = getFormValue(formData, "customerEmail");
    const customerPhone = getFormValue(formData, "customerPhone");
    const billingAddressLine1 = getFormValue(formData, "billingAddressLine1");
    const billingAddressLine2 = getFormValue(formData, "billingAddressLine2");
    const billingCity = getFormValue(formData, "billingCity");
    const billingPostalCode = getFormValue(formData, "billingPostalCode");
    const deliveryAddressLine1 = getFormValue(formData, "deliveryAddressLine1");
    const deliveryAddressLine2 = getFormValue(formData, "deliveryAddressLine2");
    const deliveryCity = getFormValue(formData, "deliveryCity");
    const deliveryPostalCode = getFormValue(formData, "deliveryPostalCode");
    const addressLine1 = deliverySameAsBilling
      ? billingAddressLine1
      : deliveryAddressLine1;
    const addressLine2 = deliverySameAsBilling
      ? billingAddressLine2
      : deliveryAddressLine2;
    const city = deliverySameAsBilling ? billingCity : deliveryCity;
    const postalCode = deliverySameAsBilling
      ? billingPostalCode
      : deliveryPostalCode;
    const missingFields = [
      [firstName, "First name"],
      [lastName, "Last name"],
      [customerEmail, "Email"],
      [customerPhone, "Phone"],
      [billingCountryCode, "Billing country"],
      [billingRegion, "Billing region"],
      [billingAddressLine1, "Billing address"],
      [billingCity, "Billing city"],
      ...(!deliverySameAsBilling
        ? [
            [deliveryCountryCode, "Delivery country"],
            [deliveryRegion, "Delivery region"],
            [deliveryAddressLine1, "Delivery address"],
            [deliveryCity, "Delivery city"],
          ]
        : []),
    ].filter(([value]) => !value);

    if (missingFields.length > 0) {
      setMessage(
        `Please complete: ${missingFields
          .map(([, label]) => label)
          .join(", ")}.`,
      );
      return;
    }

    if (!shippingRegion || shippingFee === null) {
      setMessage("Please wait until the shipping fee is calculated.");
      return;
    }

    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: `${firstName} ${lastName}`,
          customerEmail,
          customerPhone: `${phoneCode} ${customerPhone}`.trim(),
          addressLine1,
          addressLine2,
          countryCode: shippingCountryCode,
          city,
          district: shippingRegion,
          postalCode,
          couponCode: cart.couponCode || undefined,
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
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
            <CheckoutInput label="First Name" name="firstName" />
            <CheckoutInput label="Last Name" name="lastName" />
            <CheckoutInput label="Email Address" name="customerEmail" type="email" />
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
                  type="tel"
                />
              </span>
            </label>
          </div>
        </Panel>

        <Panel title="Billing Address">
          <div className="grid gap-4">
            <CheckoutInput label="Billing Address Line 1" name="billingAddressLine1" />
            <CheckoutInput label="Billing Address Line 2" name="billingAddressLine2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Billing Country</span>
                <select
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                  onChange={(event) => {
                    setBillingCountryCode(event.target.value);
                    setPhoneCode(getCallingCode(event.target.value));
                    setBillingRegion("");
                    setShippingFee(null);
                  }}
                  value={billingCountryCode}
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.country_code}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Billing Region</span>
                <select
                  className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                  onChange={(event) => {
                    setBillingRegion(event.target.value);
                    setShippingFee(null);
                  }}
                  value={billingRegion}
                >
                  <option value="">Select region</option>
                  {billingRegions.map((region) => (
                    <option key={region.id} value={region.region_name}>
                      {region.region_name}
                    </option>
                  ))}
                </select>
                {billingRegions.length === 0 ? (
                  <p className="mt-2 text-xs font-bold uppercase text-[#10131A]/55">
                    No regions are configured for this country yet.
                  </p>
                ) : null}
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutInput label="Billing City" name="billingCity" />
              <CheckoutInput label="Billing Postal Code" name="billingPostalCode" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 border border-[#10131A]/10 bg-[#F7F1E6] p-4 text-sm font-black uppercase">
              <input
                checked={deliverySameAsBilling}
                className="mt-1 h-5 w-5 accent-[#F05267]"
                onChange={(event) => {
                  setDeliverySameAsBilling(event.target.checked);
                  setDeliveryCountryCode(billingCountryCode);
                  setDeliveryRegion("");
                  setShippingFee(null);
                }}
                type="checkbox"
              />
              <span>Billing address and delivery address are the same</span>
            </label>
          </div>
        </Panel>

        {!deliverySameAsBilling ? (
          <Panel title="Delivery Address">
            <div className="grid gap-4">
              <CheckoutInput label="Delivery Address Line 1" name="deliveryAddressLine1" />
              <CheckoutInput label="Delivery Address Line 2" name="deliveryAddressLine2" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="sr-only">Delivery Country</span>
                  <select
                    className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                    onChange={(event) => {
                      setDeliveryCountryCode(event.target.value);
                      setDeliveryRegion("");
                      setShippingFee(null);
                    }}
                    value={deliveryCountryCode}
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.country_code}>
                        {country.country_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="sr-only">Delivery Region</span>
                  <select
                    className="w-full border border-[#10131A]/15 bg-[#FFF9EF] px-4 py-4 text-sm font-black uppercase outline-none focus:border-[#F05267]"
                    onChange={(event) => {
                      setDeliveryRegion(event.target.value);
                      setShippingFee(null);
                    }}
                    value={deliveryRegion}
                  >
                    <option value="">Select region</option>
                    {deliveryRegions.map((region) => (
                      <option key={region.id} value={region.region_name}>
                        {region.region_name}
                      </option>
                    ))}
                  </select>
                  {deliveryRegions.length === 0 ? (
                    <p className="mt-2 text-xs font-bold uppercase text-[#10131A]/55">
                      No regions are configured for this country yet.
                    </p>
                  ) : null}
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <CheckoutInput label="Delivery City" name="deliveryCity" />
                <CheckoutInput label="Delivery Postal Code" name="deliveryPostalCode" />
              </div>
            </div>
          </Panel>
        ) : null}

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
        {message ? (
          <p className="text-sm font-black uppercase text-[#F05267]">
            {message}
          </p>
        ) : null}
      </form>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
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
            {appliedDiscount > 0 ? (
              <SummaryRow
                label={`Discount ${cart.couponCode ? `(${cart.couponCode})` : ""}`}
                value={`-${format(appliedDiscount)}`}
              />
            ) : null}
            <SummaryRow
              label="Shipping"
              value={
                !shippingRegion
                  ? "Select region"
                  : visibleShippingFee === null
                    ? "Calculating..."
                    : format(visibleShippingFee)
              }
            />
            <SummaryRow
              highlight
              label="Total"
              value={format(total)}
            />
          </div>
          <p className="mt-4 border-t border-[#FFF9EF]/15 pt-4 text-xs font-bold leading-relaxed text-[#FFF9EF]/65">
            Converted using live exchange data from {rateSource}. Actual bank
            buying and selling rates may differ slightly.
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

function getFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
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
  type = "text",
}: {
  label: string;
  name: string;
  onChange?: (value: string) => void;
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
