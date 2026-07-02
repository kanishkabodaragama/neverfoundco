import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { sendOrderStatusUpdatedEmails } from "@/lib/email/order-emails";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { orderStatusSchema } from "@/lib/validation/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = request.headers
    .get("content-type")
    ?.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const parsed = orderStatusSchema.safeParse(body);

  if (!parsed.success) {
    return adminRedirect(request, `/admin/orders/${id}`, {
      error: parsed.error.issues[0]?.message ?? "Invalid order status.",
    });
  }

  const supabase = getSupabaseAdminClient();
  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("orders")
    .select("order_status")
    .eq("id", id)
    .maybeSingle();

  if (existingOrderError) {
    return adminRedirect(request, `/admin/orders/${id}`, {
      error: existingOrderError.message,
    });
  }

  const { error } = await supabase.from("orders").update(parsed.data).eq("id", id);

  if (error) {
    return adminRedirect(request, `/admin/orders/${id}`, { error: error.message });
  }

  if (existingOrder?.order_status !== parsed.data.order_status) {
    await sendOrderStatusUpdatedEmails(id, parsed.data.order_status, request);
  }

  return adminRedirect(request, `/admin/orders/${id}`, {
    success: "Order status updated.",
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return PATCH(request, context);
}
