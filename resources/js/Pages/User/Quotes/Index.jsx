import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    Calendar,
    ShoppingCart,
    Trash2,
    FileText,
    Clock,
    Package,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import QuoteDetailsModal from "@/Components/ui/user/QuoteDetailsModal";
import { Skeleton } from "@/Components/ui/Skeleton";
import Swal from "sweetalert2";

const QuoteSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
                <Skeleton className="h-2 w-10" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2 text-right">
                <Skeleton className="h-2 w-10 ml-auto" />
                <Skeleton className="h-4 w-24 ml-auto" />
            </div>
        </div>
        <Skeleton className="h-16 w-full rounded-xl mb-6" />
        <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
        </div>
    </div>
);

export default function Index({ quotes }) {
    const { auth } = usePage().props;
    const [isLoading, setIsLoading] = useState(quotes.length > 0);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (quotes.length === 0) {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [quotes.length]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Delete Quote?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#AD0100",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "rounded-full px-6 py-2 font-bold",
                cancelButton: "rounded-full px-6 py-2 font-bold",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("quotes.destroy", id), {
                    onSuccess: () =>
                        toast.success("Quote deleted successfully"),
                });
            }
        });
    };

    const handleOpenModal = (quote) => {
        setSelectedQuote(quote);
        setIsModalOpen(true);
    };

    const handleConvert = (id) => {
        router.post(
            route("quotes.convert", id),
            {},
            {
                onSuccess: () => toast.success("Quote converted to cart!"),
            },
        );
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "expiring_soon":
                return "bg-amber-50 text-amber-600 border-amber-100";
            case "expired":
                return "bg-red-50 text-red-600 border-red-100";
            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <>
            <Head title="Saved Quotes" />
            <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
                <div className="max-w-9xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                            Saved Quotes
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">
                            Manage and convert your saved parts quotations
                            seamlessly.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <QuoteSkeleton key={i} />
                            ))}
                        </div>
                    ) : quotes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                            {quotes.map((quote) => (
                                <div
                                    key={quote.id}
                                    className="bg-white rounded-xl p-4 md:p-5 border border-slate-100 relative overflow-hidden flex flex-col shadow-sm"
                                >
                                    <div className="absolute top-6 right-6">
                                        <span
                                            className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black tracking-widest border",
                                                getStatusStyles(quote.status),
                                            )}
                                        >
                                            {quote.status?.replace("_", " ")}
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#AD0100] shrink-0">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-1">
                                                Quote ID
                                            </h3>
                                            <p className="text-lg font-bold text-slate-900">
                                                {quote.quote_number}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[9px]">
                                                    Created
                                                </span>
                                            </div>
                                            <p className="text-xs  ">
                                                {new Date(
                                                    quote.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[9px]">
                                                    Valid Until
                                                </span>
                                            </div>
                                            <p className="text-xs">
                                                {new Date(
                                                    quote.valid_until,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between mb-6 border border-slate-100">
                                        <div>
                                            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                                                Total Items
                                            </span>
                                            <p className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 ">
                                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                                {quote.items_count} Parts
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
                                                Quotation Total
                                            </span>
                                            <p className="text-lg font-bold text-[#AD0100] tracking-tight">
                                                $
                                                {parseFloat(
                                                    quote.total_amount,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-3">
                                        <button
                                            onClick={() =>
                                                handleConvert(quote.id)
                                            }
                                            className="w-full bg-[#AD0100] text-white h-10 rounded-xl font-bold text-[11px] tracking-wider flex items-center justify-center gap-2 hover:bg-red-800 transition-all active:scale-95 group/btn shadow-lg shadow-red-100"
                                        >
                                            Convert to Order
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleOpenModal(quote)
                                                }
                                                className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 font-bold text-[11px] tracking-wider flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 bg-white shadow-sm"
                                            >
                                                View Details
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(quote.id)
                                                }
                                                className="w-11 h-11 rounded-xl bg-red-50 text-[#AD0100] hover:bg-red-100 transition-all flex items-center justify-center shrink-0 border border-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-md p-10 md:p-20 border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-[#AD0100] opacity-50" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                                No Saved Quotes
                            </h2>
                            <p className="text-slate-500 max-w-xs mb-8 font-medium text-sm leading-relaxed">
                                You haven't saved any quotations yet. Browse our
                                inventory to start building your quote.
                            </p>
                            <Link
                                href={route("parts.index")}
                                className="bg-[#AD0100] text-white px-8 py-3 rounded-full font-black text-xs tracking-widest hover:bg-red-800 transition-all shadow-xl shadow-red-100 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Return to Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <QuoteDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                quote={selectedQuote}
            />
        </>
    );
}

Index.layout = (page) => <UserLayout children={page} />;
