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
            className="min-h-12 w-full border border-ink/25 bg-transparent px-4 font-sans text-sm uppercase text-ink outline-none placeholder:text-ink/45 focus:border-rust"
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
          className="min-h-32 w-full resize-none border border-ink/25 bg-transparent px-4 py-4 font-sans text-sm uppercase text-ink outline-none placeholder:text-ink/45 focus:border-rust"
          name="message"
          placeholder="Your Message"
          required
        />
      </label>
      <button
        className="bg-ink px-8 py-4 font-sans text-xs font-bold uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink"
        type="submit"
      >
        Send Message
      </button>
      {message ? <p className="font-sans text-xs font-bold uppercase tracking-normal text-rust">{message}</p> : null}
    </form>
  );
}
