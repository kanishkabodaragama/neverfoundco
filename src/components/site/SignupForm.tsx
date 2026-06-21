"use client";

import { useState } from "react";

export function SignupForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setMessage("Drop your email first.");
      return;
    }

    setMessage("You're locked in for the next drop.");
    event.currentTarget.reset();
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="drop-email">
          Email address
        </label>
        <input
          className="min-h-12 flex-1 border-2 border-[#d8bf8f] bg-transparent px-4 text-sm outline-none placeholder:text-[#d8bf8f]/70 focus:border-[#efc067]"
          id="drop-email"
          name="email"
          placeholder="Enter your email"
          type="email"
        />
        <button
          className="min-h-12 border-2 border-[#d8bf8f] bg-[#ead8bd] px-8 text-sm font-black uppercase text-[#17251f] transition hover:bg-[#efc067]"
          type="submit"
        >
          Join
        </button>
      </div>
      {message ? <p className="text-sm font-bold text-[#efc067]">{message}</p> : null}
    </form>
  );
}
