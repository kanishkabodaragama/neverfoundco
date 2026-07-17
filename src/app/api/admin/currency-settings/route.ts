import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateFallbackUsdToLkrRate } from "@/lib/db/site-settings";
import { currencySettingsSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const parsed = currencySettingsSchema.safeParse({
    fallback_usd_to_lkr_rate: formData.get("fallback_usd_to_lkr_rate"),
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/settings", {
      error: parsed.error.issues[0]?.message ?? "Invalid currency settings.",
    });
  }

  try {
    await updateFallbackUsdToLkrRate(
      parsed.data.fallback_usd_to_lkr_rate,
    );
  } catch (error) {
    return adminRedirect(request, "/admin/settings", {
      error:
        error instanceof Error
          ? error.message
          : "Unable to save currency settings.",
    });
  }

  return adminRedirect(request, "/admin/settings", {
    success: "Fallback USD rate saved.",
  });
}
