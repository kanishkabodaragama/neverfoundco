import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  ["Dashboard", "/admin"],
  ["Orders", "/admin/orders"],
  ["Products", "/admin/products"],
  ["Coupons", "/admin/coupons"],
  ["Shipping", "/admin/settings/shipping"],
];

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-panel min-h-screen bg-background text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link className="text-lg font-semibold tracking-tight" href="/admin">
            Never Found Admin
          </Link>
          <nav className="flex flex-wrap gap-2">
            {navItems.map(([label, href]) => (
              <Button key={href} size="sm" variant="ghost">
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-6">{children}</main>
    </div>
  );
}
