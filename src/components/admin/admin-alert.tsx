export function AdminAlert({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;

  return (
    <div
      className={`border p-4 text-sm font-semibold ${
        error
          ? "border-[#F05267]/50 bg-[#F05267]/10 text-[#FFF9EF]"
          : "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
      }`}
    >
      {error || success}
    </div>
  );
}
