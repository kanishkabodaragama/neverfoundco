import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateCheckoutPaymentTimeoutMinutes } from "@/lib/db/site-settings";
import { checkoutSettingsSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const parsed = checkoutSettingsSchema.safeParse({
    checkout_payment_timeout_minutes: formData.get(
      "checkout_payment_timeout_minutes",
    ),
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/settings", {
      error: parsed.error.issues[0]?.message ?? "Invalid checkout settings.",
    });
  }

  try {
    await updateCheckoutPaymentTimeoutMinutes(
      parsed.data.checkout_payment_timeout_minutes,
    );
  } catch (error) {
    return adminRedirect(request, "/admin/settings", {
      error:
        error instanceof Error
          ? error.message
          : "Unable to save checkout settings.",
    });
  }

  return adminRedirect(request, "/admin/settings", {
    success: "Checkout settings saved.",
  });
}
