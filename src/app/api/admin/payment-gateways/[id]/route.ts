import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const supabase = getSupabaseAdminClient();
  await supabase.from("payment_gateways").update({ is_enabled: false }).neq("id", id);
  const { error } = await supabase.from("payment_gateways").update({ is_enabled: true }).eq("id", id);

  if (error) return adminRedirect(request, "/admin/settings", { error: error.message });
  return adminRedirect(request, "/admin/settings", { success: "Payment gateway selected." });
}
