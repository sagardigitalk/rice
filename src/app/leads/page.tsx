"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/leads";
import { useState, useEffect } from "react";
import { leadService } from "@/services/leadService";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableActions } from "@/components/common/TableActions";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    </AppLayout>
  );
}
