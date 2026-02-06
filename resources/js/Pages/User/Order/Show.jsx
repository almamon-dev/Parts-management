import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ChevronLeft,
    ShoppingCart,
    Calendar,
    Package,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    CreditCard,
    MapPin,
    Info,
    Receipt,
} from "lucide-react";

export default function Show({ auth, order }) {
    const getStatusStyle = (status) => {
        const config = {
            pending: {
                classes: "bg-amber-50 text-amber-600 border-amber-100",
                dot: "bg-amber-500",
                icon: <Clock size={12} />,
            },
            processing: {
                classes: "bg-blue-50 text-blue-600 border-blue-100",
                dot: "bg-blue-500",
                icon: <Package size={12} />,
            },
            picked_up: {
                classes: "bg-purple-50 text-purple-600 border-purple-100",
                dot: "bg-purple-500",
                icon: <Truck size={12} />,
            },
            delivered: {
                classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
                dot: "bg-emerald-500",
                icon: <CheckCircle2 size={12} />,
            },
            cancelled: {
                classes: "bg-rose-50 text-rose-600 border-rose-100",
                dot: "bg-rose-500",
                icon: <XCircle size={12} />,
            },
        };
        const theme = config[status?.toLowerCase()] || {
            classes: "bg-slate-50 text-slate-600 border-slate-100",
            dot: "bg-slate-400",
            icon: <Clock size={12} />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider transition-all ${theme.classes}`}
            >
                {status?.charAt(0).toUpperCase() +
                    status?.slice(1).replace("_", " ")}
            </span>
        );
    };

    return (
        <>
            <Head title={`Order Details #${order.order_number}`} />

            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("orders.active")}
                                    className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                                >
                                    <ChevronLeft size={18} />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                                        Order Details
                                    </h1>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            #{order.order_number}
                                        </span>
                                        {getStatusStyle(order.status)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 text-[11px] font-black text-slate-500 shadow-sm uppercase tracking-widest">
                                <Calendar
                                    size={14}
                                    className="text-[#AD0100]/60"
                                />
                                {new Date(order.created_at).toLocaleDateString(
                                    undefined,
                                    {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                    },
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN: Order Items */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                                        <Receipt className="w-4 h-4 text-[#AD0100]" />
                                        Order Breakdown
                                    </h3>
                                    <span className="px-2.5 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded border border-slate-100">
                                        {order.items.length} Parts
                                    </span>
                                </div>

                                <div className="p-4 md:p-6 space-y-3">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#AD0100]/20 hover:bg-red-50/5 transition-all"
                                        >
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                    {item.product
                                                        ?.files?.[0] ? (
                                                        <img
                                                            src={`/${item.product.files[0].file_path}`}
                                                            className="w-full h-full object-cover"
                                                            alt={
                                                                item.product
                                                                    ?.sku
                                                            }
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                            <Package
                                                                size={24}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 className="font-black text-slate-900 text-sm leading-tight italic">
                                                        {item.product?.sku}
                                                    </h5>
                                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1 max-w-xs">
                                                        {item.product?.name ||
                                                            item.product
                                                                ?.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="px-2 py-0.5 bg-slate-50 rounded text-[9px] font-black text-slate-500 uppercase">
                                                            QTY:{" "}
                                                            {item.quantity < 10
                                                                ? `0${item.quantity}`
                                                                : item.quantity}
                                                        </div>
                                                        <div className="px-2 py-0.5 bg-red-50 rounded text-[9px] font-black text-[#AD0100] uppercase">
                                                            UNIT: $
                                                            {parseFloat(
                                                                item.price,
                                                            ).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 sm:mt-0 w-full sm:w-auto text-right">
                                                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-0.5 leading-none">
                                                    Row Total
                                                </p>
                                                <p className="text-lg font-black text-slate-900">
                                                    $
                                                    {(
                                                        parseFloat(item.price) *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-slate-50/20 border-t border-slate-50 flex justify-end">
                                    <div className="w-full max-w-[240px] space-y-2">
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-slate-400 font-black uppercase tracking-widest">
                                                Subtotal
                                            </span>
                                            <span className="text-slate-900 font-black">
                                                $
                                                {parseFloat(
                                                    order.subtotal || 0,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-slate-400 font-black uppercase tracking-widest">
                                                Tax & Fees
                                            </span>
                                            <span className="text-slate-900 font-black">
                                                $
                                                {parseFloat(
                                                    order.tax || 0,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                                Order Total
                                            </span>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-[#AD0100] block leading-none tracking-tight">
                                                    $
                                                    {parseFloat(
                                                        order.total_amount,
                                                    ).toFixed(2)}
                                                </span>
                                                <span className="text-[8px] text-slate-300 font-black uppercase tracking-tighter">
                                                    USD Currency
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Info & Logistics */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4 uppercase tracking-widest">
                                    <Info className="w-4 h-4 text-[#AD0100]" />
                                    Review Details
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <MapPin
                                                size={12}
                                                className="text-[#AD0100]"
                                            />{" "}
                                            Destination
                                        </label>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-[12px] text-slate-600 leading-relaxed font-bold italic">
                                            {order.shipping_address ||
                                                "Default account address."}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <CreditCard
                                                size={12}
                                                className="text-[#AD0100]"
                                            />{" "}
                                            Settlement
                                        </label>
                                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                    Status
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${order.payment?.status === "succeeded" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                                                >
                                                    {order.payment?.status ||
                                                        "Pending"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-t border-slate-50">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                    Txn ID
                                                </span>
                                                <span className="text-[9px] font-mono font-bold text-slate-500 truncate max-w-[100px]">
                                                    {order.payment
                                                        ?.transaction_id ||
                                                        "LOCAL-REF"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {order.notes && (
                                        <div className="p-4 bg-blue-50/20 rounded-2xl border border-blue-100/50">
                                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-2">
                                                <Info size={12} /> Memo
                                            </p>
                                            <p className="text-[12px] text-slate-600 leading-relaxed font-bold">
                                                "{order.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Need Help? */}
                            <div className="p-6 bg-slate-900 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <ShoppingCart size={100} />
                                </div>
                                <h4 className="text-lg font-black mb-1 relative z-10 tracking-tight italic">
                                    Assistance?
                                </h4>
                                <p className="text-white/60 text-[11px] font-medium mb-5 relative z-10">
                                    Our support team is available 24/7 if you
                                    have questions.
                                </p>
                                <Link
                                    href={route("contact.index")}
                                    className="inline-flex items-center gap-4 bg-[#AD0100] text-white pl-6 pr-1 py-1 rounded-full font-black text-[10px] hover:bg-red-800 transition-all active:scale-95 group relative z-10 uppercase tracking-widest"
                                >
                                    <span className="italic">Contact</span>
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        >
                                            <line
                                                x1="7"
                                                y1="17"
                                                x2="17"
                                                y2="7"
                                            ></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <UserLayout children={page} />;
