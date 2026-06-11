import * as React from "react";
import { cn } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import { Search, ChevronDown } from "lucide-react";

export interface SelectProps {
  label?: string;
  name: string;
  options: { label: string; value: string | number }[];
  rules?: any;
  className?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const FormSelect = React.forwardRef<any, SelectProps>(
  ({ className, label, name, options, rules, placeholder = "Select...", isDisabled, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const error = errors[name]?.message as string | undefined;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-[13px] font-semibold text-slate-700 leading-none" htmlFor={name}>
            {label}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              options={options}
              placeholder={placeholder}
              error={!!error}
              disabled={isDisabled}
              className={className}
            />
          )}
        />
        {error && <p className="text-[11px] font-bold text-rose-600 mt-1">{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
  className,
}: {
  value: any;
  onChange: (val: any) => void;
  options: { label: string; value: string | number }[];
  placeholder: string;
  error: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-1",
          error
            ? "border-rose-400 focus-visible:ring-rose-400"
            : isOpen
            ? "border-[var(--color-brand-primary)] ring-1 ring-[var(--color-brand-primary)]"
            : "border-slate-200 hover:border-slate-300 focus-visible:border-[var(--color-brand-primary)] focus-visible:ring-[var(--color-brand-primary)]",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-500")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white py-1 shadow-lg outline-none animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center border-b border-slate-100 px-3 pb-2 pt-1">
            <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              className="flex h-8 w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No options found.</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer",
                    value === option.value && "bg-slate-100 font-medium text-slate-900"
                  )}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { FormSelect };
