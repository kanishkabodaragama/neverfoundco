"use client";

import { useEffect, useState, type ReactNode } from "react";

export function ScrollHeader({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const passedHeader = currentScrollY > 90;

      setHidden(scrollingDown && passedHeader);
      lastScrollY = currentScrollY;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-0 border-b border-acid bg-acid text-ink shadow-none outline-none transition-transform duration-300 ease-out after:absolute after:inset-x-0 after:-bottom-2 after:h-2 after:bg-acid after:content-[''] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {children}
    </header>
  );
}
