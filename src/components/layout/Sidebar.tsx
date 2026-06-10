"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  Ship,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Factory,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: Users, label: "Leads", href: "/leads" },
  { icon: Factory, label: "ExMill", href: "/exmill" },
  { icon: Ship, label: "Freight", href: "/freight" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      className="enterprise-sidebar h-screen sticky top-0 z-40 flex flex-col transition-all duration-300 ease-in-out"
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-100">
                R
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                Rise<span className="text-indigo-600 font-extrabold">CRM</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all border border-slate-200/50"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5 custom-scrollbar">
        {menuItems.map((item, idx) => {
          if ((item as any).isHeader) {
            return !collapsed ? (
              <div
                key={`header-${idx}`}
                className="px-3 pt-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]"
              >
                {item.label}
              </div>
            ) : (
              <div key={`header-${idx}`} className="h-px bg-slate-100 my-6 mx-2" />
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon!;

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all relative duration-200",
                isActive
                  ? "bg-gradient-to-r from-indigo-50 to-blue-50/60 text-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.06)] border border-indigo-100/30"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                size={19}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              {!collapsed && (
                <span className={cn(
                  "text-[13.5px] font-semibold tracking-tight transition-colors",
                  isActive ? "text-indigo-600 font-bold" : "text-slate-500 group-hover:text-slate-800"
                )}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-5 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.4)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {!isActive && !collapsed && (
                 <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-slate-200/50 pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-5 border-t border-slate-100 bg-slate-50/50">
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-semibold text-[13.5px] border border-transparent hover:border-rose-100",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut size={19} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
