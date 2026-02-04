import React, { Fragment } from "react";
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Confirmation",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    isDeleting = false,
}) {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
                                {/* Header / Danger Icon */}
                                <div className="bg-white px-6 pt-8 pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 sm:mx-0 sm:h-12 sm:w-12 border border-rose-100">
                                            <Trash2 className="h-6 w-6 text-rose-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-4 text-center sm:mt-0 sm:ml-5 sm:text-left">
                                            <DialogTitle as="h3" className="text-xl font-bold leading-6 text-slate-900">
                                                {title}
                                            </DialogTitle>
                                            <div className="mt-3">
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                    {message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                                >
                                    <X size={18} />
                                </button>

                                {/* Bottom Info / Alert */}
                                <div className="mx-6 mb-2 mt-4 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 font-semibold leading-normal">
                                        Important: This action is permanent and will remove all associated files and data.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="bg-slate-50/50 px-6 py-6 sm:flex sm:flex-row-reverse sm:gap-3">
                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        className="inline-flex w-full justify-center items-center rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-50 sm:w-auto min-w-[120px]"
                                        onClick={onConfirm}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98] sm:mt-0 sm:w-auto"
                                        onClick={onClose}
                                        disabled={isDeleting}
                                    >
                                        {cancelText}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
