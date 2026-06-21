import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingCountrySchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const parsed = shippingCountrySchema.parse({
    country_name: formData.get("country_name"),
    country_code: formData.get("country_code"),
    default_fee: formData.get("default_fee"),
    currency: formData.get("currency") || "LKR",
    is_active: formData.get("is_active") === "true",
  });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("shipping_countries").insert(parsed);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/settings/shipping", request.url), 303);
}
