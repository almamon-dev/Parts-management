import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function ConfirmDelete({
    id,
    routeName,
    title = "Delete Item",
    text = "Are you sure you want to delete this item? This action is permanent and cannot be undone.",
    confirmButtonText = "Yes, Delete",
    cancelButtonText = "Cancel",
    variant = "button", // 'button' or 'dropdown'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = () => {
        setIsDeleting(true);
        router.delete(route(routeName, id), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                setIsOpen(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const trigger =
        variant === "dropdown" ? (
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                }}
                className="flex items-center gap-2 w-full px-2 py-2 text-[10.5px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
                <Trash2 size={14} className="text-rose-400" /> Delete Item
            </button>
        ) : (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-rose-600 hover:bg-white bg-transparent border border-transparent hover:border-slate-200 rounded-lg transition-all duration-200"
            >
                <Trash2 size={15} />
            </button>
        );

    return (
        <>
            {trigger}

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => !isDeleting && setIsOpen(false)}
                onConfirm={handleConfirm}
                title={title}
                message={text}
                confirmText={confirmButtonText}
                cancelText={cancelButtonText}
                isDeleting={isDeleting}
            />
        </>
    );
}
