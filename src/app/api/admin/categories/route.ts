import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { productCategorySchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();
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

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("product_categories").insert({
    ...parsed.data,
    slug: slugify(parsed.data.slug),
  });

  if (error) return adminRedirect(request, "/admin/categories", { error: error.message });
  return adminRedirect(request, "/admin/categories", { success: "Category created." });
}
