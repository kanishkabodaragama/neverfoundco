import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
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
  const { error } = await supabase.from("orders").update(parsed.data).eq("id", id);

  if (error) {
    return adminRedirect(request, `/admin/orders/${id}`, { error: error.message });
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
