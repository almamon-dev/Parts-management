import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage } from "@inertiajs/react";
import { Skeleton } from "@/Components/ui/Skeleton";
import RequestModal from "./RequestModal";
import { FileText, Package, Box, CheckCircle, Clock } from "lucide-react";

export default function OrderReturn() {
    const { auth, returns, orders } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const getStatusStyles = (status) => {
        const styles = {
            approved: "bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]",
            pending: "bg-orange-50 text-orange-600 border-orange-100",
            rejected: "bg-red-50 text-red-600 border-red-100",
        };
        return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
    };

    return (
        <>
            <UserLayout user={auth.user} isBlur={isModalOpen}>
                <Head title="Return Requests" />
                <div className="p-6 bg-[#F8F9FB] min-h-screen">
                    <div className="max-w-8xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-red-600" />
                                    Return Policy
                                </button>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-colors"
                            >
                                <span className="text-xl">+</span> New Return
                                Request
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="space-y-6">
                                <Skeleton className="h-40 w-full" />
                            </div>
                        ) : returns.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                                <Box className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">
                                    No return requests found.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {returns.map((ret) => (
                                    <div
                                        key={ret.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 rounded-lg">
                                                    <FileText className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">
                                                        Return RET-{ret.id}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        Original Order:{" "}
                                                        {ret.order.order_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div
                                                    className={`px-4 py-1 rounded-full border text-[11px] font-black uppercase flex items-center gap-2 ${getStatusStyles(ret.status)}`}
                                                >
                                                    {ret.status ===
                                                        "approved" && (
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    )}
                                                    {ret.status ===
                                                        "pending" && (
                                                        <Clock className="w-3.5 h-3.5" />
                                                    )}
                                                    {ret.status}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                        Refund Amount
                                                    </p>
                                                    <p className="text-lg font-black text-slate-900">
                                                        $
                                                        {ret.order.total_amount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-gray-50/50 rounded-xl p-4 mb-6 border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-100">
                                                    <Clock className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                        Request Date
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {new Date(
                                                            ret.created_at,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-gray-100">
                                                    <Package className="w-4 h-4 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                        Items
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700">
                                                        {ret.order.items.length}{" "}
                                                        parts
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {ret.order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={`/${item.product.files[0]?.file_path}`}
                                                            className="w-12 h-12 object-cover rounded-lg border"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">
                                                                {
                                                                    item.product
                                                                        .sku
                                                                }
                                                            </p>
                                                            <p className="text-[11px] text-gray-500 uppercase">
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-[10px] font-bold text-gray-400">
                                                                QTY:{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                                            Total
                                                        </p>
                                                        <p className="text-sm font-black text-slate-900">
                                                            ${item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                            <p className="text-sm font-bold text-slate-900 mb-1">
                                                Reason:
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {ret.reason}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </UserLayout>
            <RequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                orders={orders}
            />
        </>
    );
}
