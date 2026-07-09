import type { LegalPageSettings } from "@/lib/db/site-settings";
import { formatLegalEffectiveDate } from "@/lib/db/site-settings";

export function LegalPagesFeatureForm({
  settings,
}: {
  settings: LegalPageSettings;
}) {
  return (
    <form
      action="/api/admin/features/legal-pages"
      className="space-y-6 rounded-lg border border-[#ece7df] bg-white p-6"
      method="post"
    >
      <div>
        <h2 className="text-lg font-bold">Legal Page Details</h2>
        <p className="admin-muted mt-1 text-sm">
          These values are used throughout Terms, Privacy, and Return Policy pages.
          Blank fields display a visible placeholder on the storefront.
        </p>
        <p className="admin-muted mt-2 text-xs">
          Last updated: {formatLegalEffectiveDate(settings.updatedAt)}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Business Name
          <input
            className="admin-input"
            defaultValue={settings.businessName}
            name="business_name"
            placeholder="[Insert Business Name]"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Email Address
          <input
            className="admin-input"
            defaultValue={settings.emailAddress}
            name="email_address"
            placeholder="[Insert Email Address]"
            type="email"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Mobile Number
          <input
            className="admin-input"
            defaultValue={settings.phoneNumber}
            name="phone_number"
            placeholder="[Insert Phone Number]"
            type="tel"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Business Address
          <textarea
            className="admin-input min-h-28 resize-y"
            defaultValue={settings.businessAddress}
            name="business_address"
            placeholder="[Insert Business Address]"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Return Address
          <textarea
            className="admin-input min-h-28 resize-y"
            defaultValue={settings.returnAddress}
            name="return_address"
            placeholder="[Insert Return Address]"
          />
        </label>
      </div>

      <button
        className="rounded-md bg-[#332c26] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
        type="submit"
      >
        Save Legal Details
      </button>
    </form>
  );
}
