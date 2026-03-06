import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { cn } from "@/lib/utils";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Search,
    Trash2,
    Mail,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    MoreVertical,
    Plus,
    Calendar,
    ChevronDown,
    Eye,
    FileText,
    X,
    Phone,
} from "lucide-react";
import { TableManager } from "@/hooks/TableManager";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";
import Pagination from "@/Components/Pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

export default function Index({ tickets, filters, counts = {} }) {
    const {
        search,
        handleSearch,
        isLoading,
        handleFilterChange,
        currentFilters: filter,
        selectedIds,
        toggleSelectAll,
        toggleSelect,
        selectAllGlobal,
        setSelectAllGlobal,
        clearSelection,
    } = TableManager("admin.support.index", tickets.data, {
        ...filters,
        only: ["tickets", "counts"],
    });

    const [selectedTicket, setSelectedTicket] = useState(null);
    const { patch, delete: destroy } = useForm();

    const currentStatus = filter.status || "all";

    const handleStatusChange = (status) =>
        handleFilterChange({ status: status === "all" ? null : status });

    const handleStatusUpdate = (ticketId, newStatus) => {
        router.patch(
            route("admin.support.status.update", ticketId),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (ticketId) => {
        destroy(route("admin.support.destroy", ticketId), {
            preserveScroll: true,
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "pending":
                return {
                    bg: "bg-amber-50",
                    text: "text-amber-700",
                    border: "border-amber-100",
                    dot: "bg-amber-500",
                    icon: <Clock size={12} />,
                };
            case "in_progress":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-700",
                    border: "border-blue-100",
                    dot: "bg-blue-500",
                    icon: <AlertCircle size={12} />,
                };
            case "resolved":
                return {
                    bg: "bg-emerald-50",
                    text: "text-emerald-700",
                    border: "border-emerald-100",
                    dot: "bg-emerald-500",
                    icon: <CheckCircle size={12} />,
                };
            case "closed":
                return {
                    bg: "bg-slate-100",
                    text: "text-slate-600",
                    border: "border-slate-200",
                    dot: "bg-slate-400",
                    icon: <XCircle size={12} />,
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    border: "border-gray-200",
                    dot: "bg-gray-400",
                    icon: <Clock size={12} />,
                };
        }
    };

    const isAllPageSelected =
        tickets.data.length > 0 &&
        (selectAllGlobal ||
            tickets.data.every((t) => selectedIds.includes(t.id)));

    return (
        <AdminLayout>
            <Head title="Support Tickets" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Support Tickets
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Manage and respond to user inquiries.
                        </p>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-6 mb-4 px-1 text-sm border-b border-slate-200 overflow-x-auto custom-scrollbar whitespace-nowrap scroll-smooth">
                    {[
                        { id: "all", label: "All Tickets", count: counts.all },
                        {
                            id: "pending",
                            label: "Pending",
                            count: counts.pending,
                        },
                        {
                            id: "in_progress",
                            label: "In Progress",
                            count: counts.in_progress,
                        },
                        {
                            id: "resolved",
                            label: "Resolved",
                            count: counts.resolved,
                        },
                        { id: "closed", label: "Closed", count: counts.closed },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleStatusChange(tab.id)}
                            disabled={isLoading}
                            className={`pb-3 transition-all relative font-semibold text-[13px] flex-shrink-0 ${currentStatus === tab.id ? "text-[#FF9F43]" : "text-slate-500 hover:text-slate-700"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {tab.label}{" "}
                            <span className="ml-1 text-slate-400 font-medium">
                                ({tab.count || 0})
                            </span>
                            {currentStatus === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
                    {/* Linear Progress Bar */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF9F43]/10 overflow-hidden z-20">
                            <div className="h-full bg-[#FF9F43] animate-progress-indeterminate w-1/3 rounded-full" />
                        </div>
                    )}

                    {isAllPageSelected &&
                        !selectAllGlobal &&
                        tickets.total > tickets.data.length && (
                            <div className="bg-[#FF9F43]/10 border-b border-[#FF9F43]/20 px-6 py-3 text-[13px] text-[#e68a30] flex items-center justify-center gap-2">
                                <span>
                                    All <b>{tickets.data.length}</b> tickets on
                                    this page are selected.
                                </span>
                                <button
                                    onClick={() => setSelectAllGlobal(true)}
                                    className="font-bold underline"
                                >
                                    Select all {tickets.total}
                                </button>
                            </div>
                        )}

                    {/* Search and Bulk Actions */}
                    <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-100 gap-4">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            <div className="relative w-full max-w-sm">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-[13px] focus:bg-white focus:ring-2 focus:ring-[#FF9F43]/10 transition-all outline-none border focus:border-[#FF9F43]"
                                />
                            </div>
                        </div>

                        {(selectedIds.length > 0 || selectAllGlobal) && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearSelection}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 text-[13px] font-medium transition-colors"
                                >
                                    Deselect All
                                </button>
                                <ConfirmBulkDelete
                                    selectedIds={selectedIds}
                                    selectAllGlobal={selectAllGlobal}
                                    totalCount={tickets.total}
                                    search={search}
                                    routeName="admin.support.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-3 px-6 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllPageSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all"
                                        />
                                    </th>
                                    <th className="py-3 px-4 uppercase tracking-widest text-[11px]">
                                        Requester
                                    </th>
                                    <th className="py-3 px-4 uppercase tracking-widest text-[11px] w-[20%]">
                                        Subject & Order ID
                                    </th>
                                    <th className="py-3 px-4 uppercase tracking-widest text-[11px] w-[25%]">
                                        Message
                                    </th>
                                    <th className="py-3 px-4 uppercase tracking-widest text-[11px]">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 uppercase tracking-widest text-[11px]">
                                        Date
                                    </th>
                                    <th className="py-3 px-4 text-right pr-10 uppercase tracking-widest text-[11px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-slate-50 transition-all duration-300 ${isLoading && tickets.data.length > 0 ? "opacity-40 grayscale-[0.5] pointer-events-none" : "opacity-100"}`}
                            >
                                {tickets.data.length > 0 ? (
                                    tickets.data.map((ticket) => {
                                        const status = getStatusStyle(
                                            ticket.status,
                                        );
                                        return (
                                            <tr
                                                key={ticket.id}
                                                className={`${selectedIds.includes(ticket.id) || selectAllGlobal ? "bg-[#FF9F43]/5" : "hover:bg-slate-50/30"} transition-all duration-150`}
                                            >
                                                <td className="py-4 px-6 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedIds.includes(
                                                                ticket.id,
                                                            ) || selectAllGlobal
                                                        }
                                                        onChange={() =>
                                                            toggleSelect(
                                                                ticket.id,
                                                            )
                                                        }
                                                        className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all"
                                                    />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                                                            <User size={18} />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-[13px] font-bold text-slate-800 line-clamp-1">
                                                                {
                                                                    ticket.first_name
                                                                }{" "}
                                                                {
                                                                    ticket.last_name
                                                                }
                                                            </span>
                                                            <span className="text-slate-400 text-[11px] font-medium truncate">
                                                                {ticket.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div
                                                        className="flex flex-col cursor-pointer group"
                                                        onClick={() =>
                                                            setSelectedTicket(
                                                                ticket,
                                                            )
                                                        }
                                                    >
                                                        <span className="text-[13px] font-semibold text-slate-700 line-clamp-1 group-hover:text-[#FF9F43] transition-colors">
                                                            {ticket.subject}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <span className="text-[11px] text-[#FF9F43] font-mono">
                                                                {ticket.order_id ||
                                                                    "GENERAL"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p
                                                        className="text-[12px] text-slate-500 font-medium line-clamp-1 italic cursor-pointer hover:text-slate-800 transition-colors"
                                                        onClick={() =>
                                                            setSelectedTicket(
                                                                ticket,
                                                            )
                                                        }
                                                    >
                                                        {ticket.message}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.bg} ${status.text} ${status.border}`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                                        />
                                                        {ticket.status.replace(
                                                            "_",
                                                            " ",
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-[12px]">
                                                        <Calendar
                                                            size={13}
                                                            className="opacity-40"
                                                        />
                                                        {new Date(
                                                            ticket.created_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right pr-6">
                                                    <div className="flex justify-end items-center gap-1.5">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedTicket(
                                                                    ticket,
                                                                )
                                                            }
                                                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FF9F43] hover:border-[#FF9F43]/30 transition-all outline-none focus:ring-0"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FF9F43] hover:border-[#FF9F43]/30 transition-all outline-none focus:ring-0">
                                                                    <MoreVertical
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-40 bg-white border border-slate-100 rounded-xl shadow-xl p-1 z-[100]"
                                                            >
                                                                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                                                                    Status
                                                                </div>
                                                                {[
                                                                    {
                                                                        id: "pending",
                                                                        label: "Pending",
                                                                    },
                                                                    {
                                                                        id: "in_progress",
                                                                        label: "In Progress",
                                                                    },
                                                                    {
                                                                        id: "resolved",
                                                                        label: "Resolved",
                                                                    },
                                                                    {
                                                                        id: "closed",
                                                                        label: "Closed",
                                                                    },
                                                                ].map((s) => (
                                                                    <DropdownMenuItem
                                                                        key={
                                                                            s.id
                                                                        }
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                ticket.id,
                                                                                s.id,
                                                                            )
                                                                        }
                                                                        className={cn(
                                                                            "flex items-center px-3 py-2 text-[12px] font-semibold rounded-lg cursor-pointer transition-colors focus:outline-none mb-0.5 last:mb-0",
                                                                            ticket.status ===
                                                                                s.id
                                                                                ? "text-[#FF9F43] bg-orange-50"
                                                                                : "text-slate-600 hover:bg-slate-50 focus:bg-slate-50",
                                                                        )}
                                                                    >
                                                                        {
                                                                            s.label
                                                                        }
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <ConfirmDelete
                                                            id={ticket.id}
                                                            routeName="admin.support.destroy"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <XCircle
                                                    size={32}
                                                    className="mb-2 opacity-20"
                                                />
                                                <p className="text-[13px] italic">
                                                    No support tickets found.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                        <Pagination meta={tickets} />
                    </div>
                </div>
            </div>

            {/* Ticket Detail Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#FF9F43]/10 rounded-xl flex items-center justify-center text-[#FF9F43]">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                            Ticket Details
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-medium">
                                            #{selectedTicket.id} &bull; Received
                                            on{" "}
                                            {new Date(
                                                selectedTicket.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                Requester
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                    <User size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-bold text-slate-800">
                                                        {
                                                            selectedTicket.first_name
                                                        }{" "}
                                                        {
                                                            selectedTicket.last_name
                                                        }
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                        {selectedTicket.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                Contact Phone
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                    <Phone size={16} />
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-800">
                                                    {selectedTicket.phone ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                Status
                                            </span>
                                            <div>
                                                {(() => {
                                                    const status =
                                                        getStatusStyle(
                                                            selectedTicket.status,
                                                        );
                                                    return (
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${status.bg} ${status.text} ${status.border}`}
                                                        >
                                                            <span
                                                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                                            />
                                                            {selectedTicket.status
                                                                .replace(
                                                                    "_",
                                                                    " ",
                                                                )
                                                                .toUpperCase()}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                Order ID
                                            </span>
                                            <span className="text-[13px] font-black text-[#FF9F43] font-mono">
                                                {selectedTicket.order_id ||
                                                    "GENERAL INQUIRY"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="flex flex-col mb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Subject
                                        </span>
                                        <h2 className="text-xl font-black text-slate-900 leading-tight">
                                            {selectedTicket.subject}
                                        </h2>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Message
                                        </span>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[150px]">
                                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed whitespace-pre-line italic">
                                                {selectedTicket.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <a
                                        href={`mailto:${selectedTicket.email}`}
                                        className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                                    >
                                        <Mail size={16} /> Reply via Email
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95">
                                                Update Status{" "}
                                                <ChevronDown size={14} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40 bg-white border border-slate-100 rounded-xl shadow-xl p-1 z-[120]"
                                        >
                                            {[
                                                {
                                                    id: "pending",
                                                    label: "Pending",
                                                },
                                                {
                                                    id: "in_progress",
                                                    label: "In Progress",
                                                },
                                                {
                                                    id: "resolved",
                                                    label: "Resolved",
                                                },
                                                {
                                                    id: "closed",
                                                    label: "Closed",
                                                },
                                            ].map((s) => (
                                                <DropdownMenuItem
                                                    key={s.id}
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            selectedTicket.id,
                                                            s.id,
                                                        )
                                                    }
                                                    className={cn(
                                                        "flex items-center px-3 py-2 text-[12px] font-semibold rounded-lg cursor-pointer transition-colors focus:outline-none mb-0.5 last:mb-0",
                                                        selectedTicket.status ===
                                                            s.id
                                                            ? "text-[#FF9F43] bg-orange-50"
                                                            : "text-slate-600 hover:bg-slate-50 focus:bg-slate-50",
                                                    )}
                                                >
                                                    {s.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
