"use client";

import Image from "next/image";
import type React from "react";
import { Eye, ImageUp, X } from "lucide-react";

type UploadPreview = {
  id: string;
  url: string;
  name: string;
  progress: number;
  complete: boolean;
};

export function UploadThumb({
  item,
  onRemove,
  size = 72,
}: {
  item: UploadPreview;
  onRemove?: () => void;
  size?: number;
}) {
  const ring = item.complete
    ? "transparent"
    : `conic-gradient(#a7835d ${item.progress * 3.6}deg, #ede7df 0deg)`;

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-md p-1"
      style={{ background: ring, height: size + 8, width: size + 8 }}
    >
      <span className="relative block overflow-hidden rounded-md bg-[#f7f3ed]" style={{ height: size, width: size }}>
        <Image alt={item.name} className="object-cover" fill sizes={`${size}px`} src={item.url} unoptimized />
        {item.complete ? (
          <a
            aria-label={`Quick view ${item.name}`}
            className="absolute inset-0 grid place-items-center bg-[#111]/0 text-white opacity-0 transition hover:bg-[#111]/35 hover:opacity-100"
            href={item.url}
            rel="noreferrer"
            target="_blank"
          >
            <Eye className="h-5 w-5" />
          </a>
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-white/60 text-xs font-semibold text-[#332c26]">
            {item.progress}%
          </span>
        )}
      </span>
      {onRemove ? (
        <button
          aria-label={`Remove ${item.name}`}
          className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-md border border-[#ece7df] bg-white text-[#332c26] shadow-sm hover:text-red-500"
          onClick={onRemove}
          type="button"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

export function UploadButton({
  children = "Upload",
  disabled,
  inputRef,
  multiple,
  name,
  onChange,
}: {
  children?: React.ReactNode;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  multiple?: boolean;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      className={`admin-secondary-action inline-flex w-fit items-center gap-2 px-3 py-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <ImageUp className="h-4 w-4" />
      {children}
      <input
        ref={inputRef}
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        multiple={multiple}
        name={name}
        onChange={onChange}
        type="file"
      />
    </label>
  );
}

export type { UploadPreview };
