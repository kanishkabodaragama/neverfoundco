import type { LucideIcon } from "lucide-react";

export function AdminEmptyPage({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="admin-muted mt-2 text-sm">{description}</p>
      </div>
      <section className="admin-card flex min-h-80 flex-col items-center justify-center p-8 text-center">
        <Icon className="h-12 w-12 text-[#a7835d]" strokeWidth={1.6} />
        <h2 className="mt-5 text-xl font-semibold">{title}</h2>
        <p className="admin-muted mt-2 max-w-lg text-sm">
          This section is ready in the admin navigation. Data management can be expanded here without changing the storefront flow.
        </p>
      </section>
    </div>
  );
}
