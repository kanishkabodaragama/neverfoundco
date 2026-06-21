"use client";

import { useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Message caught. We'll get back to you soon.");
    event.currentTarget.reset();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-black uppercase tracking-[-0.04em]">
        Send Us A Message
      </h2>
      {[
        ["fullName", "Full Name", "text"],
        ["email", "Email Address", "email"],
        ["subject", "Subject", "text"],
      ].map(([name, label, type]) => (
        <label className="block" key={name}>
          <span className="sr-only">{label}</span>
          <input
            className="min-h-12 w-full border-2 border-[#17251f] bg-transparent px-5 text-sm font-black uppercase outline-none placeholder:text-[#17251f] focus:bg-[#f0dfc4]"
            name={name}
            placeholder={label}
            required
            type={type}
          />
        </label>
      ))}
      <label className="block">
        <span className="sr-only">Your Message</span>
        <textarea
          className="min-h-36 w-full resize-none border-2 border-[#17251f] bg-transparent px-5 py-4 text-sm font-black uppercase outline-none placeholder:text-[#17251f] focus:bg-[#f0dfc4]"
          name="message"
          placeholder="Your Message"
          required
        />
      </label>
      <button
        className="bg-[#c94f2e] px-9 py-4 text-sm font-black uppercase text-[#ead8bd] transition hover:bg-[#17251f]"
        type="submit"
      >
        Send Message -&gt;
      </button>
      {message ? <p className="font-hand text-xl text-[#d9532f]">{message}</p> : null}
    </form>
  );
}

