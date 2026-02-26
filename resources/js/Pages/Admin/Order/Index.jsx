import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import {
    ShoppingCart,
    Search,
    Eye,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Package,
    Calendar,
    ChevronDown,
    MapPin,
    CreditCard,
    Printer,
    Home,
    Ship as ShipIcon,
    X,
    Trash2,
} from "lucide-react";
import { TableManager } from "@/Hooks/TableManager";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";

export default function Index({ orders, filters, counts = {} }) {
    const {
        search,
        handleSearch,
        isLoading,
        selectedIds,
        toggleSelectAll,
        toggleSelect,
        selectAllGlobal,
        setSelectAllGlobal,
        clearSelection,
    } = TableManager("admin.orders.index", orders.data, {
        ...filters,
        only: ["orders", "counts"],
    });

    const status = filters.status || "all";

    const handleStatusChange = (newStatus) => {
        router.get(
            route("admin.orders.index"),
            { ...filters, status: newStatus, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getStatusBadge = (status) => {
        const config = {
            processing: {
                classes: "bg-amber-50 text-amber-700 border-amber-100",
                dot: "bg-amber-500",
                icon: <Package size={12} />,
            },
            fulfilled: {
                classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
                dot: "bg-emerald-500",
                icon: <CheckCircle2 size={12} />,
            },
            canceled: {
                classes: "bg-rose-50 text-rose-700 border-rose-100",
                dot: "bg-rose-500",
                icon: <XCircle size={12} />,
            },
        };
        const theme = config[status?.toLowerCase()] || {
            classes: "bg-slate-100 text-slate-600 border-slate-200",
            dot: "bg-slate-400",
            icon: <Clock size={12} />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${theme.classes}`}
            >
                <span
                    className={`inline-flex rounded-full h-1.5 w-1.5 ${theme.dot}`}
                ></span>
                {status}
            </span>
        );
    };

    const getOrderTypeBadge = (type) => {
        const config = {
            "Pick up": {
                classes: "bg-blue-50 text-blue-700 border-blue-100",
                icon: <Home size={10} />,
            },
            Delivery: {
                classes: "bg-purple-50 text-purple-700 border-purple-100",
                icon: <Truck size={10} />,
            },
            Ship: {
                classes: "bg-cyan-50 text-cyan-700 border-cyan-100",
                icon: <ShipIcon size={10} />,
            },
        };
        const theme = config[type] || {
            classes: "bg-slate-50 text-slate-700 border-slate-100",
            icon: <Package size={10} />,
        };

        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.classes}`}
            >
                {theme.icon}
                {type}
            </span>
        );
    };

    const isDataLoading = isLoading && orders.data.length > 0;
    const isAllPageSelected =
        orders.data.length > 0 &&
        (selectAllGlobal ||
            orders.data.every((p) => selectedIds.includes(p.id)));

    return (
        <AdminLayout>
            <Head title="Orders" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            Orders
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Manage all paid customer orders.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-4 px-1 text-sm border-b border-slate-200 overflow-x-auto custom-scrollbar whitespace-nowrap scroll-smooth">
                    {[
                        {
                            id: "all",
                            label: "All Paid Orders",
                            count: counts.all,
                        },
                        {
                            id: "Processing",
                            label: "Processing",
                            count: counts.Processing,
                        },
                        {
                            id: "Fulfilled",
                            label: "Fulfilled",
                            count: counts.Fulfilled,
                        },
                        {
                            id: "Canceled",
                            label: "Canceled",
                            count: counts.Canceled,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleStatusChange(tab.id)}
                            className={`pb-3 transition-all relative font-semibold text-[13px] flex-shrink-0 ${status === tab.id ? "text-[#FF9F43]" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {tab.label}{" "}
                            <span className="ml-1 text-slate-400 font-medium">
                                ({tab.count?.toLocaleString() || 0})
                            </span>
                            {status === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
                    {/* Linear Progress Bar */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF9F43]/10 overflow-hidden z-20">
                            <div className="h-full bg-[#FF9F43] animate-progress-indeterminate w-1/3 rounded-full" />
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-100 gap-4">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            <div className="relative w-full max-w-sm">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    placeholder="Search order number or customer..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-[13px] focus:bg-white focus:ring-2 focus:ring-[#FF9F43]/10 transition-all outline-none border focus:border-[#FF9F43]"
                                />
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {(selectedIds.length > 0 || selectAllGlobal) && (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={clearSelection}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <ConfirmBulkDelete
                                    selectedIds={selectedIds}
                                    selectAllGlobal={selectAllGlobal}
                                    totalCount={orders.total}
                                    search={search}
                                    filters={{ status: filters.status }}
                                    routeName="admin.orders.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div
                        className={`transition-all duration-300 overflow-hidden ${isAllPageSelected && !selectAllGlobal && orders.total > orders.data.length ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                        <div className="bg-[#FF9F43]/5 border-b border-[#FF9F43]/10 px-6 py-3 text-[13px] text-[#e68a30] flex items-center justify-center gap-2">
                            <span>
                                All <b>{orders.data.length}</b> orders on this
                                page are selected.
                            </span>
                            <button
                                onClick={() => setSelectAllGlobal(true)}
                                className="font-bold underline"
                            >
                                Select all {orders.total.toLocaleString()}
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1200px]">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-3 px-6 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllPageSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] cursor-pointer"
                                        />
                                    </th>
                                    <th className="py-3 px-6">Order ID</th>
                                    <th className="py-3 px-6">
                                        Customer & Address
                                    </th>
                                    <th className="py-3 px-6">Order Type</th>
                                    <th className="py-3 px-6 text-center">
                                        Items
                                    </th>
                                    <th className="py-3 px-6">Amount</th>
                                    <th className="py-3 px-6 text-center">
                                        Status
                                    </th>
                                    <th className="py-3 px-6 text-right pr-10">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody
                                className={`divide-y divide-slate-50 transition-all duration-300 ${
                                    isDataLoading
                                        ? "opacity-40 grayscale-[0.5] pointer-events-none"
                                        : "opacity-100"
                                }`}
                            >
                                {orders.data.map((order) => {
                                    const isSelected =
                                        selectedIds.includes(order.id) ||
                                        selectAllGlobal;
                                    return (
                                        <tr
                                            key={order.id}
                                            className={`${isSelected ? "bg-[#FF9F43]/5" : "hover:bg-slate-50/30"} transition-all duration-150 group`}
                                        >
                                            <td className="py-4 px-6 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        toggleSelect(order.id)
                                                    }
                                                    className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800 tracking-tight mb-0.5">
                                                        {order.order_number}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                                        <Calendar
                                                            size={12}
                                                            className="opacity-60"
                                                        />
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-slate-800 text-[13px] leading-snug mb-0.5 line-clamp-1">
                                                        {order.user.first_name}{" "}
                                                        {order.user.last_name}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-1">
                                                        <MapPin
                                                            size={10}
                                                            className="text-slate-300"
                                                        />
                                                        <span className="truncate max-w-[200px]">
                                                            {order.shipping_address ||
                                                                "No address provided"}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 font-medium truncate">
                                                        {order.user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {getOrderTypeBadge(
                                                    order.order_type,
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center justify-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-bold">
                                                    {order.items_count} items
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-slate-800 font-black text-[14px] tracking-tight">
                                                        $
                                                        {parseFloat(
                                                            order.total_amount,
                                                        ).toFixed(2)}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium tracking-wide capitalized">
                                                        USD Currency
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="py-4 px-6 text-right pr-6 whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2 px-6">
                                                    <Link
                                                        href={
                                                            route(
                                                                "admin.orders.invoice",
                                                                order.id,
                                                            ) + "?print=1"
                                                        }
                                                        target="_blank"
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-[#FF9F43]/10 hover:text-[#FF9F43] transition-all border border-transparent hover:border-slate-200"
                                                        title="Print Invoice"
                                                    >
                                                        <Printer size={16} />
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.orders.show",
                                                            order.id,
                                                        )}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-[#FF9F43]/10 hover:text-[#FF9F43] transition-all border border-transparent hover:border-slate-200"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <ConfirmDelete
                                                        id={order.id}
                                                        routeName="admin.orders.destroy"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-20 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                                    <ShoppingCart
                                                        size={24}
                                                        className="text-slate-300"
                                                    />
                                                </div>
                                                <h3 className="text-slate-800 font-bold text-[15px]">
                                                    No orders found
                                                </h3>
                                                <p className="text-slate-400 text-[13px] mt-1 max-w-[240px]">
                                                    We couldn't find any paid
                                                    orders matching your current
                                                    criteria.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                        <Pagination meta={orders} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
