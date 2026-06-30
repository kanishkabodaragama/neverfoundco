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
      <h2 className="font-display text-3xl uppercase leading-none">
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
            className="min-h-12 w-full border border-bone/30 bg-transparent px-4 font-mono text-sm uppercase text-bone outline-none placeholder:text-bone/40 focus:border-acid"
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
          className="min-h-32 w-full resize-none border border-bone/30 bg-transparent px-4 py-4 font-mono text-sm uppercase text-bone outline-none placeholder:text-bone/40 focus:border-acid"
          name="message"
          placeholder="Your Message"
          required
        />
      </label>
      <button
        className="bg-acid px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-bone"
        type="submit"
      >
        Send Message
      </button>
      {message ? <p className="font-mono text-xs font-bold uppercase tracking-wide text-acid">{message}</p> : null}
    </form>
  );
}
