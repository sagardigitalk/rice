import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loader({ text = "Loading data...", className, size = 'md' }: LoaderProps) {
  const containerSizes = {
    sm: "h-12 w-12 rounded-xl",
    md: "h-16 w-16 rounded-2xl",
    lg: "h-24 w-24 rounded-3xl",
  };

  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const cardSize = containerSizes[size];
  const spinnerSize = spinnerSizes[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6 w-full py-12", className)}>
      <div className={cn(
        "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center justify-center relative overflow-hidden before:absolute before:inset-0 before:bg-blue-50/30",
        cardSize
      )}>
        <div className={cn("relative flex items-center justify-center", spinnerSize)}>
          {/* Animated 12-dot spinner */}
          <div className="absolute inset-0 w-full h-full animate-spin [animation-duration:1.2s] [animation-timing-function:linear]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div 
                  className={cn(
                    "w-[18%] h-[18%] mx-auto rounded-full bg-indigo-600",
                  )}
                  style={{ opacity: 1 - (i * (1 / 12)) }}
                />
              </div>
            ))}
          </div>
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
