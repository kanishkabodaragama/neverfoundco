import { adminRedirect } from "@/lib/admin-forms";
import { tryRemoveProductImageStoragePaths } from "@/lib/admin-product-media";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productVariantSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const redirectTo = String(formData.get("redirect_to") ?? "/admin/products");
  const supabase = getSupabaseAdminClient();

  if (formData.get("_method") === "DELETE") {
    const { data: variant, error: variantError } = await supabase
      .from("product_variants")
      .select("storage_path")
      .eq("id", id)
      .maybeSingle();
    if (variantError) return adminRedirect(request, redirectTo, { error: variantError.message });

    const { error } = await supabase.from("product_variants").delete().eq("id", id);
    if (error) return adminRedirect(request, redirectTo, { error: error.message });
    await tryRemoveProductImageStoragePaths([variant?.storage_path]);
    return adminRedirect(request, redirectTo, { success: "Variant deleted." });
  }

  const parsed = productVariantSchema.safeParse({
    gender: formData.get("gender"),
    size: formData.get("size"),
    color: formData.get("color"),
    stock_quantity: formData.get("stock_quantity"),
    price: formData.get("price") || null,
    sale_price: formData.get("sale_price") || null,
    unit_cost: formData.get("unit_cost") || null,
    image_url: formData.get("image_url") || null,
    storage_path: formData.get("storage_path") || null,
  });

  if (!parsed.success) {
    return adminRedirect(request, redirectTo, {
      error: parsed.error.issues[0]?.message ?? "Invalid variant.",
    });
  }

  const { error } = await supabase
    .from("product_variants")
    .update(parsed.data)
    .eq("id", id);

  if (error) return adminRedirect(request, redirectTo, { error: error.message });
  return adminRedirect(request, redirectTo, { success: "Variant saved." });
}
