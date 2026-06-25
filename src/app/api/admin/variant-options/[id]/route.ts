import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { variantOptionSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const method = formData.get("_method");
  const optionType = String(formData.get("option_type") ?? "color");
  const supabase = getSupabaseAdminClient();

  if (method === "DELETE") {
    const { error } = await supabase.from("variant_options").delete().eq("id", id);

    if (error) return adminRedirect(request, `/admin/variants?tab=${optionType}`, { error: error.message });
    return adminRedirect(request, `/admin/variants?tab=${optionType}`, { success: "Variant option deleted." });
  }

  const parsed = variantOptionSchema.safeParse({
    option_type: optionType,
    name: formData.get("name"),
    color_value: optionType === "color" ? formData.get("color_value") : null,
  });

  if (!parsed.success) {
    return adminRedirect(request, `/admin/variants?tab=${optionType}`, {
      error: parsed.error.issues[0]?.message ?? "Invalid variant option.",
    });
  }

  const { error } = await supabase.from("variant_options").update(parsed.data).eq("id", id);

  if (error) return adminRedirect(request, `/admin/variants?tab=${optionType}`, { error: error.message });
  return adminRedirect(request, `/admin/variants?tab=${optionType}`, { success: "Variant option saved." });
}
