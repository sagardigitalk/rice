import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ text = "Loading data...", className, size = 'md' }: LoaderProps) {
  const sizes = {
    sm: { container: "h-6 w-6", border: "border-2" },
    md: { container: "h-10 w-10", border: "border-[3px]" },
    lg: { container: "h-16 w-16", border: "border-4" },
  };

  const { container, border } = sizes[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-5 w-full py-12", className)}>
      <div className={cn("relative flex items-center justify-center", container)}>
        {/* Background track */}
        <div className={cn("absolute inset-0 rounded-full border-primary/15", border)}></div>
        {/* Spinning indicator */}
        <div className={cn("absolute inset-0 rounded-full border-primary border-t-transparent animate-spin", border)}></div>
      </div>
      {text && (
        <p className="text-[13px] text-slate-400 font-bold tracking-[0.15em] uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
