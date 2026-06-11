import * as React from "react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: string;
  rules?: any;
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, name, rules, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            className="text-[13px] font-semibold text-slate-700 leading-none"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-[var(--color-brand-primary)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-400 focus-visible:border-rose-400 focus-visible:ring-rose-400",
            className
          )}
          {...register(name, rules)}
          {...props}
        />
        {error && (
          <p className="text-[11px] font-bold text-rose-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
