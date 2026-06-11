"use client";

import { Bell, Search, User, Moon, Sun, Command, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    if (pathname === "/leads") return "Leads";
    if (pathname === "/leads/add") return "Add Lead";
    if (pathname.startsWith("/leads/")) return "Edit Lead";
    if (pathname === "/exmill") return "ExMill Rates";
    if (pathname === "/exmill/add") return "Add Rate";
    if (pathname.startsWith("/exmill/")) return "Edit Rate";
    if (pathname === "/freight") return "Freight Rates";
    if (pathname === "/freight/add") return "Add Freight";
    if (pathname.startsWith("/freight/")) return "Edit Freight";
    if (pathname === "/settings") return "Settings";
    if (pathname === "/account") return "My Account";
    return "";
  };

  useEffect(() => {
    setMounted(true);

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 backdrop-blur-md px-8 border-slate-100/80">
      
      <div className="flex items-center">
        <h1 className="text-[18px] font-extrabold text-slate-800 tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 transition-all"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 relative transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[var(--color-brand-danger)] ring-2 ring-white" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer pl-3 pr-1.5 py-1.5 rounded-xl hover:bg-slate-50 transition-all group"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[13.5px] font-bold text-slate-800 group-hover:text-slate-900 transition-colors tracking-tight">Admin User</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Super Admin</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-sm transition-all">
              <User size={18} />
            </div>
          </div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 rounded-xl bg-white border border-slate-200/60 shadow-xl overflow-hidden py-1.5 z-50 origin-top-right"
              >
                <Link
                  href="/account"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[var(--color-brand-primary)] transition-colors"
                >
                  <User size={16} className="text-slate-400" /> My Account
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[var(--color-brand-primary)] transition-colors"
                >
                  <Settings size={16} className="text-slate-400" /> Settings
                </Link>
                <div className="h-px bg-slate-100 my-1.5 mx-3" />
                <Link
                  href="/login"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} className="text-rose-500" /> Sign out
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
