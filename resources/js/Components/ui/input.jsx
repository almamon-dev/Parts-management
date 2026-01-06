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
            icon: Icon,
            ...props
        },
        ref
    ) => {
        const Component = isTextArea ? "textarea" : "input";

        return (
            <div className="w-full space-y-2 text-left">
                {/* Label logic - Glass style text */}
                {label && (
                    <label className="text-sm font-semibold text-gray-100 ml-1">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {/* Left Icon Handling */}
                    {Icon && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 pointer-events-none">
                            <Icon size={20} />
                        </span>
                    )}

                    <Component
                        type={!isTextArea ? type : undefined}
                        className={cn(
                            "flex w-full rounded-[12px] border bg-black/40 px-5 py-2 text-white transition-all duration-200",
                            "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent",
                            "border-white/20 backdrop-blur-md",

                            // Adjust padding if Icon exists
                            Icon ? "pl-14" : "pl-5",

                            // Textarea vs Input Height
                            isTextArea
                                ? "min-h-[120px] py-4 resize-none"
                                : "h-[64px]",

                            // Disabled state
                            "disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-gray-500",

                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>

                {/* Error handling with slide-in animation */}
                {error && (
                    <p className="text-[12px] font-medium text-red-400 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
