import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Skeleton } from "@/Components/ui/Skeleton";
import ConfirmAction from "@/Components/ui/ConfirmCheckout";
import {
    Search,
    FileText,
    Package,
    ArrowUpRight,
    ChevronRight,
    Box,
    CheckCircle,
    XCircle,
    RotateCcw,
    Clock,
} from "lucide-react";

// --- Premium Skeleton Component ---
const HistoryCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
            <div className="flex gap-4 items-center">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-6">
                <div className="space-y-1">
                    <Skeleton className="h-2 w-8" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-1 border-l border-slate-50 pl-6">
                    <Skeleton className="h-2 w-8" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
            <div className="text-right space-y-1">
                <Skeleton className="h-2 w-14 ml-auto" />
                <Skeleton className="h-6 w-24 ml-auto" />
            </div>
        </div>

        <div className="space-y-3">
            {[1].map((i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100"
                >
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-2 w-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function OrderHistory() {
    const { auth, orders } = usePage().props;
    const orderList = Array.isArray(orders) ? orders : [];

    // Filter for History (Delivered and Cancelled)
    const historicalOrders = orderList.filter((order) =>
        ["delivered", "cancelled"].includes(order.status),
    );

    const [isLoading, setIsLoading] = useState(historicalOrders.length > 0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (historicalOrders.length === 0) {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [historicalOrders.length]);

    const filteredOrders = historicalOrders.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getStatusConfig = (status) => {
        const configs = {
            delivered: {
                icon: <CheckCircle className="w-3.5 h-3.5" />,
                bgColor: "bg-emerald-50",
                textColor: "text-emerald-600",
                borderColor: "border-emerald-100",
                label: "Delivered",
            },
            cancelled: {
                icon: <XCircle className="w-3.5 h-3.5" />,
                bgColor: "bg-rose-50",
                textColor: "text-rose-600",
                borderColor: "border-rose-100",
                label: "Cancelled",
            },
        };
        return (
            configs[status] || {
                icon: <Package className="w-3.5 h-3.5" />,
                bgColor: "bg-gray-50",
                textColor: "text-gray-700",
                borderColor: "border-gray-100",
                label: status,
            }
        );
    };

    return (
        <>
            <Head title="Order History" />
            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                Order History
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                View and manage your previous successful
                                transactions.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#AD0100] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search past orders..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full md:w-[280px] pl-11 pr-4 py-2.5 rounded-xl border-none shadow-sm shadow-slate-200/50 text-sm focus:ring-1 focus:ring-[#AD0100] outline-none transition-all placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <Link
                                href={route("orders.active")}
                                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-[#AD0100] text-white rounded-full text-xs font-black hover:bg-red-800 transition-colors shadow-sm uppercase tracking-wider"
                            >
                                <Package className="w-4 h-4 text-white" />
                                Active
                            </Link>
                            <Link
                                href={route("orders.returns.index")}
                                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full text-xs font-black hover:bg-indigo-700 transition-colors shadow-sm uppercase tracking-wider"
                            >
                                <RotateCcw className="w-4 h-4 text-white" />
                                Return History
                            </Link>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {isLoading ? (
                        <div className="space-y-6">
                            {historicalOrders.slice(0, 2).map((_, i) => (
                                <HistoryCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white p-12 rounded-md border border-slate-100 text-center shadow-sm">
                            <Box className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                            <h2 className="text-lg font-black text-slate-900">
                                No history discovered
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto font-medium">
                                Looking for parts? Browse our latest inventory.
                            </p>
                            <Link
                                href={route("parts.index")}
                                className="mt-6 px-8 py-2.5 bg-[#AD0100] text-white rounded-full font-black text-xs hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 inline-block uppercase tracking-widest"
                            >
                                Inventory
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => {
                                const status = getStatusConfig(order.status);
                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow duration-300"
                                    >
                                        {/* Order Header */}
                                        <div className="p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-50">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 leading-none">
                                                        #{order.order_number}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div
                                                className={`px-4 py-1.5 rounded-full border ${status.borderColor} ${status.bgColor} flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${status.textColor}`}
                                            >
                                                {status.icon} {status.label}
                                            </div>
                                        </div>

                                        {/* Summary Row */}
                                        <div className="p-4 md:p-6 flex justify-between items-center bg-white">
                                            <div className="flex items-center gap-6 md:gap-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">
                                                        Order Date
                                                    </span>
                                                    <span className="text-sm font-black text-slate-900">
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col border-l border-slate-100 pl-6 md:pl-10">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">
                                                        Quantity
                                                    </span>
                                                    <span className="text-sm font-black text-slate-900">
                                                        {order.items?.length ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest leading-none">
                                                    Order Total
                                                </p>
                                                <p className="text-2xl font-black text-slate-900 leading-none">
                                                    $
                                                    {parseFloat(
                                                        order.total_amount,
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div className="px-4 md:px-6 pb-6">
                                            <div className="space-y-3">
                                                {order.items?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between p-4 bg-slate-50/30 rounded-2xl border border-slate-100"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-white rounded-xl border border-slate-100 overflow-hidden flex-shrink-0">
                                                                {item.product
                                                                    ?.files?.[0] ? (
                                                                    <img
                                                                        src={`/${item.product.files[0].file_path}`}
                                                                        className="w-full h-full object-cover"
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                                        <Package className="w-6 h-6" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-black text-slate-900 text-sm italic">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.sku
                                                                    }
                                                                </h5>
                                                                <p className="text-[11px] text-slate-500 font-medium leading-tight line-clamp-1 max-w-xs">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.description
                                                                    }
                                                                </p>
                                                                <div className="px-2 py-0.5 bg-slate-100/80 rounded mt-1.5 inline-block text-[9px] font-black text-slate-500 uppercase">
                                                                    QTY:{" "}
                                                                    {item.quantity <
                                                                    10
                                                                        ? `0${item.quantity}`
                                                                        : item.quantity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 tracking-tighter leading-none">
                                                                Unit Val
                                                            </p>
                                                            <p className="font-black text-slate-900 text-base leading-none">
                                                                $
                                                                {parseFloat(
                                                                    item.price,
                                                                ).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="px-4 md:px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-4">
                                            <button className="px-6 py-2.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-500 hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm uppercase tracking-widest">
                                                Invoice
                                            </button>
                                            {order.status === "delivered" && (
                                                <Link
                                                    href={route(
                                                        "orders.returns.index",
                                                        { order_id: order.id },
                                                    )}
                                                    className="px-6 py-2.5 bg-red-50 border border-red-100 rounded-full text-[10px] font-black text-[#AD0100] hover:bg-red-100 transition-all shadow-sm uppercase tracking-widest flex items-center gap-2"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    Return
                                                </Link>
                                            )}
                                            <ConfirmAction
                                                id={order.id}
                                                routeName="orders.reorder"
                                                variant="premium"
                                                title="Re-order Items?"
                                                text="Add these items to your cart?"
                                                confirmButtonText="Yes, Re-order"
                                                buttonText="Re-order"
                                                icon={ArrowUpRight}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

OrderHistory.layout = (page) => <UserLayout children={page} />;
