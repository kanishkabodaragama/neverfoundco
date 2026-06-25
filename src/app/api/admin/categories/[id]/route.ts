import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { productCategorySchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const method = formData.get("_method");
  const supabase = getSupabaseAdminClient();

  if (method === "DELETE") {
    const { error } = await supabase.from("product_categories").delete().eq("id", id);
    if (error) return adminRedirect(request, "/admin/categories", { error: error.message });
    return adminRedirect(request, "/admin/categories", { success: "Category deleted." });
  }

  const name = String(formData.get("name") ?? "");
  const parsed = productCategorySchema.safeParse({
    name,
    slug: formData.get("slug") || slugify(name),
    description: formData.get("description") || null,
    display_order: formData.get("display_order") || 0,
    is_active: formData.get("is_active") === "true",
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/categories", {
      error: parsed.error.issues[0]?.message ?? "Invalid category.",
    });
  }

  const { error } = await supabase
    .from("product_categories")
    .update({ ...parsed.data, slug: slugify(parsed.data.slug) })
    .eq("id", id);

  if (error) return adminRedirect(request, "/admin/categories", { error: error.message });
  return adminRedirect(request, "/admin/categories", { success: "Category saved." });
}
