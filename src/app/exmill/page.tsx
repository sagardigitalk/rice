"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { exmillService, ExMill } from "@/services/exmillService";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableActions } from "@/components/common/TableActions";
import toast from "react-hot-toast";

export default function ExMillPage() {
  const [data, setData] = useState<ExMill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Server-side state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(-1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchExmills = async () => {
    try {
      setIsLoading(true);
      const res = await exmillService.getAll({
        page: pageIndex + 1, // backend uses 1-based indexing
        limit: pageSize,
        search: searchQuery
      });
      setData(res.data || []);
      setPageCount(res.totalPages || 1);
      setTotalRecords(res.total || 0);
    } catch (error) {
      toast.error("Failed to load ExMill rates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExmills();
  }, [pageIndex, pageSize, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await exmillService.delete(deleteId);
      toast.success("ExMill rate deleted successfully!");
      setData(data.filter(item => item._id !== deleteId));
    } catch (error) {
      toast.error("Failed to delete ExMill rate");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<ExMill>[] = [
    { accessorKey: "variety", header: "Variety" },
    { accessorKey: "form", header: "Form" },
    { accessorKey: "inrPerKg", header: "INR per kg" },
    { accessorKey: "inrPerMt", header: "INR per MT (Auto)" },
    { accessorKey: "usdPerMt", header: "USD per MT (Auto)" },
    { 
      accessorKey: "updatedAt", 
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt");
        return date ? new Date(date as string).toLocaleDateString() : 'N/A';
      }
    },
    { 
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions 
          editUrl={`/exmill/${row.original._id}`} 
          onDelete={() => setDeleteId(row.original._id || null)} 
        />
      )
    }
  ];

  return (
    <AppLayout>
      <PageHeader
        title="ExMill Rates"
        description="View ExMill rates."
        breadcrumbs={[{ label: "ExMill" }]}
        actions={
          <Link href="/exmill/add">
            <Button>Add Rate</Button>
          </Link>
        }
      />
      <div className="bg-transparent p-0 mt-6">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search variety or form..."
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
        title="Delete ExMill Rate"
        description="Are you sure you want to permanently delete this rate? This action cannot be undone."
        confirmText="Delete Rate"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </AppLayout>
  );
}
