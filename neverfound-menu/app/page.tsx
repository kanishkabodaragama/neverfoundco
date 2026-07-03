"use client";

import { useState } from "react";
import SlideMenu from "@/components/SlideMenu";

// Demo page. In a real app you'd trigger SlideMenu's `open` state from
// your site header's hamburger button instead of this local button.
export default function Home() {
  const [open, setOpen] = useState(true);

  return (
    <main className="min-h-screen bg-brand-black">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed left-6 top-6 z-10 font-display text-sm tracking-wide text-white"
        >
          MENU
        </button>
      )}

      <SlideMenu
        open={open}
        onClose={() => setOpen(false)}
        items={[
          { label: "HOME", href: "/", color: "lime" },
          { label: "CONTACT US", href: "/contact", color: "white" },
          { label: "ABOUT US", href: "/about", color: "lime" },
          { label: "LOGIN", href: "/login", color: "white" },
        ]}
      />
    </main>
  );
}
