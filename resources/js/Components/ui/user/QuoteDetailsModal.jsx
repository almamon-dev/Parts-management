import React, { useState } from "react";
import { X, Bookmark, ImageOff, ChevronDown, ChevronUp } from "lucide-react";

export default function QuoteDetailsModal({ isOpen, onClose, quote }) {
    const [expandedItems, setExpandedItems] = useState({});

    if (!isOpen || !quote) return null;

    const toggleExpand = (itemId) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const statusColors = {
        active: "bg-green-100 text-green-700",
        expiring: "bg-orange-100 text-orange-700",
        expired: "bg-red-100 text-red-700",
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
            <div
                className="bg-white rounded-[16px] w-full max-w-lg shadow-2xl relative overflow-hidden transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-4 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                            <Bookmark className="w-5 h-5 text-[#AD0100]" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                            Quote Details
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>

                {/* Metadata Body */}
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 block">
                                Quote ID
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                {quote.quote_number}
                            </h3>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[quote.status] || "bg-gray-100 text-gray-700"}`}
                        >
                            {quote.status}
                        </span>
                    </div>

                    {/* Items Section */}
                    <div>
                        <h4 className="text-[14px] font-bold text-slate-900 mb-3 tracking-tight uppercase">
                            Quoted Items
                        </h4>
                        <div className="space-y-3">
                            {quote.items?.map((item) => {
                                const isExpanded = expandedItems[item.id];
                                const hasManyFitments =
                                    item.product?.fitments?.length > 3;
                                const displayedFitments = isExpanded
                                    ? item.product?.fitments
                                    : item.product?.fitments?.slice(0, 3);

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
                                    >
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5">
                                            {item.product?.files?.[0]
                                                ?.file_path ? (
                                                <img
                                                    src={`/${item.product.files[0].file_path}`}
                                                    className="w-full h-full object-contain"
                                                    alt={
                                                        item.product
                                                            ?.description
                                                    }
                                                />
                                            ) : (
                                                <ImageOff className="w-5 h-5 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex justify-between items-start mb-0.5 gap-2">
                                                <h5 className="text-[12px] font-bold text-slate-800 leading-tight uppercase line-clamp-2">
                                                    {item.product?.description}
                                                </h5>
                                                <div className="text-[14px] font-bold text-[#AD0100] whitespace-nowrap">
                                                    $
                                                    {(
                                                        item.quantity *
                                                        item.price_at_quote
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            minimumFractionDigits: 2,
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                    SKU: {item.product?.sku}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    × {item.quantity} Qty
                                                </span>
                                            </div>

                                            {item.product?.fitments?.length >
                                                0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {displayedFitments.map(
                                                        (fit, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded capitalize"
                                                            >
                                                                {fit.year_from}-
                                                                {fit.year_to}{" "}
                                                                {fit.make}{" "}
                                                                {fit.model}
                                                            </span>
                                                        ),
                                                    )}
                                                    {hasManyFitments && (
                                                        <button
                                                            onClick={() =>
                                                                toggleExpand(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="text-[9px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded flex items-center gap-1 transition-colors uppercase tracking-tight"
                                                        >
                                                            {isExpanded ? (
                                                                <>
                                                                    Show Less{" "}
                                                                    <ChevronUp
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    +
                                                                    {item
                                                                        .product
                                                                        .fitments
                                                                        .length -
                                                                        3}{" "}
                                                                    More{" "}
                                                                    <ChevronDown
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer / Total info could go here if needed, keeping it minimal as per image */}
                <div className="p-3 border-t border-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-slate-900 text-white rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
