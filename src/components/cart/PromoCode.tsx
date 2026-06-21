"use client";

import { useState } from "react";

export function PromoCode() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Code saved for checkout preview.");
  }

  return (
    <form
      className="grid gap-5 border border-dashed border-[#10131A]/30 bg-[#FFF9EF] p-6 md:grid-cols-[1fr_1.3fr]"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-[56px_1fr] gap-4">
        <span className="text-4xl">🏷</span>
        <div>
          <h2 className="text-lg font-black uppercase">Got A Code?</h2>
          <p className="text-sm font-bold">Use it before you check out.</p>
          {message ? <p className="mt-2 text-sm font-black uppercase text-[#F05267]">{message}</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="promo-code">
          Promo Code
        </label>
        <input
          className="min-h-12 flex-1 border-2 border-[#17251f] bg-transparent px-4 text-sm font-bold outline-none placeholder:text-[#17251f]"
          id="promo-code"
          placeholder="Enter promo code"
        />
        <button
          className="min-h-12 bg-[#070B12] px-8 text-sm font-black uppercase text-[#FFF9EF] transition hover:bg-[#F05267]"
          type="submit"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
