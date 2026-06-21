import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type AdminUser = Pick<
  Database["public"]["Tables"]["admin_users"]["Row"],
  "id" | "email" | "role"
>;

export async function getCurrentAdmin() {
  if (!hasSupabasePublicEnv()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();
  const admin = data as AdminUser | null;

  if (!admin) return null;

  return {
    user,
    admin,
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireAdminApi() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      admin: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    admin,
    response: null,
  };
}
