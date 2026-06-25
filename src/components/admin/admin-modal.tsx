"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function AdminModal({
  children,
  title,
  trigger,
  width = "w-[min(92vw,560px)]",
}: {
  children: ReactNode;
  title: string;
  trigger: ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        {trigger}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[220] grid place-items-center bg-[#15120f]/35 px-4 py-6">
          <div className={`admin-modal-panel max-h-[86vh] overflow-auto ${width}`}>
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#ece7df] pb-3">
              <h2 className="font-semibold">{title}</h2>
              <button
                aria-label="Close popup"
                className="admin-secondary-action grid h-9 w-9 place-items-center"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
