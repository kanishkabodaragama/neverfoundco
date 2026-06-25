import { MoreHorizontal, Plus, Tags, Trash2 } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { AdminModal } from "@/components/admin/admin-modal";
import { requireAdmin } from "@/lib/admin-auth";
import { listProductCategories, type ProductCategory } from "@/lib/db/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const [flash, categories] = await Promise.all([searchParams, listProductCategories()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="admin-muted mt-2 text-sm">
            Manage storefront product categories and display order.
          </p>
        </div>
        <AdminModal
          title="Add category"
          trigger={
            <span className="admin-action flex cursor-pointer list-none items-center gap-2 px-4 py-2.5">
            <Plus className="h-4 w-4" />
            Add category
            </span>
          }
          width="w-[min(92vw,460px)]"
        >
          <CategoryForm />
        </AdminModal>
      </div>
      <AdminAlert error={flash.error} success={flash.success} />

      <section className="admin-card">
        <div className="overflow-x-visible">
          <table className="admin-table min-w-[820px]">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <span className="inline-flex items-center gap-3 font-semibold">
                      <Tags className="h-4 w-4 text-[#a7835d]" />
                      {category.name}
                    </span>
                  </td>
                  <td>{category.slug}</td>
                  <td>{category.description || "-"}</td>
                  <td>{category.is_active ? "Active" : "Inactive"}</td>
                  <td className="text-right">
                    <details className="relative z-20 inline-block">
                      <summary className="admin-secondary-action inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center marker:content-['']">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-36 p-2 text-left">
                        <AdminModal
                          title="Edit category"
                          trigger={<span className="block rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]">Edit</span>}
                          width="w-[min(92vw,460px)]"
                        >
                          <CategoryForm category={category} />
                        </AdminModal>
                        <form action={`/api/admin/categories/${category.id}`} method="post">
                          <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50" name="_method" type="submit" value="DELETE">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {categories.length === 0 ? (
                <tr>
                  <td className="admin-muted" colSpan={5}>No categories yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function CategoryForm({ category }: { category?: ProductCategory }) {
  const action = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories";

  return (
    <form action={action} className="grid gap-3" method="post">
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Category name
        <input className="admin-input" defaultValue={category?.name ?? ""} name="name" required />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Slug
        <input className="admin-input" defaultValue={category?.slug ?? ""} name="slug" placeholder="auto-from-name" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Description
        <textarea className="admin-input min-h-24" defaultValue={category?.description ?? ""} name="description" />
      </label>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input defaultChecked={category?.is_active ?? true} name="is_active" type="checkbox" value="true" />
        Active category
      </label>
      <div className="flex justify-between gap-2">
        <button className="admin-action px-4 py-2.5 text-xs" type="submit">
          {category ? "Save category" : "Create category"}
        </button>
      </div>
    </form>
  );
}
