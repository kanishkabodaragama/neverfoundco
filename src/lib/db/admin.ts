import { hasSupabaseServerEnv } from "@/lib/env";
import { cancelExpiredPendingOrders } from "@/lib/db/orders";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type AdminOrder = Database["public"]["Tables"]["orders"]["Row"];
export type AdminOrderWithItems = AdminOrder & {
  order_items: Database["public"]["Tables"]["order_items"]["Row"][];
};

export type AdminCoupon = Database["public"]["Tables"]["coupons"]["Row"] & {
  coupon_products: { product_id: string }[];
};

export async function listAdminOrders(filters?: {
  status?: string;
  payment?: string;
  search?: string;
}) {
  if (!hasSupabaseServerEnv()) return [];

  await cancelExpiredPendingOrders();

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("order_status", filters.status);
  }

  if (filters?.payment && filters.payment !== "all") {
    query = query.eq("payment_status", filters.payment);
  }

  if (filters?.search) {
    const search = filters.search.trim();
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as AdminOrder[];
}

export async function getAdminOrder(id: string) {
  if (!hasSupabaseServerEnv()) return null;

  await cancelExpiredPendingOrders();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminOrderWithItems;
}

export async function getDashboardStats() {
  const orders = await listAdminOrders();
  const supabase = hasSupabaseServerEnv() ? getSupabaseAdminClient() : null;

  const totalSales = orders
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number(order.total), 0);
  const activeOrders = orders.filter(
    (order) => !["completed", "cancelled"].includes(order.order_status),
  ).length;

  const productCount = supabase
    ? (await supabase.from("products").select("id", { count: "exact", head: true }))
        .count ?? 0
    : 0;
  const activeCoupons = supabase
    ? (await supabase.from("coupons").select("id", { count: "exact", head: true }).eq("is_active", true))
        .count ?? 0
    : 0;

  return {
    orderCount: orders.length,
    activeOrders,
    totalSales,
    productCount,
    activeCoupons,
    recentOrders: orders.slice(0, 5),
  };
}

export async function listAdminCoupons() {
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*, coupon_products(product_id)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminCoupon[];
}

export async function getAdminCoupon(id: string) {
  if (!hasSupabaseServerEnv()) return null;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*, coupon_products(product_id)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminCoupon;
}
