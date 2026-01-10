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
            confirmButtonColor: "#FF9F43",
            cancelButtonColor: "#d33",
            confirmButtonText,
            cancelButtonText,
            customClass: {
                popup: "rounded-sm",
                confirmButton: "rounded-sm px-4 py-2 font-bold",
                cancelButton: "rounded-sm px-4 py-2 font-bold",
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
            className="p-1.5 text-gray-400 hover:text-red-500 bg-white border rounded shadow-sm transition"
        >
            <Trash2 size={15} />
        </button>
    );
}
