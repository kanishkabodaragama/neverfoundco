"use client";

import { Download } from "lucide-react";

type CsvColumn = {
  key: string;
  label: string;
};

type CsvRow = Record<string, string | number | null | undefined>;

export function CsvDownloadButton({
  columns,
  filename,
  meta = [],
  rows,
  title,
}: {
  columns: CsvColumn[];
  filename: string;
  meta?: string[];
  rows: CsvRow[];
  title: string;
}) {
  function downloadCsv() {
    const lines = [
      [title],
      [`Generated at ${new Date().toLocaleString()}`],
      ...meta.map((line) => [line]),
      [],
      columns.map((column) => column.label),
      ...rows.map((row) =>
        columns.map((column) => row[column.key] ?? ""),
      ),
    ];
    const csv = lines.map((line) => line.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      className="admin-secondary-action flex items-center gap-2 px-3 py-2.5"
      onClick={downloadCsv}
      type="button"
    >
      <Download className="h-4 w-4" />
      Download
    </button>
  );
}

function escapeCsvValue(value: string | number | null | undefined) {
  const text = String(value ?? "");

  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }

  return text;
}
