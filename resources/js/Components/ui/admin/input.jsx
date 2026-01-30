import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
    (
        {
            className,
            type = "text",
            label,
            error,
            isTextArea = false,
            ...props
        },
        ref
    ) => {
        const Component = isTextArea ? "textarea" : "input";

        return (
            <div className="w-full space-y-1.5 text-left">
                {label && (
                    <label className="text-[12px] font-medium text-slate-500 ml-0.5">
                        {label}
                    </label>
                )}

                <Component
                    type={!isTextArea ? type : undefined}
                    className={cn(
                        "flex w-full rounded-md border bg-white px-3 py-2 text-sm transition-all",
                        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
                        // Dynamic Border: Red if error, Orange if focus, Gray otherwise
                        error
                            ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                            : "border-gray-200 focus:border-[#FF9F43] focus:ring-[#FF9F43]/20",

                        isTextArea ? "min-h-[100px] resize-y" : "h-10",
                        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                {error && (
                    <p className="text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
export { Input };
