import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateProductRecommendationsEnabled } from "@/lib/db/site-settings";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const redirectTo = String(formData.get("redirect_to") || "/admin/settings");

  try {
    await updateProductRecommendationsEnabled(
      formData.get("product_recommendations_enabled") === "on",
    );
  } catch (error) {
    return adminRedirect(request, redirectTo, {
      error:
        error instanceof Error
          ? error.message
          : "Could not update product recommendation setting.",
    });
  }

  return adminRedirect(request, redirectTo, {
    success: "Product recommendation setting saved.",
  });
}
