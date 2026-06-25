import Link from "next/link";
import { Edit2, Trash2, Eye } from "lucide-react";

interface TableActionsProps {
  editUrl: string;
  onDelete: () => void;
  onViewQuote?: () => void;
}

export function TableActions({ editUrl, onDelete, onViewQuote }: TableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {onViewQuote && (
        <button 
          onClick={onViewQuote}
          className="p-1.5 bg-emerald-50 border border-emerald-100 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 rounded-md transition-colors" 
          title="View Quote"
        >
          <Eye size={15} strokeWidth={2.5} />
        </button>
      )}
      <Link href={editUrl}>
        <button 
          className="p-1.5 bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors" 
          title="Edit"
        >
          <Edit2 size={15} strokeWidth={2.5} />
        </button>
      </Link>
      <button 
        onClick={onDelete}
        className="p-1.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
        title="Delete"
      >
        <Trash2 size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
