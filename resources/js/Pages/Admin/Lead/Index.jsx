import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { TableManager } from "@/Hooks/TableManager";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";
import {
    Users,
    Plus,
    Search,
    Eye,
    Package,
    Pencil,
    FileText,
    Phone,
    ChevronUp,
    ChevronDown,
    MapPin,
    Hash,
    MoreVertical,
    Filter,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";

export default function Index({
    leads,
    filters = {},
    users = [],
    cities = [],
}) {
    const {
        search,
        handleSearch,
        isLoading,
        loadingType,
        selectedIds,
        toggleSelectAll,
        toggleSelect,
        selectAllGlobal,
        setSelectAllGlobal,
        clearSelection,
    } = TableManager("admin.leads.index", leads.data, {
        ...filters,
        only: ["leads"],
    });

    const isAllPageSelected =
        leads.data.length > 0 &&
        (selectAllGlobal ||
            leads.data.every((p) => selectedIds.includes(p.id)));

    // Sorting & Filtering State
    const currentSort = filters.sort || "created_at";
    const currentDirection = filters.direction || "desc";
    const currentStatus = filters.status || "all";
    const currentUser = filters.user_id || "all";
    const currentCity = filters.city || "all";

    const updateParams = (newParams) => {
        router.get(
            route("admin.leads.index"),
            {
                ...filters,
                ...newParams,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSort = (column) => {
        const newDirection =
            currentSort === column && currentDirection === "asc"
                ? "desc"
                : "asc";
        updateParams({ sort: column, direction: newDirection });
    };

    const handleFilterChange = (key, value) => {
        updateParams({ [key]: value, page: 1 });
    };

    const handleClearFilters = () => {
        router.get(route("admin.leads.index"));
    };

    const SortIcon = ({ column }) => {
        if (currentSort !== column)
            return (
                <div className="w-3 h-3 opacity-20">
                    <ChevronUp size={12} />
                </div>
            );
        return currentDirection === "asc" ? (
            <ChevronUp size={12} className="text-[#FF9F43]" />
        ) : (
            <ChevronDown size={12} className="text-[#FF9F43]" />
        );
    };

    return (
        <AdminLayout>
            <Head title="Lead Management" />

            <div className="font-sans px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight truncate">
                            Leads
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-[13px] md:text-sm mt-1 font-medium italic truncate">
                            Monitor and optimize your leads pipeline in
                            real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={route("admin.leads.create")}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 bg-[#FF9F43] text-white text-xs sm:text-[13px] font-bold rounded-lg hover:bg-[#e68a30] transition-all duration-200 shadow-lg shadow-[#FF9F43]/20 active:scale-[0.98] whitespace-nowrap"
                        >
                            <Plus size={14} className="mr-1.5 sm:mr-2" />
                            <span className="hidden sm:inline">
                                Add New Lead
                            </span>
                            <span className="sm:hidden">Add Lead</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="sm:hidden mb-4">
                    <details className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <summary className="px-4 py-3 flex items-center justify-between text-slate-700 font-bold text-sm cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Filter size={16} />
                                <span>Filters</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className="transition-transform"
                            />
                        </summary>
                        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-slate-100">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">
                                    Status
                                </label>
                                <select
                                    value={currentStatus}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "status",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Quote">Quote</option>
                                    <option value="Processing">
                                        Processing
                                    </option>
                                    <option value="Fulfilled">Fulfilled</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">
                                    Employee
                                </label>
                                <select
                                    value={currentUser}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "user_id",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 outline-none"
                                >
                                    <option value="all">All Employees</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">
                                    City
                                </label>
                                <select
                                    value={currentCity}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "city",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 outline-none"
                                >
                                    <option value="all">All Cities</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(search ||
                                currentStatus !== "all" ||
                                currentUser !== "all" ||
                                currentCity !== "all") && (
                                <button
                                    onClick={handleClearFilters}
                                    className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </details>
                </div>

                {/* Filter & Action Tool Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
                    {/* Global Page Select Banner */}
                    <div
                        className={`transition-all duration-300 overflow-hidden ${isAllPageSelected && !selectAllGlobal && leads.total > leads.data.length ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                        <div className="bg-[#FF9F43]/5 border-b border-[#FF9F43]/10 px-4 sm:px-6 py-3 text-xs sm:text-[13px] text-[#e68a30] flex items-center justify-center gap-2 flex-wrap text-center">
                            <span>All items on this page are selected.</span>
                            <button
                                onClick={() => setSelectAllGlobal(true)}
                                className="font-bold underline decoration-[#FF9F43]/40 hover:text-[#e68a30] whitespace-nowrap"
                            >
                                Select all {leads.total.toLocaleString()} leads
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                {/* Search Box */}
                                <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400 pointer-events-none">
                                        {isLoading &&
                                        loadingType === "search" ? (
                                            <div className="w-4 h-4 border-2 border-[#FF9F43] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Search size={16} />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        placeholder="Search by shop, name, part..."
                                        className="w-full pl-10 pr-4 py-2 sm:py-[9px] bg-slate-50 border-slate-200 rounded-lg text-sm sm:text-[13px] focus:bg-white focus:ring-2 focus:ring-[#FF9F43]/10 transition-all outline-none border focus:border-[#FF9F43] placeholder:text-slate-400 font-medium"
                                    />
                                </div>

                                {/* Desktop Dropdowns */}
                                <div className="hidden sm:flex flex-wrap items-center gap-2">
                                    <FilterSelect
                                        value={currentStatus}
                                        onChange={(v) =>
                                            handleFilterChange("status", v)
                                        }
                                        options={[
                                            { id: "all", name: "All Status" },
                                            { id: "Quote", name: "Quote" },
                                            {
                                                id: "Processing",
                                                name: "Processing",
                                            },
                                            {
                                                id: "Fulfilled",
                                                name: "Fulfilled",
                                            },
                                        ]}
                                    />
                                    <FilterSelect
                                        value={currentUser}
                                        onChange={(v) =>
                                            handleFilterChange("user_id", v)
                                        }
                                        options={[
                                            {
                                                id: "all",
                                                name: "All Employees",
                                            },
                                            ...users,
                                        ]}
                                    />
                                    <FilterSelect
                                        value={currentCity}
                                        onChange={(v) =>
                                            handleFilterChange("city", v)
                                        }
                                        options={[
                                            { id: "all", name: "All Cities" },
                                            ...cities.map((c) => ({
                                                id: c,
                                                name: c,
                                            })),
                                        ]}
                                    />
                                </div>

                                {/* Clear Trigger */}
                                <div className="hidden sm:block">
                                    {(search ||
                                        currentStatus !== "all" ||
                                        currentUser !== "all" ||
                                        currentCity !== "all") && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-xs font-black text-[#FF9F43] hover:text-[#e68a30] transition-colors whitespace-nowrap px-2 uppercase tracking-wider"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Bulk Actions */}
                            {(selectedIds.length > 0 || selectAllGlobal) && (
                                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                    <button
                                        onClick={clearSelection}
                                        className="text-xs font-bold text-slate-400 hover:text-slate-600 whitespace-nowrap"
                                    >
                                        Deselect ({selectedIds.length})
                                    </button>
                                    <ConfirmBulkDelete
                                        selectedIds={selectedIds}
                                        selectAllGlobal={selectAllGlobal}
                                        totalCount={leads.total}
                                        search={search}
                                        filters={{
                                            status: filters.status,
                                            user_id: filters.user_id,
                                            city: filters.city,
                                        }}
                                        routeName="admin.leads.bulk-destroy"
                                        onSuccess={clearSelection}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Compact Table View */}
                <div className="sm:hidden space-y-4">
                    {leads.data && leads.data.length > 0 ? (
                        leads.data.map((lead) => (
                            <div
                                key={lead.id}
                                className={`bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm ${selectedIds.includes(lead.id) || selectAllGlobal ? "bg-[#FF9F43]/5 border-[#FF9F43]/20" : ""}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedIds.includes(lead.id) ||
                                                selectAllGlobal
                                            }
                                            onChange={() =>
                                                toggleSelect(lead.id)
                                            }
                                            className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43]"
                                        />
                                        <div
                                            className={`
                                        px-2 py-1 rounded-lg text-[10px] font-black border
                                        ${
                                            lead.status === "Quote"
                                                ? "bg-amber-50 border-amber-100 text-amber-600"
                                                : lead.status === "Processing"
                                                  ? "bg-rose-50 border-rose-100 text-rose-600"
                                                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                        }
                                    `}
                                        >
                                            {lead.status?.toUpperCase() ||
                                                "QUOTE"}
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-slate-500">
                                        {new Date(
                                            lead.created_at,
                                        ).toLocaleDateString(undefined, {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm truncate">
                                            {lead.shop_name}
                                        </div>
                                        <div className="text-xs text-slate-500 font-medium">
                                            {lead.name}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
                                                {lead.user?.first_name?.charAt(
                                                    0,
                                                ) || "S"}
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">
                                                {lead.user?.first_name ||
                                                    "System"}
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400">
                                            {lead.city || "N/A"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                        <Phone
                                            size={12}
                                            className="text-[#FF9F43]"
                                        />
                                        <a
                                            href={`tel:${lead.contact_number}`}
                                            className="underline decoration-slate-200 hover:decoration-[#FF9F43]"
                                        >
                                            {lead.contact_number}
                                        </a>
                                    </div>

                                    <div className="text-xs font-medium text-slate-600 line-clamp-2">
                                        {lead.vehicle_info || "No vehicle info"}
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {lead.vendors
                                            ?.split(",")
                                            .slice(0, 2)
                                            .map((v, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] font-black px-2 py-0.5 bg-white text-slate-400 rounded-md border border-slate-100"
                                                >
                                                    {v.trim()}
                                                </span>
                                            ))}
                                        {lead.vendors?.split(",").length >
                                            2 && (
                                            <span className="text-[10px] font-black px-2 py-0.5 bg-white text-slate-400 rounded-md border border-slate-100">
                                                +
                                                {lead.vendors.split(",")
                                                    .length - 2}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <div className="text-xs font-bold text-slate-500">
                                                Economics
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-300 line-through">
                                                    $
                                                    {parseFloat(
                                                        lead.total_buy || 0,
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="text-sm font-black text-[#FF9F43]">
                                                    $
                                                    {parseFloat(
                                                        lead.total_sell || 0,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                                            <Hash
                                                size={10}
                                                className="text-[#FF9F43]"
                                            />
                                            {lead.lead_number ||
                                                `INV-${String(lead.id).padStart(5, "0")}`}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <Link
                                            href={route(
                                                "admin.leads.show",
                                                lead.id,
                                            )}
                                            className="text-xs font-bold text-[#FF9F43] hover:text-[#e68a30] flex items-center gap-1"
                                        >
                                            <Eye size={14} /> View
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.leads.edit",
                                                lead.id,
                                            )}
                                            className="text-xs font-bold text-slate-600 hover:text-[#FF9F43] flex items-center gap-1"
                                        >
                                            <Pencil size={14} /> Edit
                                        </Link>
                                        <Link
                                            href={route(
                                                "admin.leads.invoice",
                                                lead.id,
                                            )}
                                            className="text-xs font-bold text-slate-600 hover:text-[#FF9F43] flex items-center gap-1"
                                        >
                                            <FileText size={14} /> Invoice
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <Search size={40} className="opacity-20" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800 text-lg">
                                        No leads found
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Try adjusting your filters or search
                                        terms.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-5 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-xs hover:bg-[#FF9F43]/10 hover:text-[#FF9F43] transition-all"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Table Interface */}
                <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 font-bold text-[10px] sm:text-[9px] uppercase tracking-widest border-b border-slate-100">
                                    <th className="py-4 px-4 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllPageSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] cursor-pointer shadow-sm"
                                        />
                                    </th>

                                    <th
                                        className="py-4 px-4 whitespace-nowrap cursor-pointer hover:bg-slate-100/80 transition-colors"
                                        onClick={() => handleSort("date")}
                                    >
                                        <div className="flex items-center gap-1.5 text-slate-800">
                                            Date <SortIcon column="date" />
                                        </div>
                                    </th>

                                    <th
                                        className="py-4 px-4 whitespace-nowrap cursor-pointer hover:bg-slate-100/80 transition-colors"
                                        onClick={() => handleSort("created_by")}
                                    >
                                        <div className="flex items-center gap-1.5 text-slate-800">
                                            Assignee{" "}
                                            <SortIcon column="created_by" />
                                        </div>
                                    </th>

                                    <th
                                        className="py-4 px-4 whitespace-nowrap cursor-pointer hover:bg-slate-100/80 transition-colors text-center"
                                        onClick={() => handleSort("status")}
                                    >
                                        <div className="flex items-center justify-center gap-1.5 text-slate-800">
                                            State <SortIcon column="status" />
                                        </div>
                                    </th>

                                    <th
                                        className="py-4 px-4 whitespace-nowrap cursor-pointer hover:bg-slate-100/80 transition-colors"
                                        onClick={() => handleSort("shop_name")}
                                    >
                                        <div className="flex items-center gap-1.5 text-slate-800">
                                            Business{" "}
                                            <SortIcon column="shop_name" />
                                        </div>
                                    </th>

                                    <th className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-slate-800">
                                                Contact & City
                                            </span>
                                            <span className="text-[8px] font-medium text-slate-400 normal-case italic hidden lg:inline">
                                                Connectivity details
                                            </span>
                                        </div>
                                    </th>

                                    <th className="py-4 px-4 text-slate-800 hidden lg:table-cell">
                                        Vehicle Specs
                                    </th>

                                    <th className="py-4 px-4 text-slate-800 hidden xl:table-cell">
                                        Vendor
                                    </th>

                                    <th
                                        className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/80 transition-colors"
                                        onClick={() => handleSort("buy")}
                                    >
                                        <div className="flex flex-col items-center gap-0.5 text-slate-800">
                                            <div className="flex items-center gap-1.5">
                                                Economics{" "}
                                                <SortIcon column="buy" />
                                            </div>
                                            <span className="text-[8px] font-medium text-slate-400 normal-case italic hidden lg:inline">
                                                Cost vs Revenue
                                            </span>
                                        </div>
                                    </th>

                                    <th className="py-4 px-6 text-right text-slate-800">
                                        Management
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {leads.data && leads.data.length > 0 ? (
                                    leads.data.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className={`
                                        ${selectedIds.includes(lead.id) || selectAllGlobal ? "bg-[#FF9F43]/5" : "hover:bg-slate-50/50"} 
                                        transition-all text-xs sm:text-[10px] group
                                    `}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedIds.includes(
                                                            lead.id,
                                                        ) || selectAllGlobal
                                                    }
                                                    onChange={() =>
                                                        toggleSelect(lead.id)
                                                    }
                                                    className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] cursor-pointer"
                                                />
                                            </td>

                                            <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-900">
                                                {new Date(
                                                    lead.created_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    },
                                                )}
                                            </td>

                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8.5px] font-black text-slate-500">
                                                        {lead.user?.first_name?.charAt(
                                                            0,
                                                        ) || "S"}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">
                                                        {lead.user
                                                            ?.first_name ||
                                                            "System"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 whitespace-nowrap text-center">
                                                <div
                                                    className={`
                                                inline-flex items-center px-1.5 py-0.5 rounded-lg text-[8.5px] font-black border
                                                ${
                                                    lead.status === "Quote"
                                                        ? "bg-amber-50 border-amber-100 text-amber-600"
                                                        : lead.status ===
                                                            "Processing"
                                                          ? "bg-rose-50 border-rose-100 text-rose-600"
                                                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                                }
                                            `}
                                                >
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${lead.status === "Quote" ? "bg-amber-400" : lead.status === "Processing" ? "bg-rose-400" : "bg-emerald-400"}`}
                                                    />
                                                    {lead.status?.toUpperCase() ||
                                                        "QUOTE"}
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span
                                                        className="font-black text-[#1e40af] uppercase tracking-tighter text-[10.5px] line-clamp-1 truncate"
                                                        title={lead.shop_name}
                                                    >
                                                        {lead.shop_name}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-500">
                                                        {lead.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-slate-700 font-bold group-hover:text-[#FF9F43] transition-colors">
                                                        <Phone
                                                            size={11}
                                                            className="text-[#FF9F43]"
                                                        />
                                                        <a
                                                            href={`tel:${lead.contact_number}`}
                                                            className="underline decoration-slate-200 underline-offset-2 hover:decoration-[#FF9F43]"
                                                        >
                                                            {
                                                                lead.contact_number
                                                            }
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-400 mt-1 uppercase">
                                                        <MapPin
                                                            size={8}
                                                            className="text-slate-300"
                                                        />{" "}
                                                        {lead.city || "N/A"}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 hidden lg:table-cell">
                                                <div className="flex items-start gap-2 max-w-[180px]">
                                                    <Package
                                                        size={14}
                                                        className="mt-1 text-slate-400 shrink-0"
                                                    />
                                                    <span
                                                        className="font-bold text-slate-800 leading-snug line-clamp-2"
                                                        title={
                                                            lead.vehicle_info
                                                        }
                                                    >
                                                        {lead.vehicle_info ||
                                                            "---"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 hidden xl:table-cell">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {lead.vendors
                                                        ?.split(",")
                                                        .map((v, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-[9px] font-black px-2 py-0.5 bg-white text-slate-400 rounded-md border border-slate-100 uppercase shadow-sm"
                                                            >
                                                                {v.trim()}
                                                            </span>
                                                        ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-slate-400 line-through">
                                                            $
                                                            {parseFloat(
                                                                lead.total_buy ||
                                                                    0,
                                                            ).toLocaleString()}
                                                        </span>
                                                        <span className="text-sm font-semibold text-[#FF9F43]">
                                                            $
                                                            {parseFloat(
                                                                lead.total_sell ||
                                                                    0,
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-700 flex items-center gap-1">
                                                        <Hash
                                                            size={10}
                                                            className="text-slate-400"
                                                        />
                                                        {lead.lead_number ||
                                                            `INV-${String(lead.id).padStart(5, "0")}`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 transition-all outline-none border border-transparent hover:border-[#FF9F43]/10">
                                                            <MoreVertical
                                                                size={16}
                                                            />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-32 bg-white border border-slate-100 shadow-xl rounded-xl p-1.5"
                                                        >
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "admin.leads.show",
                                                                        lead.id,
                                                                    )}
                                                                    className="flex items-center gap-2 px-2 py-2 text-[10.5px] font-bold text-slate-600 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 rounded-lg transition-colors cursor-pointer"
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-slate-400"
                                                                    />{" "}
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "admin.leads.edit",
                                                                        lead.id,
                                                                    )}
                                                                    className="flex items-center gap-2 px-2 py-2 text-[10.5px] font-bold text-slate-600 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 rounded-lg transition-colors cursor-pointer"
                                                                >
                                                                    <Pencil
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-slate-400"
                                                                    />{" "}
                                                                    Edit Lead
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "admin.leads.invoice",
                                                                        lead.id,
                                                                    )}
                                                                    className="flex items-center gap-2 px-2 py-2 text-[10.5px] font-bold text-slate-600 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 rounded-lg transition-colors cursor-pointer"
                                                                >
                                                                    <FileText
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-slate-400"
                                                                    />{" "}
                                                                    Invoice
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <div className="h-px bg-slate-100 my-1" />
                                                            <div className="px-2 py-1">
                                                                <ConfirmDelete
                                                                    id={lead.id}
                                                                    routeName="admin.leads.destroy"
                                                                    variant="dropdown"
                                                                />
                                                            </div>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="14"
                                            className="py-32 text-center bg-white"
                                        >
                                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center border-2 border-dashed border-slate-100">
                                                    <Search
                                                        size={48}
                                                        className="opacity-20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-slate-800 text-xl">
                                                        Lead not found
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-400">
                                                        Try adjusting your
                                                        filters or search terms.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-[11px] uppercase hover:bg-[#FF9F43]/10 hover:text-[#FF9F43] transition-all"
                                                >
                                                    Clear All Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 sm:p-5 border-t border-slate-50 bg-slate-50/10">
                        <Pagination meta={leads} />
                    </div>
                </div>

                {/* Mobile Pagination */}
                {leads.data && leads.data.length > 0 && (
                    <div className="sm:hidden mt-6">
                        <Pagination meta={leads} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

const FilterSelect = ({ value, onChange, options }) => (
    <div className="relative group">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-[40px] pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm sm:text-[13px] font-bold text-slate-600 focus:bg-white focus:border-[#FF9F43] focus:ring-4 focus:ring-[#FF9F43]/5 outline-none transition-all cursor-pointer hover:bg-slate-100 appearance-none min-w-[140px]"
        >
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                    {opt.name}
                </option>
            ))}
        </select>
        <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors"
        />
    </div>
);
