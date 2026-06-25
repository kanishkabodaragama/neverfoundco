import { MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { AdminAlert } from "@/components/admin/admin-alert";
import { AdminModal } from "@/components/admin/admin-modal";
import { requireAdmin } from "@/lib/admin-auth";
import { listVariantOptions } from "@/lib/db/variant-options";

export const dynamic = "force-dynamic";

type VariantTab = "color" | "size" | "gender";

const tabs: { value: VariantTab; label: string }[] = [
  { value: "color", label: "Colors" },
  { value: "size", label: "Sizes" },
  { value: "gender", label: "Gender" },
];

export default async function AdminVariantsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string; success?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const activeTab = tabs.some((tab) => tab.value === params.tab)
    ? (params.tab as VariantTab)
    : "color";
  const options = await listVariantOptions();
  const activeOptions = options.filter((option) => option.option_type === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Variants</h1>
        <p className="admin-muted mt-2 text-sm">
          Create reusable colors, sizes, and gender options for product variant generation.
        </p>
      </div>
      <AdminAlert error={params.error} success={params.success} />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            className={
              tab.value === activeTab
                ? "rounded-md bg-[#332c26] px-5 py-2.5 font-semibold text-white"
                : "admin-secondary-action px-5 py-2.5"
            }
            href={`/admin/variants?tab=${tab.value}`}
            key={tab.value}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#ece7df] p-4">
          <label className="relative min-w-72 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#81796f]" />
            <input className="admin-input admin-search-input w-full" placeholder={`Search ${activeTab} options`} />
          </label>
          <AdminModal
            title={`Create ${activeTab}`}
            trigger={<span className="admin-action flex items-center gap-2 px-4 py-2.5"><Plus className="h-4 w-4" />Create {activeTab}</span>}
            width="w-[min(92vw,420px)]"
          >
            <VariantOptionForm optionType={activeTab} />
          </AdminModal>
        </div>
        <div className="overflow-x-visible">
          <table className="admin-table min-w-[760px]">
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                {activeTab === "color" ? <th>Color</th> : null}
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeOptions.map((option) => (
                <tr key={option.id}>
                  <td className="capitalize">{option.option_type}</td>
                  <td>{option.name}</td>
                  {activeTab === "color" ? (
                    <td>
                      <span className="inline-flex items-center gap-3">
                        <span
                          className="h-5 w-5 rounded-full border border-[#ece7df]"
                          style={{ backgroundColor: option.color_value ?? "#ffffff" }}
                        />
                        {option.color_value ?? "-"}
                      </span>
                    </td>
                  ) : null}
                  <td>{option.created_at ? new Date(option.created_at).toISOString().slice(0, 10) : "-"}</td>
                  <td className="text-right">
                    <details className="relative z-20 inline-block">
                      <summary className="admin-secondary-action inline-flex h-9 w-9 cursor-pointer list-none items-center justify-center marker:content-['']">
                        <MoreHorizontal className="h-4 w-4" />
                      </summary>
                      <div className="admin-menu absolute right-0 top-full z-[300] mt-2 grid w-36 p-2 text-left">
                        <AdminModal
                          title={`Edit ${activeTab}`}
                          trigger={<span className="block rounded px-3 py-2 text-sm font-semibold hover:bg-[#f6f3ef]">Edit</span>}
                          width="w-[min(92vw,420px)]"
                        >
                          <VariantOptionForm option={option} optionType={activeTab} />
                        </AdminModal>
                        <form action={`/api/admin/variant-options/${option.id}`} method="post">
                          <input name="option_type" type="hidden" value={activeTab} />
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
              {activeOptions.length === 0 ? (
                <tr>
                  <td className="admin-muted" colSpan={activeTab === "color" ? 5 : 4}>
                    No {activeTab} options yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function VariantOptionForm({
  option,
  optionType,
}: {
  option?: Awaited<ReturnType<typeof listVariantOptions>>[number];
  optionType: VariantTab;
}) {
  const action = option ? `/api/admin/variant-options/${option.id}` : "/api/admin/variant-options";

  return (
    <form action={action} className="grid gap-3" method="post">
      <input name="option_type" type="hidden" value={optionType} />
      <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
        Name
        <input className="admin-input" defaultValue={option?.name ?? ""} name="name" required />
      </label>
      {optionType === "color" ? (
        <label className="grid gap-2 text-xs font-semibold uppercase text-[#81796f]">
          Color
          <input
            className="h-11 w-24 rounded-md border border-[#ece7df] bg-white p-1"
            defaultValue={option?.color_value ?? "#111111"}
            name="color_value"
            type="color"
          />
        </label>
      ) : null}
      <div className="flex justify-between gap-2">
        <button className="admin-action flex items-center gap-2 px-3 py-2.5 text-xs" type="submit">
          <Plus className="h-4 w-4" />
          {option ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}
