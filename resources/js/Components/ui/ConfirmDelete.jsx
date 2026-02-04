import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import DeleteConfirmationModal from "./admin/DeleteConfirmationModal";
import toast from "react-hot-toast";

export default function ConfirmDelete({
    id,
    routeName,
    title = "Delete Item",
    text = "Are you sure you want to delete this item? This action is permanent and cannot be undone.",
    confirmButtonText = "Yes, Delete",
    cancelButtonText = "Cancel",
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

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 border border-slate-100 active:scale-95"
            >
                <Trash2 size={16} strokeWidth={2} />
            </button>

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
