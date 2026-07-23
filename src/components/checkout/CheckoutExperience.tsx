"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useCart } from "@/components/store/cart-provider";
import { StorePrice } from "@/components/site/StorePrice";
import type { ShippingCountry } from "@/lib/db/shipping";
import { isUuid } from "@/lib/ids";
import type { PayHereCheckoutPayload } from "@/types/commerce";

type CheckoutItem = {
  itemKey: string;
  id: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  gender?: string;
  size?: string;
  color?: string;
};

export function CheckoutExperience({ countries }: {
  countries: ShippingCountry[];
}) {
  const cart = useCart();
  const initialCountry = getInitialCountry(countries);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectingToPayHere, setIsRedirectingToPayHere] = useState(false);
  const [billingCountryCode, setBillingCountryCode] = useState(initialCountry.country_code);
  const [billingRegion, setBillingRegion] = useState("");
  const [deliverySameAsBilling, setDeliverySameAsBilling] = useState(true);
  const [deliveryCountryCode, setDeliveryCountryCode] = useState(initialCountry.country_code);
  const [deliveryRegion, setDeliveryRegion] = useState("");
  const [phoneCode, setPhoneCode] = useState(getCallingCode(initialCountry.country_code));
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [unavailableItemKeys, setUnavailableItemKeys] = useState<string[]>([]);

  const items = useMemo<CheckoutItem[]>(() => {
    return cart.items.map((item) => ({
      itemKey: getCartItemKey(item),
      id: item.productId,
      variantId: item.variantId,
      name: item.name,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.image,
      gender: item.gender,
      size: item.size,
      color: item.color,
    }));
  }, [cart.items]);
  const unavailableItems = items.filter((item) =>
    unavailableItemKeys.includes(item.itemKey),
  );

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
    if (items.length === 0) {
      return;
    }

    const controller = new AbortController();

    fetch("/api/cart/availability", {
      body: JSON.stringify({
        items: items.map((item) => ({
          itemKey: item.itemKey,
          productId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { unavailableItemKeys?: string[] } | null) => {
        setUnavailableItemKeys(result?.unavailableItemKeys ?? []);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setUnavailableItemKeys([]);
      });

    return () => controller.abort();
  }, [items]);

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

    if (unavailableItems.length > 0) {
      setMessage("Remove unavailable items before continuing.");
      return;
    }

    if (cart.items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

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
      setIsSubmitting(false);
      return;
    }

    if (!shippingRegion || shippingFee === null) {
      setMessage("Please wait until the shipping fee is calculated.");
      setIsSubmitting(false);
      return;
    }

    const orderItems = cart.items
      .filter((item) => isUuid(item.productId))
      .map((item) => ({
        productId: item.productId,
        variantId: isUuid(item.variantId) ? item.variantId : undefined,
        gender: item.gender,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      }));

    if (orderItems.length === 0) {
      setMessage("Your cart has old items. Please re-add the current products.");
      return;
    }

    setIsSubmitting(true);

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
          items: orderItems,
        }),
      });
      const result = (await response.json()) as
        | {
            expiresAt: string;
            payhere: PayHereCheckoutPayload;
          }
        | { error: string };

      if (!response.ok || "error" in result) {
        setMessage("error" in result ? result.error : "Checkout failed.");
        setIsSubmitting(false);
        return;
      }

      cart.clearCart();
      setIsRedirectingToPayHere(true);
      await waitForSecureHandoff();
      submitPayHere(result.payhere);
    } catch {
      setMessage("Checkout failed. Please try again.");
      setIsRedirectingToPayHere(false);
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid w-full gap-8 bg-acid px-5 pb-12 pt-32 text-ink md:grid-cols-[1.1fr_0.9fr] md:px-8 md:pb-16 md:pt-32 xl:px-12">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <p className="font-sans text-[11px] font-bold uppercase tracking-normal text-rust">
            Checkout
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
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
                  className="w-full border border-ink/25 bg-transparent px-3 py-4 font-sans text-sm font-normal uppercase outline-none focus:border-rust"
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
                  className="w-full border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm font-normal uppercase outline-none placeholder:text-ink/45 focus:border-rust"
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
                  className="w-full border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm font-normal uppercase outline-none focus:border-rust"
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
                  className="w-full border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm font-normal uppercase outline-none focus:border-rust"
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
                  <p className="mt-2 text-xs font-bold uppercase text-ink/55">
                    No regions are configured for this country yet.
                  </p>
                ) : null}
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutInput label="Billing City" name="billingCity" />
              <CheckoutInput label="Billing Postal Code" name="billingPostalCode" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 border border-ink bg-transparent p-4 font-sans text-xs font-bold uppercase tracking-normal">
              <input
                checked={deliverySameAsBilling}
                className="mt-1 h-5 w-5 accent-acid"
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
                    className="w-full border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm font-normal uppercase outline-none focus:border-rust"
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
                  className="w-full border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm font-normal uppercase outline-none focus:border-rust"
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
                    <p className="mt-2 text-xs font-bold uppercase text-ink/55">
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

        <Panel bordered={false} title="Payment Option">
          <label className="flex w-fit cursor-pointer items-center gap-4">
            <input
              className="h-5 w-5 accent-rust"
              defaultChecked
              name="payment"
              type="radio"
              value="payhere"
            />
            <Image
              alt="PayHere"
              className="h-auto w-[150px]"
              height={252}
              sizes="150px"
              src="/images/payments/payhere-square-banner-dark.png"
              width={494}
            />
          </label>
        </Panel>

        <button
          className="bg-ink px-8 py-4 font-sans text-xs font-bold uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink"
          disabled={isSubmitting || cart.items.length === 0}
          type="submit"
        >
          {isSubmitting ? "Preparing payment..." : "Pay now"}
        </button>
        {message ? (
          <p className="font-sans text-xs font-bold uppercase tracking-normal text-rust">
            {message}
          </p>
        ) : null}
      </form>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="border border-ink p-5 text-ink">
          <h2 className="font-display text-3xl uppercase leading-none">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                className="grid grid-cols-[1fr_auto] gap-4 border border-ink/20 p-4 text-ink"
                key={item.id}
              >
                <div>
                  <p className="font-black uppercase">{item.name}</p>
                  <p className="text-sm font-bold uppercase">
                    Qty {item.quantity}
                  </p>
                </div>
                <StorePrice
                  amountLkr={item.price * item.quantity}
                  className="items-end text-right uppercase"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3 font-sans text-sm font-bold uppercase">
            <SummaryRow label="Subtotal" value={<StorePrice amountLkr={subtotal} />} />
            {appliedDiscount > 0 ? (
              <SummaryRow
                label={`Discount ${cart.couponCode ? `(${cart.couponCode})` : ""}`}
                value={<span className="flex items-start">-<StorePrice amountLkr={appliedDiscount} /></span>}
              />
            ) : null}
            <SummaryRow
              label="Shipping"
              value={
                !shippingRegion
                  ? "Select region"
                  : visibleShippingFee === null
                    ? "Calculating..."
                    : <StorePrice amountLkr={visibleShippingFee} />
              }
            />
            <SummaryRow
              highlight
              label="Total"
              value={<StorePrice amountLkr={total} />}
            />
          </div>
          <p className="mt-4 text-xs font-bold leading-relaxed text-ink/65">
            Checkout totals and payment are always calculated and charged in LKR.
          </p>
        </div>
      </aside>
      {unavailableItems.length > 0 ? (
        <div
          aria-labelledby="out-of-stock-title"
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink/80 p-4"
          role="dialog"
        >
          <div className="w-full max-w-2xl border-2 border-ink bg-acid p-5 text-ink shadow-[10px_10px_0_#d9532f] md:p-7">
            <p className="font-sans text-[11px] font-black uppercase tracking-normal text-rust">
              Checkout update
            </p>
            <h2
              className="mt-2 font-display text-4xl uppercase leading-none md:text-6xl"
              id="out-of-stock-title"
            >
              Out of stock
            </h2>
            <p className="mt-3 max-w-xl font-sans text-sm font-bold uppercase leading-relaxed">
              These pieces are no longer available in the selected options.
            </p>
            <div className="mt-6 max-h-[46vh] space-y-3 overflow-y-auto">
              {unavailableItems.map((item) => (
                <article
                  className="grid grid-cols-[100px_1fr] border border-ink bg-transparent sm:grid-cols-[130px_1fr]"
                  key={item.itemKey}
                >
                  <div className="relative min-h-[120px]">
                    <Image
                      alt={item.name}
                      className="object-contain p-3"
                      fill
                      sizes="130px"
                      src={item.image ?? "/images/products/black-heavyweight-tee.png"}
                    />
                  </div>
                  <div className="flex flex-col justify-center border-l border-ink p-4">
                    <h3 className="font-display text-2xl uppercase leading-none">
                      {item.name}
                    </h3>
                    <p className="mt-2 font-sans text-xs font-bold uppercase text-ink/65">
                      {[item.gender, item.color, item.size]
                        .filter(Boolean)
                        .join(" / ") || "Default option"}
                    </p>
                    <p className="mt-1 font-sans text-xs font-bold uppercase text-rust">
                      Qty {item.quantity} · Out of stock
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="bg-ink px-5 py-4 font-sans text-xs font-black uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink"
                onClick={() => {
                  unavailableItems.forEach((item) => cart.removeItem(item.itemKey));
                  setUnavailableItemKeys([]);
                }}
                type="button"
              >
                Remove {unavailableItems.length > 1 ? "items" : "item"} & continue
              </button>
              <Link
                className="border border-ink px-5 py-4 text-center font-sans text-xs font-black uppercase tracking-normal transition-colors hover:bg-ink hover:text-acid"
                href="/"
              >
                Back to shop
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      {isSubmitting ? (
        <div
          aria-live="polite"
          aria-modal="true"
          className="fixed inset-0 z-[110] grid place-items-center bg-ink/90 p-5"
          role="dialog"
        >
          <div className="w-full max-w-md border-2 border-ink bg-acid p-7 text-center text-ink shadow-[10px_10px_0_#d9532f]">
            <div
              aria-hidden="true"
              className="mx-auto h-14 w-14 animate-spin rounded-full border-[5px] border-ink/20 border-t-rust"
            />
            <p className="mt-6 font-sans text-[11px] font-black uppercase tracking-normal text-rust">
              Secure payment
            </p>
            <h2 className="mt-2 font-display text-4xl uppercase leading-none">
              {isRedirectingToPayHere
                ? "Taking you to PayHere"
                : "Securing your order"}
            </h2>
            <p className="mt-4 font-sans text-sm font-bold uppercase leading-relaxed text-ink/65">
              {isRedirectingToPayHere
                ? "Secure connection ready. Please wait while PayHere opens."
                : "We’re validating your items and preparing an encrypted payment handoff."}
            </p>
          </div>
        </div>
      ) : null}
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
    currency: "LKR",
    shipping_regions: [],
  };

  if (typeof navigator === "undefined") return fallback;

  const localeRegion = navigator.language.split("-")[1]?.toUpperCase();
  return countries.find((country) => country.country_code === localeRegion) ?? fallback;
}

function getFormValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getCartItemKey(item: {
  productId: string;
  variantId?: string;
  gender?: string;
  size?: string;
  color?: string;
}) {
  return (
    item.variantId ??
    [item.productId, item.gender, item.size, item.color]
      .filter(Boolean)
      .join(":")
  );
}

function Panel({
  bordered = true,
  title,
  children,
}: {
  bordered?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-3xl uppercase leading-none">{title}</h2>
      <div className={bordered ? "border border-ink bg-transparent p-4" : ""}>
        {children}
      </div>
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
        className="w-full border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm font-normal uppercase outline-none placeholder:text-ink/45 focus:border-rust"
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

function waitForSecureHandoff() {
  return new Promise((resolve) => window.setTimeout(resolve, 900));
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className={highlight ? "text-2xl text-rust" : ""}>
        {value}
      </span>
    </div>
  );
}
