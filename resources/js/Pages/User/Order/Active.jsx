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
} from "lucide-react";

// --- Skeleton Component ---
const OrderCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-24 w-full rounded-xl mb-4" />
        <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
        </div>
    </div>
);

export default function Active() {
    const { auth, orders } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const orderList = Array.isArray(orders) ? orders : [];

    // Active orders logic (excluding delivered and cancelled)
    const activeOrders = orderList.filter(
        (order) => !["delivered", "cancelled"].includes(order.status),
    );

    const filteredOrders = activeOrders.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <UserLayout user={auth.user}>
            <Head title="Active Orders" />
            <div className="p-6 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-8xl mx-auto">
                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="relative min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by Order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-6">
                            {(activeOrders.length > 0
                                ? activeOrders.slice(0, 2)
                                : [1, 2, 3]
                            ).map((_, i) => (
                                <OrderCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white p-16 rounded-2xl border border-gray-200 text-center">
                            <Box className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900">
                                No active orders found
                            </h2>
                            <Link
                                href={route("parts.index")}
                                className="text-red-600 font-bold mt-4 inline-block hover:underline"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    {/* Order Header (Design from Image) */}
                                    <div className="p-6 flex flex-wrap justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 ">
                                                    Order {order.order_number}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="bg-[#EBF5FF] text-[#007AFF] px-4 py-1.5 rounded-full text-[11px] font-black  tracking-wider flex items-center gap-2">
                                            <Truck className="w-3.5 h-3.5" /> To
                                            be Picked up
                                        </div>
                                    </div>

                                    {/* Placed Date & Total */}
                                    <div className="px-6 flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400  leading-none mb-1">
                                                    Placed on
                                                </span>
                                                <span className="text-sm font-black text-slate-900 leading-none">
                                                    {
                                                        new Date(
                                                            order.created_at,
                                                        )
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400  mb-1">
                                                Total
                                            </p>
                                            <p className="text-2xl font-black text-slate-900">
                                                $
                                                {parseFloat(
                                                    order.total_amount,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Info Box (Design from Image) */}
                                    <div className="mx-6 mb-8 p-6 bg-white border border-gray-100 rounded-2xl flex flex-wrap gap-16 shadow-sm shadow-gray-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center text-[#007AFF] border border-blue-50">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold  tracking-widest">
                                                    Estimated Delivery
                                                </p>
                                                <p className="text-lg font-black text-slate-900">
                                                    2025-12-08
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-50/50 rounded-full flex items-center justify-center text-[#AF52DE] border border-purple-50">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold  tracking-widest">
                                                    Items
                                                </p>
                                                <p className="text-lg font-black text-slate-900">
                                                    {order.items?.length || 0}{" "}
                                                    parts
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Section */}
                                    <div className="px-6 pb-4">
                                        <h4 className="text-xs font-black text-slate-900  tracking-widest mb-4">
                                            Order Items
                                        </h4>
                                        <div className="space-y-3">
                                            {order.items?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
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
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                                    <Package className="w-6 h-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-black text-slate-900 text-sm ">
                                                                {
                                                                    item.product
                                                                        ?.sku
                                                                }
                                                            </h5>
                                                            <p className="text-xs text-slate-500 font-medium">
                                                                {
                                                                    item.product
                                                                        ?.description
                                                                }
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1  tracking-tight">
                                                                QTY:{" "}
                                                                {item.quantity <
                                                                10
                                                                    ? `0${item.quantity}`
                                                                    : item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-400  mb-1">
                                                            Total
                                                        </p>
                                                        <p className="font-black text-slate-900">
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

                                    {/* Action Footer */}
                                    <div className="px-6 py-5 flex justify-end">
                                        <button className="flex items-center gap-3 bg-[#AD0100] text-white pl-8 pr-3 py-3 rounded-full font-bold text-sm hover:bg-red-800 transition-all shadow-lg shadow-red-100">
                                            View Invoice
                                            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
