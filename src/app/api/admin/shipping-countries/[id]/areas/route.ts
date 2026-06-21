import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingAreaOverrideSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const parsed = shippingAreaOverrideSchema.parse({
    area_name: formData.get("area_name"),
    fee: formData.get("fee"),
  });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("shipping_area_overrides").insert({
    country_id: id,
    area_name: parsed.area_name,
    fee: parsed.fee,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/settings/shipping", request.url), 303);
}
