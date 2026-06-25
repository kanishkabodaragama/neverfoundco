"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { LogOut, Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminShell({
  children,
  newOrderCount = 0,
}: {
  children: ReactNode;
  newOrderCount?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("neverfound-admin-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("neverfound-admin-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={`admin-panel min-h-screen bg-[#fbfaf8] text-[#332c26] ${dark ? "dark bg-[#151311] text-[#f8f4ee]" : ""}`}>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-[#ece7df] bg-white transition-all lg:block ${
          collapsed ? "w-20" : "w-72"
        } ${dark ? "border-white/10 bg-[#1d1a17]" : ""}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#ece7df] px-4">
          {collapsed ? null : (
            <Link className="text-base font-semibold tracking-tight" href="/admin">
              Never Found Admin
            </Link>
          )}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="admin-secondary-action flex h-9 w-9 items-center justify-center"
            onClick={() => setCollapsed((value) => !value)}
            type="button"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <div className="px-3 py-5">
          <AdminNav collapsed={collapsed} newOrderCount={newOrderCount} />
        </div>
      </aside>

      {mobileOpen ? (
        <button
          aria-label="Close mobile navigation"
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-[#ece7df] bg-white p-3 transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-12 items-center justify-between px-1">
          <Link className="text-base font-semibold" href="/admin">Never Found Admin</Link>
          <button className="admin-secondary-action h-9 w-9" onClick={() => setMobileOpen(false)} type="button">
            <PanelLeftClose className="mx-auto h-4 w-4" />
          </button>
        </div>
        <AdminNav newOrderCount={newOrderCount} />
      </aside>

      <div className={`${collapsed ? "lg:pl-20" : "lg:pl-72"} transition-all`}>
        <header className={`admin-topbar sticky top-0 z-20 border-b border-[#ece7df] bg-white/95 backdrop-blur ${dark ? "border-white/10 bg-[#1d1a17]/95" : ""}`}>
          <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open sidebar"
                className="admin-secondary-action flex h-9 w-9 items-center justify-center lg:hidden"
                onClick={() => setMobileOpen(true)}
                type="button"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
              <Link className="text-sm font-semibold text-[#81796f]" href="/">
                View store
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label={dark ? "Use light mode" : "Use dark mode"}
                className="admin-secondary-action flex h-9 w-9 items-center justify-center"
                onClick={() => setDark((value) => !value)}
                type="button"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <form action="/api/admin/logout" method="post">
                <button
                  aria-label="Logout"
                  className="admin-secondary-action flex h-9 w-9 items-center justify-center"
                  type="submit"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="px-5 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
