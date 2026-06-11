"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
  onRowClick?: (row: TData) => void;
  serverSide?: boolean;
  pageCount?: number;
  totalRecords?: number;
  onServerPaginationChange?: (pageIndex: number, pageSize: number) => void;
  onServerSearchChange?: (search: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchColumn,
  onRowClick,
  serverSide = false,
  pageCount = -1,
  totalRecords = 0,
  onServerPaginationChange,
  onServerSearchChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Debounce search for server-side filtering
  React.useEffect(() => {
    if (serverSide && onServerSearchChange) {
      const handler = setTimeout(() => {
        onServerSearchChange(globalFilter);
      }, 500); // 500ms debounce
      return () => clearTimeout(handler);
    }
  }, [globalFilter, serverSide, onServerSearchChange]);

  const table = useReactTable({
    data,
    columns,
    pageCount: serverSide ? pageCount : undefined,
    manualPagination: serverSide,
    manualFiltering: serverSide,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  React.useEffect(() => {
    if (serverSide && onServerPaginationChange) {
      onServerPaginationChange(table.getState().pagination.pageIndex, table.getState().pagination.pageSize);
    }
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, serverSide]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-md rounded-xl bg-slate-50/50 px-4 py-2 focus-within:ring-4 focus-within:ring-primary/5 focus-within:bg-white transition-all duration-300 group">
          <Search size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            placeholder={searchPlaceholder}
            value={serverSide ? globalFilter : ((table.getColumn(searchColumn || "")?.getFilterValue() as string) ?? "")}
            onChange={(event) => {
              if (serverSide) {
                setGlobalFilter(event.target.value);
                // Reset page to 0 when searching
                table.setPageIndex(0);
              } else {
                table.getColumn(searchColumn || "")?.setFilterValue(event.target.value);
              }
            }}
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-slate-400 font-medium text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-2 h-10 px-4 rounded-xl font-bold">
            <SlidersHorizontal size={16} />
            Advanced Filters
          </Button>
        </div>
      </div>

      <div className="enterprise-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-[var(--color-brand-table-border)] sticky top-0 z-10 backdrop-blur-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-14 px-6 text-[11px] font-bold text-[var(--color-brand-table-header)] uppercase tracking-[0.1em] whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group transition-all duration-200 hover:bg-[var(--color-brand-table-hover)] data-[state=selected]:bg-[var(--color-brand-primary)]/5",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-[13.5px] text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                       <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                          <Search size={24} />
                       </div>
                       <p className="text-[14px] text-slate-400 font-bold tracking-tight">No records found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-50/50 border-t border-slate-200/60 rounded-b-2xl">
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
          Page Size: 
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[13px] font-medium text-slate-700 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-[13px] font-semibold text-slate-500">
          {serverSide 
            ? `${(data || []).length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRecords)} of ${totalRecords}`
            : `${table.getFilteredRowModel().rows.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of ${table.getFilteredRowModel().rows.length}`
          }
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-500"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-500"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center justify-center px-3 h-8 rounded-lg border border-slate-200 bg-white text-[13px] font-bold text-slate-700 shadow-sm min-w-[100px]">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-500"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-500"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
