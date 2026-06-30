"use client";

import Link from "next/link";

export function CartLink() {
  return (
    <Link
      className="group flex h-24 min-h-24 items-center px-0 text-ink transition-colors hover:text-rust md:h-auto md:min-h-9 md:px-3"
      href="/cart"
      aria-label="Cart"
    >
      <svg
        aria-hidden="true"
        className="h-10 w-9 md:h-5 md:w-5"
        fill="none"
        viewBox="0 0 36 44"
      >
        <path
          d="M8.5 15.5H27.5L31 39.5H5L8.5 15.5Z"
          className="stroke-current"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M12 15.5C12 8.25 15 4.5 18 4.5C21 4.5 24 8.25 24 15.5"
          className="stroke-current"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M12.5 27.5H23.5M18 22V33"
          className="stroke-current opacity-70 transition-opacity group-hover:opacity-100"
          strokeLinecap="round"
          strokeWidth="1.6"
        />
      </svg>
    </Link>
  );
}
