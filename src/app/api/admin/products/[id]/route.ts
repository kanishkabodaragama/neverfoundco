import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { productFormSchema } from "@/lib/validation/admin";
import { slugify } from "@/lib/utils";

async function updateProduct(request: Request, id: string) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();

  if (formData.get("_method") === "DELETE") {
    return deleteProduct(request, id);
  }

  if (formData.get("_method") === "TOGGLE_ACTIVE") {
    return toggleProduct(request, id, formData.get("is_active") === "true");
  }

  const parsed = productFormSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name"))),
    short_description: formData.get("short_description") || undefined,
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    sale_price: formData.get("sale_price") || null,
    stock_quantity: formData.get("stock_quantity"),
    is_active: formData.get("is_active") === "true",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
  });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("products").update(parsed).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/products", request.url), 303);
}

async function deleteProduct(request: Request, id: string) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/products", request.url), 303);
}

async function toggleProduct(request: Request, id: string, isActive: boolean) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin/products", request.url), 303);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return updateProduct(request, id);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return updateProduct(request, id);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  return deleteProduct(request, id);
}
