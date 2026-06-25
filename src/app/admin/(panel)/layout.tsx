import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { listAdminOrders } from "@/lib/db/admin";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const orders = await listAdminOrders();
  const newOrderCount = orders.filter((order) => order.order_status === "pending").length;

  return <AdminShell newOrderCount={newOrderCount}>{children}</AdminShell>;
}
