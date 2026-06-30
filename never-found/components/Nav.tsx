"use client";

import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-acid/20">
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-display text-xl tracking-tight leading-none text-acid">
            NEVER
          </span>
          <span className="font-display text-xl tracking-tight leading-none border border-acid px-1.5 py-0.5">
            FOUND
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest2 text-bone/80">
          <a href="#evidence" className="hover:text-acid transition-colors">
            Drops
          </a>
          <a href="#statement" className="hover:text-acid transition-colors">
            Manifesto
          </a>
          <a href="#status" className="hover:text-acid transition-colors">
            Status
          </a>
          <a
            href="#evidence"
            className="bg-acid text-ink px-4 py-2 font-bold hover:bg-bone transition-colors"
          >
            Shop now
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden relative w-8 h-6 flex flex-col justify-between"
        >
          <span
            className={`h-0.5 w-full bg-acid transition-transform origin-left ${
              open ? "rotate-45 translate-x-px" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-acid transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-acid transition-transform origin-left ${
              open ? "-rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col border-t border-acid/20 font-mono text-sm uppercase tracking-widest2">
          {[
            { label: "Drops", href: "#evidence" },
            { label: "Manifesto", href: "#statement" },
            { label: "Status", href: "#status" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-5 py-4 border-b border-acid/10 text-bone/80 active:text-acid active:bg-acid/5"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#evidence"
            onClick={() => setOpen(false)}
            className="px-5 py-4 bg-acid text-ink font-bold text-center"
          >
            Shop now
          </a>
        </nav>
      )}
    </header>
  );
}
