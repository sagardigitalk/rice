"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { freightService, Freight } from "@/services/freightService";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableActions } from "@/components/common/TableActions";
import toast from "react-hot-toast";

export default function FreightPage() {
  const [data, setData] = useState<Freight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Server-side state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(-1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchFreights = async () => {
    try {
      setIsLoading(true);
      const res = await freightService.getAll({
        page: pageIndex + 1,
        limit: pageSize,
        search: searchQuery
      });
      setData(res.data || []);
      setPageCount(res.totalPages || 1);
      setTotalRecords(res.total || 0);
    } catch (error) {
      toast.error("Failed to load Freight rates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFreights();
  }, [pageIndex, pageSize, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await freightService.delete(deleteId);
      toast.success("Freight rate deleted successfully!");
      setData(data.filter(item => item._id !== deleteId));
    } catch (error) {
      toast.error("Failed to delete Freight rate");
    } finally {
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Freight>[] = [
    { accessorKey: "country", header: "Country" },
    { accessorKey: "portName", header: "Port Name" },
    { accessorKey: "seaFreightUsd", header: "Sea Freight (USD/container)" },
    { accessorKey: "cocUsd", header: "COC (USD/MT)" },
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
          editUrl={`/freight/${row.original._id}`} 
          onDelete={() => setDeleteId(row.original._id || null)} 
        />
      )
    }
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Freight Rates"
        description="View Freight rates."
        breadcrumbs={[{ label: "Freight" }]}
        actions={
          <Link href="/freight/add">
            <Button>Add Freight</Button>
          </Link>
        }
      />
      <div className="bg-transparent p-0 mt-6">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Search country or port..."
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
        title="Delete Freight Rate"
        description="Are you sure you want to permanently delete this freight rate? This action cannot be undone."
        confirmText="Delete Rate"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </AppLayout>
  );
}
