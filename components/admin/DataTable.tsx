"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { EmptyState } from "@/components/admin/EmptyState";
import { cn } from "@/lib/utils";
import type { AdminTableColumn } from "@/lib/admin/types";

type AdminTableRow = Record<string, string | number | boolean | null | undefined>;

export function DataTable({
  columns,
  data,
  emptyDescription = "There are no matching rows for this view.",
  linkColumn,
}: {
  columns: AdminTableColumn[];
  data: AdminTableRow[];
  emptyDescription?: string;
  linkColumn?: { hrefKey: string; key: string };
}) {
  const tableColumns: Array<ColumnDef<AdminTableRow>> = columns.map((column) => ({
    accessorKey: column.key,
    cell: ({ row }) => {
      const value = row.original[column.key];
      const displayValue =
        typeof value === "boolean" ? (value ? "Yes" : "No") : value ?? "Not available";

      if (linkColumn?.key === column.key) {
        const href = row.original[linkColumn.hrefKey];
        if (typeof href === "string") {
          return (
            <Link className="font-medium text-emerald-100 underline-offset-4 hover:underline" href={href}>
              {displayValue}
            </Link>
          );
        }
      }

      return String(displayValue);
    },
    header: column.label,
  }));

  // TanStack Table intentionally returns table helpers; this local component does not pass them onward.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: tableColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) {
    return <EmptyState description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.18em] text-white/45">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap px-4 py-3 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/10">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-white/[0.04]">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "max-w-[320px] px-4 py-3 align-top text-white/70",
                      cell.column.id === "id" && "font-mono text-xs text-white/45"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
