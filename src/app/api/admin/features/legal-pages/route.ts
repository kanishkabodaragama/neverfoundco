import { requireAdminApi } from "@/lib/admin-auth";
import { adminRedirect, getFormString } from "@/lib/admin-forms";
import { updateLegalPageSettings } from "@/lib/db/site-settings";

export async function POST(request: Request) {
  const auth = await requireAdminApi(request);
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const redirectTo = "/admin/features?tab=legal-pages";

  try {
    await updateLegalPageSettings({
      businessAddress: getFormString(formData, "business_address"),
      businessName: getFormString(formData, "business_name"),
      emailAddress: getFormString(formData, "email_address"),
      phoneNumber: getFormString(formData, "phone_number"),
      returnAddress: getFormString(formData, "return_address"),
    });
  } catch (error) {
    return adminRedirect(request, redirectTo, {
      error:
        error instanceof Error
          ? error.message
          : "Legal page details could not be saved.",
    });
  }

  return adminRedirect(request, redirectTo, {
    success: "Legal page details saved.",
  });
}
