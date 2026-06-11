import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";

interface TableActionsProps {
  editUrl: string;
  onDelete: () => void;
}

export function TableActions({ editUrl, onDelete }: TableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href={editUrl}>
        <button 
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
      </Link>
      <button 
        onClick={onDelete}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
