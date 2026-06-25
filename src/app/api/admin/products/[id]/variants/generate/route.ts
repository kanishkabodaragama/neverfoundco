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
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("colors, sizes, genders, main_image_url")
    .eq("id", id)
    .single();

  if (productError || !product) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: productError?.message ?? "Product not found.",
    });
  }

  const colors = getList(product.colors);
  const sizes = getList(product.sizes);
  const genders = getList(product.genders);

  if (!colors.length || !sizes.length || !genders.length) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: "Add at least one color, size, and gender before generating variants.",
    });
  }

  const variants = genders.flatMap((gender) =>
    sizes.flatMap((size) =>
      colors.map((color) => ({
        product_id: id,
        gender,
        size,
        color,
        stock_quantity: 0,
        image_url: product.main_image_url,
      })),
    ),
  );

  const { error } = await supabase.from("product_variants").upsert(variants, {
    onConflict: "product_id,gender,size,color",
    ignoreDuplicates: true,
  });

  if (error) {
    return adminRedirect(request, `/admin/products/${id}/edit`, {
      error: error.message,
    });
  }

  return adminRedirect(request, `/admin/products/${id}/edit`, {
    success: `${variants.length} variants generated.`,
  });
}

function getList(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}
