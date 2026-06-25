import { listAdminOrders } from "@/lib/db/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getReportData(from?: string, to?: string) {
  const orders = await listAdminOrders();
  const start = from ? new Date(from) : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const end = to ? new Date(to) : new Date();
  end.setHours(23, 59, 59, 999);

  const scopedOrders = orders.filter((order) => {
    const created = new Date(order.created_at);
    return created >= start && created <= end;
  });
  const supabase = getSupabaseAdminClient();
  const { data: items } = await supabase
    .from("order_items")
    .select("profit,total_price,created_at,order_id");
  const scopedOrderIds = new Set(scopedOrders.map((order) => order.id));
  const scopedItems = (items ?? []).filter((item) => scopedOrderIds.has(item.order_id));
  const sales = scopedOrders
    .filter((order) => order.payment_status === "paid")
    .reduce((total, order) => total + Number(order.total), 0);
  const profit = scopedItems.reduce((total, item) => total + Number(item.profit ?? 0), 0);

  const daily = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      sales: scopedOrders
        .filter((order) => order.created_at.startsWith(key))
        .reduce((total, order) => total + Number(order.total), 0),
    };
  });

  return {
    orders: scopedOrders,
    sales,
    profit,
    orderCount: scopedOrders.length,
    averageOrder: scopedOrders.length ? sales / scopedOrders.length : 0,
    daily,
  };
}
