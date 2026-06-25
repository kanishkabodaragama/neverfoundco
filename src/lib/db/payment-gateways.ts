import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export type PaymentGateway = Database["public"]["Tables"]["payment_gateways"]["Row"];

const fallbackGateways: PaymentGateway[] = [
  {
    id: "local-payhere",
    gateway_key: "payhere",
    name: "PayHere",
    description: "Card payments through the existing PayHere integration.",
    is_integrated: true,
    is_enabled: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "local-bank",
    gateway_key: "manual_bank",
    name: "Manual bank transfer",
    description: "Manual payment option for bank deposits.",
    is_integrated: false,
    is_enabled: false,
    created_at: "",
    updated_at: "",
  },
];

export async function listPaymentGateways() {
  if (!hasSupabaseServerEnv()) return fallbackGateways;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("payment_gateways")
    .select("*")
    .order("name", { ascending: true });

  if (error) return fallbackGateways;
  return (data ?? []) as PaymentGateway[];
}
