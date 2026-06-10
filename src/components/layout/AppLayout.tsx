"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background light-gradient-mesh">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 relative">
        <Header />
        <main className={cn("flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-6", className)}>
          <div className="mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
