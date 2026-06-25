import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { variantOptionSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const optionType = String(formData.get("option_type") ?? "color");
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

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("variant_options").insert(parsed.data);

  if (error) {
    return adminRedirect(request, `/admin/variants?tab=${optionType}`, { error: error.message });
  }

  return adminRedirect(request, `/admin/variants?tab=${optionType}`, {
    success: "Variant option created.",
  });
}
