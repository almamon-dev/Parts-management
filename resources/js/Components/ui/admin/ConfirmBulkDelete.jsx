import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function ConfirmBulkDelete({
    selectedIds,
    selectAllGlobal,
    totalCount,
    search,
    filters = {},
    routeName,
    onSuccess,
    title = "Delete Selected Items",
    confirmButtonText = "Yes, Delete Selected",
    cancelButtonText = "Cancel",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleBulkDelete = () => {
        setIsDeleting(true);
        router.post(
            route(routeName),
            {
                _method: "delete",
                ids: selectedIds,
                all: selectAllGlobal,
                search: search,
                ...filters,
            },
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => {
                    setIsOpen(false);
                    if (onSuccess) onSuccess();
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
                onError: (errors) => {
                    setIsDeleting(false);
                },
            },
        );
    };

    const count = selectAllGlobal ? totalCount : selectedIds.length;
    const message = `Are you sure you want to delete ${count} selected items? This action is permanent and cannot be undone.`;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-200 font-bold text-[13px] shadow-sm"
            >
                <Trash2 size={16} />
                Delete Selected {count > 0 && `(${count})`}
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => !isDeleting && setIsOpen(false)}
                onConfirm={handleBulkDelete}
                title={title}
                message={message}
                confirmText={confirmButtonText}
                cancelText={cancelButtonText}
                isDeleting={isDeleting}
            />
        </>
    );
}
