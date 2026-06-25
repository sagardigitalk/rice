"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/services/leadService";
import { useState, useEffect } from "react";
import { leadService } from "@/services/leadService";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableActions } from "@/components/common/TableActions";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);

  // Server-side state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(-1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await leadService.getAll({
        page: pageIndex + 1,
        limit: pageSize,
        search: searchQuery
      });
      setLeads(res.data || []);
      setPageCount(res.totalPages || 1);
      setTotalRecords(res.total || 0);
    } catch (error) {
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [pageIndex, pageSize, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await leadService.delete(deleteId);
      toast.success("Lead deleted successfully!");
      setLeads(leads.filter(lead => lead._id !== deleteId));
    } catch (error) {
      toast.error("Failed to delete lead");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Lead>[] = [
    { accessorKey: "contactPerson", header: "Contact Person" },
    { accessorKey: "companyName", header: "Company" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
          {row.getValue("status")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions 
          editUrl={`/leads/${row.original._id}`} 
          onDelete={() => setDeleteId(row.original._id || null)} 
          onViewQuote={row.original.quote ? () => setSelectedQuote(row.original.quote) : undefined}
        />
      )
    }
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Leads"
        description="View and manage leads."
        breadcrumbs={[{ label: "Leads" }]}
        actions={
          <Link href="/leads/add">
            <Button>Add Lead</Button>
          </Link>
        }
      />
      <div className="bg-transparent p-0 mt-6">
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={leads}
          searchPlaceholder="Search leads by name or company..."
          serverSide={true}
          pageCount={pageCount}
          totalRecords={totalRecords}
          onServerPaginationChange={(newPageIndex, newPageSize) => {
            setPageIndex(newPageIndex);
            setPageSize(newPageSize);
          }}
          onServerSearchChange={(newSearch) => {
            setSearchQuery(newSearch);
          }}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Lead"
        description="Are you sure you want to permanently delete this lead? This action cannot be undone."
        confirmText="Delete Lead"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                    <Eye size={18} />
                  </span>
                  Live Price Quote Details
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Calculated quote details for this lead</p>
              </div>
              <button 
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Summary Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 border border-slate-100 rounded-lg p-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Variety & Form</span>
                  <span className="font-semibold text-slate-750">{selectedQuote.variety} — {selectedQuote.form}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Packaging & Size</span>
                  <span className="font-semibold text-slate-750">{selectedQuote.packType} ({selectedQuote.size})</span>
                </div>
                {selectedQuote.destination && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Destination Port</span>
                    <span className="font-semibold text-slate-750">{selectedQuote.destination}</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-400 block font-medium">USD/INR Reference Rate</span>
                  <span className="font-semibold text-slate-750">{selectedQuote.rate}</span>
                </div>
              </div>

              {/* Price Breakdown Table */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3">Price Breakdown (USD/MT)</h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Cost Component</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500 uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-755">
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Ex-Mill Rate</td>
                        <td className="px-4 py-2.5 text-right font-semibold">${selectedQuote.exMillUsdPerMt}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Inland Freight</td>
                        <td className="px-4 py-2.5 text-right font-semibold">${selectedQuote.inlandUsdPerMt}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Customs & THC</td>
                        <td className="px-4 py-2.5 text-right font-semibold">${selectedQuote.customsUsdPerMt}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-medium">Packaging Cost</td>
                        <td className="px-4 py-2.5 text-right font-semibold">${selectedQuote.packagingUsdPerMt}</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold text-slate-800">
                        <td className="px-4 py-2.5">FOB Price</td>
                        <td className="px-4 py-2.5 text-right">${selectedQuote.fobUsdPerMt}</td>
                      </tr>
                      {selectedQuote.seaFreightUsdPerMt !== undefined && selectedQuote.cifUsdPerMt !== undefined && (
                        <>
                          <tr>
                            <td className="px-4 py-2.5 font-medium">Sea Freight & COC</td>
                            <td className="px-4 py-2.5 text-right font-semibold">${selectedQuote.seaFreightUsdPerMt}</td>
                          </tr>
                          <tr className="bg-emerald-50 text-emerald-800 font-bold border-t border-emerald-100">
                            <td className="px-4 py-2.5">CIF Price</td>
                            <td className="px-4 py-2.5 text-right text-base">${selectedQuote.cifUsdPerMt}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bot Message Text */}
              {selectedQuote.message && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-slate-800">Bot Message Preview</h4>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedQuote.message);
                        toast.success("Quote text copied!");
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-100 text-slate-650 border border-slate-200 rounded-md hover:bg-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy Message
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-lg max-h-48 overflow-y-auto">
                    {selectedQuote.message}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <Button onClick={() => setSelectedQuote(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
