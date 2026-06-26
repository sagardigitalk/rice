import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ text = "Loading data...", className, size = 'md' }: LoaderProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const spinnerSize = sizes[size];

  // We'll create a dotted spinner using multiple dots arranged in a circle
  return (
    <div className={cn("flex flex-col items-center justify-center gap-5 w-full py-12", className)}>
      <div className={cn("relative flex items-center justify-center", spinnerSize)}>
        {/* Animated dotted spinner */}
        <div className="absolute inset-0 w-full h-full animate-spin [animation-duration:1.5s]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2"
              style={{ transform: `rotate(${i * 45}deg)` }}
            >
              <div 
                className={cn(
                  "w-[15%] h-[15%] mx-auto rounded-full bg-primary",
                  // Fade opacity based on index
                  i === 0 ? "opacity-100" :
                  i === 1 ? "opacity-80" :
                  i === 2 ? "opacity-60" :
                  i === 3 ? "opacity-40" :
                  i === 4 ? "opacity-30" :
                  i === 5 ? "opacity-20" :
                  i === 6 ? "opacity-10" : "opacity-5"
                )} 
              />
            </div>
          ))}
        </div>
      </div>
      {text && (
        <p className="text-[13px] text-slate-400 font-bold tracking-[0.15em] uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
