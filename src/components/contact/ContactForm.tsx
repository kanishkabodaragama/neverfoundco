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
      <h2 className="font-pixel text-base uppercase">
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
            className="min-h-12 w-full border border-[#FFF9EF]/20 bg-transparent px-4 text-sm font-black uppercase outline-none placeholder:text-[#FFF9EF]/50 focus:border-[#F05267]"
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
          className="min-h-32 w-full resize-none border border-[#FFF9EF]/20 bg-transparent px-4 py-4 text-sm font-black uppercase outline-none placeholder:text-[#FFF9EF]/50 focus:border-[#F05267]"
          name="message"
          placeholder="Your Message"
          required
        />
      </label>
      <button
        className="pixel-edge bg-[#F05267] px-8 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
        type="submit"
      >
        Send Message -&gt;
      </button>
      {message ? <p className="text-sm font-black uppercase text-[#F05267]">{message}</p> : null}
    </form>
  );
}
