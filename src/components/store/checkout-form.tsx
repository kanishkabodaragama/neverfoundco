"use client";

import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";
import type { PayHereCheckoutPayload } from "@/types/commerce";

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

export function CheckoutForm() {
  const cart = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subtotal = cart.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        customerEmail: formData.get("customerEmail"),
        customerPhone: formData.get("customerPhone"),
        addressLine1: formData.get("addressLine1"),
        addressLine2: formData.get("addressLine2"),
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
  }

  if (cart.items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="border p-4">
        <p className="font-medium">Cart subtotal</p>
        <p>{formatCurrency(subtotal)}</p>
      </div>
      {[
        ["customerName", "Customer name"],
        ["customerEmail", "Email"],
        ["customerPhone", "Phone"],
        ["addressLine1", "Address line 1"],
        ["addressLine2", "Address line 2"],
        ["city", "City"],
        ["district", "District"],
        ["postalCode", "Postal code"],
      ].map(([name, label]) => (
        <label className="grid gap-2" key={name}>
          <span>{label}</span>
          <input
            className="border px-3 py-2"
            name={name}
            required={!["addressLine2", "postalCode"].includes(name)}
            type={name === "customerEmail" ? "email" : "text"}
          />
        </label>
      ))}
      {message ? <p className="text-sm">{message}</p> : null}
      <button
        className="border border-foreground px-4 py-2 font-medium"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Preparing payment..." : "Pay with PayHere"}
      </button>
    </form>
  );
}

