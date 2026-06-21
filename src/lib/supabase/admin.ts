import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
let adminClient: SupabaseClient<any, "public", any> | null = null;

export function getSupabaseAdminClient() {
  if (!adminClient) {
    const env = getServerEnv();

    adminClient = createClient<any>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return adminClient;
}
