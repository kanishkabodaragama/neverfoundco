import Link from "next/link";
import { AdminAlert } from "@/components/admin/admin-alert";
import { LegalPagesFeatureForm } from "@/components/admin/legal-pages-feature-form";
import { YouMayAlsoLikeFeatureManager } from "@/components/admin/you-may-also-like-feature-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/db/products";
import {
  getLegalPageSettings,
  getProductRecommendationsEnabled,
} from "@/lib/db/site-settings";
import { listAdminYouMayAlsoLikeItems } from "@/lib/db/you-may-also-like";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
    tab?: string;
  }>;
}) {
  await requireAdmin();
  const flash = await searchParams;
  const activeTab =
    flash.tab === "legal-pages" ? "legal-pages" : "you-may-also-like";
  const [products, items, recommendationsEnabled, legalSettings] =
    await Promise.all([
      listAdminProducts(),
      listAdminYouMayAlsoLikeItems(),
      getProductRecommendationsEnabled(),
      getLegalPageSettings(),
    ]);
  const activeProducts = products.filter((product) => product.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Features</h1>
        <p className="admin-muted mt-2 text-sm">
          Manage storefront features and shared legal-page information.
        </p>
      </div>

      <AdminAlert error={flash.error} success={flash.success} />

      <div className="flex gap-2 border-b border-[#ece7df]">
        <Link
          className={`border-b-2 px-4 py-3 text-sm font-semibold ${
            activeTab === "you-may-also-like"
              ? "border-[#332c26] text-[#332c26]"
              : "border-transparent text-[#81796f]"
          }`}
          href="/admin/features"
        >
          You May Also Like
        </Link>
        <Link
          className={`border-b-2 px-4 py-3 text-sm font-semibold ${
            activeTab === "legal-pages"
              ? "border-[#332c26] text-[#332c26]"
              : "border-transparent text-[#81796f]"
          }`}
          href="/admin/features?tab=legal-pages"
        >
          Legal Pages
        </Link>
      </div>

      {activeTab === "legal-pages" ? (
        <LegalPagesFeatureForm settings={legalSettings} />
      ) : (
        <YouMayAlsoLikeFeatureManager
          items={items}
          products={activeProducts}
          recommendationsEnabled={recommendationsEnabled}
        />
      )}
    </div>
  );
}
