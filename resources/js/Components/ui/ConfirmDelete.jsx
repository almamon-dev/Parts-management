import React from "react";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";

export default function ConfirmDelete({
    id,
    routeName,
    title = "Are you sure?",
    text = "This action cannot be undone!",
    confirmButtonText = "Yes, delete it!",
    cancelButtonText = "Cancel",
}) {
    const handleClick = () => {
        Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444", // Red-500
            cancelButtonColor: "#64748B", // Slate-500
            confirmButtonText,
            cancelButtonText,
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "rounded-full px-6 py-2 font-bold",
                cancelButton: "rounded-full px-6 py-2 font-bold",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route(routeName, id), {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F5F9] text-[#B91C1C] hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent active:scale-95"
            title="Delete Item"
        >
            <Trash2 size={16} strokeWidth={2.5} />
        </button>
    );
}
