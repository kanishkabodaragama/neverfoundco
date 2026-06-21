import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingSettingsSchema } from "@/lib/validation/admin";

export async function PATCH(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const body = request.headers
    .get("content-type")
    ?.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());
  const parsed = shippingSettingsSchema.parse(body);
  const supabase = getSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("shipping_settings")
    .select("id")
    .limit(1)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("shipping_settings").update(parsed).eq("id", existing.id)
    : await supabase.from("shipping_settings").insert(parsed);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(
    new URL("/admin/settings/shipping", request.url),
    303,
  );
}

export async function POST(request: Request) {
  return PATCH(request);
}
