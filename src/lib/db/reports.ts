import { listAdminOrders } from "@/lib/db/admin";
import { COLOMBO_TIME_ZONE, formatColomboDateKey } from "@/lib/date-time";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getReportData(from?: string, to?: string) {
  const orders = await listAdminOrders();
  const start = from ? getColomboDayStart(from) : new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const end = to ? getColomboDayEnd(to) : new Date();

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
  const days = getDaysBetween(start, end);

  const daily = days.map((date) => {
    const key = formatColomboDateKey(date);
    return {
      key,
      label: new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        timeZone: COLOMBO_TIME_ZONE,
      }).format(date),
      sales: scopedOrders
        .filter((order) => formatColomboDateKey(order.created_at) === key)
        .reduce((total, order) => total + Number(order.total), 0),
      profit: scopedItems
        .filter((item) => item.created_at && formatColomboDateKey(item.created_at) === key)
        .reduce((total, item) => total + Number(item.profit ?? 0), 0),
      orders: scopedOrders.filter((order) => formatColomboDateKey(order.created_at) === key).length,
    };
  });

  return {
    orders: scopedOrders,
    items: scopedItems,
    sales,
    profit,
    orderCount: scopedOrders.length,
    averageOrder: scopedOrders.length ? sales / scopedOrders.length : 0,
    daily,
    start: formatColomboDateKey(start),
    end: formatColomboDateKey(end),
  };
}

function getColomboDayStart(value: string) {
  return new Date(`${value}T00:00:00+05:30`);
}

function getColomboDayEnd(value: string) {
  return new Date(`${value}T23:59:59.999+05:30`);
}

function getDaysBetween(start: Date, end: Date) {
  const days: Date[] = [];
  const current = new Date(start);

  while (current <= end && days.length < 370) {
    days.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return days;
}
