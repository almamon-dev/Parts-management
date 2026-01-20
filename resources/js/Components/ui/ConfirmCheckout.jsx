import React from "react";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";

export default function ConfirmAction({
    id,
    routeName,
    title = "Are you sure?",
    text = "Do you want to proceed?",
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    buttonText = "",
    icon: Icon,
    className = "",
    method = "post",
    variant = "default", // 'default' for re-order, 'checkout' for checkout
    cartItems = [], // only for checkout validation
}) {
    const handleClick = (e) => {
        e.preventDefault();

        // Validation for checkout
        if (variant === "checkout" && (!cartItems || cartItems.length === 0))
            return;

        Swal.fire({
            title,
            text,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#AD0100",
            cancelButtonColor: "#6B7280",
            confirmButtonText,
            cancelButtonText,
            reverseButtons: true,
            customClass: {
                popup: "rounded-xl",
                confirmButton: "rounded-full px-6 py-2 font-bold",
                cancelButton: "rounded-full px-6 py-2 font-bold",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router[method](
                    route(routeName, id || {}),
                    {},
                    {
                        preserveScroll: true,
                        onError: () => {
                            Swal.fire({
                                title: "Error!",
                                text: "Action failed. Please try again.",
                                icon: "error",
                                confirmButtonColor: "#AD0100",
                            });
                        },
                    },
                );
            }
        });
    };

    // --- Variant: Proceed to Checkout Design ---
    if (variant === "checkout") {
        return (
            <button
                onClick={handleClick}
                disabled={!cartItems || cartItems.length === 0}
                className="group w-full flex items-center justify-between gap-3 px-5 py-3 bg-red-700 text-white rounded-full font-bold hover:bg-red-800 shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="flex-1 text-center whitespace-nowrap">
                    {buttonText || "Proceed to Checkout"}
                </span>
                <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </span>
            </button>
        );
    }

    // --- Variant: Default / Re-order Design ---
    return (
        <button type="button" onClick={handleClick} className={className}>
            <span>{buttonText}</span>
            {Icon && <Icon className="w-4 h-4 ml-2" />}
        </button>
    );
}
