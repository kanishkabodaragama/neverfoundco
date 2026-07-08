"use client";

import { useState } from "react";

export function PromoCode({
  appliedCode,
  disabled,
  isApplying,
  message,
  onApply,
  onRemove,
}: {
  appliedCode: string;
  disabled?: boolean;
  isApplying?: boolean;
  message: string;
  onApply: (code: string) => void | Promise<void>;
  onRemove: () => void;
}) {
  const [code, setCode] = useState(appliedCode);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(code);
  }

  return (
    <form
      className="grid gap-5 border border-dashed border-ink bg-transparent p-6 md:grid-cols-[1fr_1.3fr]"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-[56px_1fr] gap-4">
        <span className="font-display text-4xl leading-none text-rust">NF</span>
        <div>
          <h2 className="font-display text-2xl uppercase leading-none">Got A Code?</h2>
          <p className="mt-1 text-sm font-semibold text-ink/65">Use it before you check out.</p>
          {message ? <p className="mt-2 font-sans text-xs font-bold uppercase tracking-normal text-rust">{message}</p> : null}
          {appliedCode ? (
            <button
              className="mt-2 font-sans text-xs font-bold uppercase tracking-normal text-ink/65 underline"
              onClick={() => {
                setCode("");
                onRemove();
              }}
              type="button"
            >
              Remove {appliedCode}
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="promo-code">
          Promo Code
        </label>
        <input
          className="min-h-12 flex-1 border border-ink bg-transparent px-4 font-sans text-sm font-bold uppercase outline-none placeholder:text-ink/45 focus:border-rust"
          id="promo-code"
          name="promoCode"
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Enter promo code"
          value={code}
        />
        <button
          className="min-h-12 bg-ink px-8 font-sans text-xs font-bold uppercase tracking-normal text-acid transition hover:bg-rust hover:text-ink"
          disabled={disabled || isApplying}
          type="submit"
        >
          {isApplying ? "Applying" : "Apply"}
        </button>
      </div>
    </form>
  );
}
