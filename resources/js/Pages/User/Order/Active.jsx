import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Skeleton } from "@/Components/ui/Skeleton";
import {
    Search,
    FileText,
    Package,
    Truck,
    ArrowUpRight,
    Calendar,
    Box,
    Clock,
    Tag,
    Receipt,
    History,
    RotateCcw,
} from "lucide-react";

// --- Advanced Skeleton Component ---
const OrderCardSkeleton = ({ order }) => {
    const itemCount = order?.items?.length || 2;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                <div className="flex gap-4 items-center">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                </div>
                <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            {/* Key Info Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl lg:col-span-1 sm:col-span-2" />
            </div>

            {/* Item List Skeleton */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-1 w-6 rounded-full" />
                    <Skeleton className="h-3 w-28" />
                </div>
                {Array.from({ length: itemCount }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col sm:flex-row items-center justify-between p-4 border border-slate-100 rounded-2xl"
                    >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-2.5 w-40" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-0 space-y-1.5 text-right w-full sm:w-auto">
                            <Skeleton className="h-2.5 w-14 ml-auto" />
                            <Skeleton className="h-5 w-20 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-end pt-2">
                <Skeleton className="h-10 w-40 rounded-full" />
            </div>
        </div>
    );
};

export default function Active() {
    const { auth, orders } = usePage().props;
    const orderList = Array.isArray(orders) ? orders : [];
    const [isLoading, setIsLoading] = useState(orderList.length > 0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (orderList.length === 0) {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [orderList.length]);

    // Filter by search query
    const filteredOrders = orderList.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "pending":
                return {
                    bg: "bg-amber-50 text-amber-600 border-amber-100",
                    icon: <Clock size={14} />,
                    label: "Pending",
                };
            case "processing":
                return {
                    bg: "bg-blue-50 text-blue-600 border-blue-100",
                    icon: <Package size={14} />,
                    label: "In Processing",
                };
            case "picked_up":
                return {
                    bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
                    icon: <Truck size={14} />,
                    label: "Ready for Pickup",
                };
            default:
                return {
                    bg: "bg-slate-50 text-slate-600 border-slate-100",
                    icon: <FileText size={14} />,
                    label: status,
                };
        }
    };

    return (
        <>
            <Head title="Active Orders" />
            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                Active Orders
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                Manage your current orders in real-time.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full md:w-[260px] pl-11 pr-4 py-2.5 rounded-xl border-none shadow-sm shadow-slate-200/50 text-sm focus:ring-1 focus:ring-[#AD0100] outline-none transition-all placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <Link
                                href={route("orders.history")}
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                <History className="w-4 h-4" />
                                History
                            </Link>
                            <Link
                                href={route("orders.returns.index")}
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Return History
                            </Link>
                        </div>
                    </div>

                    {/* Content Logic */}
                    {isLoading ? (
                        <div className="space-y-6">
                            {orderList.slice(0, 2).map((order, i) => (
                                <OrderCardSkeleton key={i} order={order} />
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Box className="w-7 h-7 text-slate-300" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900">
                                No active orders found
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto font-medium">
                                You don't have any active orders at the moment.
                            </p>
                            <Link
                                href={route("parts.index")}
                                className="mt-6 px-6 py-2.5 bg-[#AD0100] text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 inline-block"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => {
                                const statusInfo = getStatusStyles(
                                    order.status,
                                );
                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                                    >
                                        {/* Order Header */}
                                        <div className="p-4 md:p-6 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                                    <Receipt className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-gray-500">
                                                            Order Number
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        #{order.order_number}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div
                                                className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${statusInfo.bg}`}
                                            >
                                                {statusInfo.icon}
                                                {statusInfo.label}
                                            </div>
                                        </div>

                                        {/* Key Info Grid */}
                                        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/20">
                                            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">
                                                        Order Date
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
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
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">
                                                        Quantity
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {order.items?.length ||
                                                            0}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3 lg:col-span-1 sm:col-span-2">
                                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                                    <span className="font-semibold text-sm">
                                                        $
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 font-medium mb-1">
                                                        Order Total
                                                    </p>
                                                    <p className="text-base font-semibold text-gray-900">
                                                        $
                                                        {parseFloat(
                                                            order.total_amount,
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Section */}
                                        <div className="px-4 md:px-6 pt-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-1 w-6 bg-red-600 rounded-full" />
                                                <h4 className="text-sm font-semibold text-gray-900">
                                                    Order Breakdown
                                                </h4>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {order.items?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#AD0100]/30 hover:bg-red-50/10 transition-all"
                                                    >
                                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                                            <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                                {item.product
                                                                    ?.files?.[0] ? (
                                                                    <img
                                                                        src={`/${item.product.files[0].file_path}`}
                                                                        className="w-full h-full object-cover"
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                ?.sku
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                                        <Package
                                                                            size={
                                                                                24
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-gray-900 text-sm">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.sku
                                                                    }
                                                                </h5>
                                                                <p className="text-xs text-gray-500 font-normal mt-0.5 line-clamp-1 max-w-xs">
                                                                    {item
                                                                        .product
                                                                        ?.name ||
                                                                        item
                                                                            .product
                                                                            ?.description}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <div className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                                                        Qty:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </div>
                                                                    <div className="px-2 py-0.5 bg-orange-50 rounded text-xs font-medium text-orange-600">
                                                                        Unit: $
                                                                        {parseFloat(
                                                                            item.price,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 sm:mt-0 w-full sm:w-auto text-right">
                                                            <p className="text-xs font-medium text-gray-500 mb-0.5">
                                                                Row Total
                                                            </p>
                                                            <p className="text-base font-semibold text-gray-900">
                                                                $
                                                                {(
                                                                    parseFloat(
                                                                        item.price,
                                                                    ) *
                                                                    item.quantity
                                                                ).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="px-4 md:px-6 py-6 flex justify-end">
                                            <Link
                                                href={route(
                                                    "orders.show",
                                                    order.id,
                                                )}
                                                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-all group"
                                            >
                                                <span>View Details</span>
                                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Link>
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

Active.layout = (page) => <UserLayout children={page} />;
