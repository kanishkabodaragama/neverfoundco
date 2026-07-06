"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Images,
  LayoutDashboard,
  Percent,
  Settings,
  SlidersHorizontal,
  Tags,
  Truck,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Products", href: "/admin/products", icon: Boxes },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Variants", href: "/admin/variants", icon: SlidersHorizontal },
  { label: "Coupons", href: "/admin/coupons", icon: Percent },
  { label: "Shipping", href: "/admin/settings/shipping", icon: Truck },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({
  collapsed = false,
  newOrderCount = 0,
}: {
  collapsed?: boolean;
  newOrderCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {navItems.map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.875rem] transition ${
              active
                ? "bg-[#f0ede8] font-semibold text-[#332c26] dark:bg-[#2b241e] dark:text-[#f8f4ee]"
                : "text-[#81796f] hover:bg-[#f6f3ef] hover:text-[#332c26] dark:text-[#b9afa4] dark:hover:bg-[#26221e] dark:hover:text-[#f8f4ee]"
            }`}
            href={href}
            key={href}
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            {collapsed ? <span className="sr-only">{label}</span> : <span className="flex-1">{label}</span>}
            {label === "Orders" && newOrderCount > 0 ? (
              <span
                aria-label={`${newOrderCount} active orders`}
                className="ml-auto rounded-full bg-[#f05267] px-2 py-0.5 text-[0.65rem] font-bold leading-none text-white"
              >
                {newOrderCount > 99 ? "99+" : newOrderCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
