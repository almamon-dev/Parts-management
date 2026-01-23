import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef(
    (
        {
            className,
            label,
            error,
            options = [],
            defaultValue = "",
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full space-y-1.5 text-left">
                {label && (
                    <label className="text-[13px] font-semibold text-gray-700 ml-0.5">
                        {label}
                    </label>
                )}

                <select
                    className={cn(
                        "flex w-full rounded-md border bg-white px-3 py-2 text-sm transition-all appearance-none",
                        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
                        // Dynamic Border: Red if error, Orange if focus, Gray otherwise
                        error
                            ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-[#FF9F43] focus:ring-[#FF9F43]/20",
                        "h-10",
                        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    <option value="" disabled>{props.placeholder || "Select an option"}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {error && (
                    <p className="text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
export { Select };
