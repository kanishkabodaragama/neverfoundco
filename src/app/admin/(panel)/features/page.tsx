import { AdminAlert } from "@/components/admin/admin-alert";
import { YouMayAlsoLikeFeatureManager } from "@/components/admin/you-may-also-like-feature-form";
import { requireAdmin } from "@/lib/admin-auth";
import { listAdminProducts } from "@/lib/db/products";
import { getProductRecommendationsEnabled } from "@/lib/db/site-settings";
import { listAdminYouMayAlsoLikeItems } from "@/lib/db/you-may-also-like";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [flash, products, items, recommendationsEnabled] = await Promise.all([
    searchParams,
    listAdminProducts(),
    listAdminYouMayAlsoLikeItems(),
    getProductRecommendationsEnabled(),
  ]);
  const activeProducts = products.filter((product) => product.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Features</h1>
        <p className="admin-muted mt-2 text-sm">
          Manage storefront feature sections. The active tab is You May Also Like.
        </p>
      </div>

      <AdminAlert error={flash.error} success={flash.success} />

      <div className="flex gap-2 border-b border-[#ece7df]">
        <button
          className="border-b-2 border-[#332c26] px-4 py-3 text-sm font-semibold"
          type="button"
        >
          You May Also Like
        </button>
      </div>

      <YouMayAlsoLikeFeatureManager
        items={items}
        products={activeProducts}
        recommendationsEnabled={recommendationsEnabled}
      />
    </div>
  );
}
