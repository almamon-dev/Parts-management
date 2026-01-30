import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { TableManager } from "@/Hooks/TableManager";
import {
    Users,
    Search,
    Percent,
    DollarSign,
    RefreshCw,
    Phone,
    Mail,
    Building2,
    MapPin,
    Trash2,
} from "lucide-react";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";

export default function Index({ customers, filters = {}, stats }) {
    const [showGlobalModal, setShowGlobalModal] = useState(false);
    const [globalDiscount, setGlobalDiscount] = useState({ rate: "", apply_to: "all" });


    const {
        search,
        handleSearch,
        isLoading,
        loadingType,
        handleClearFilters,
        selectedIds,
        toggleSelect,
        toggleSelectAll,
        selectAllGlobal,
        clearSelection,
    } = TableManager("admin.customers.index", customers.data, {
        ...filters,
        only: ["customers", "stats"],
    });

    const applyGlobalDiscount = (e) => {
        e.preventDefault();
        router.post(route("admin.customers.global-discount"), {
            discount_rate: globalDiscount.rate,
            apply_to: globalDiscount.apply_to,
        }, {
            onSuccess: () => {
                setShowGlobalModal(false);
                setGlobalDiscount({ rate: "", apply_to: "all" });
            },
        });
    };

    const resetDiscount = (customerId) => {
        if (confirm("Are you sure you want to reset this customer's discount?")) {
            router.patch(route("admin.customers.reset-discount", customerId));
        }
    };

    return (
        <AdminLayout>
            <Head title="Customers - B2B" />

            <div className="font-sans">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Customers - B2B
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Manage customer discounts and track purchases
                        </p>
                    </div>

                    <button
                        onClick={() => setShowGlobalModal(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-[#FF9F43] text-white text-[13px] font-bold rounded-lg hover:bg-[#e68a30] transition-all duration-200 shadow-lg shadow-[#FF9F43]/20"
                    >
                        <Percent size={16} className="mr-2" />
                        Apply Global Discount
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Total Customers
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {stats.total_customers}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    With Discount
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {stats.with_discount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Percent className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    ${stats.total_revenue.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50/30">
                        <button
                            onClick={() => router.get(route("admin.customers.index"), {}, { preserveState: true })}
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                                !filters.discount_filter
                                    ? "bg-[#FF9F43] text-white shadow-lg shadow-[#FF9F43]/20"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            All Customers
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
                                {stats.total_customers}
                            </span>
                        </button>
                        <button
                            onClick={() =>
                                router.get(
                                    route("admin.customers.index"),
                                    { discount_filter: "with_discount" },
                                    { preserveState: true }
                                )
                            }
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                                filters.discount_filter === "with_discount"
                                    ? "bg-[#FF9F43] text-white shadow-lg shadow-[#FF9F43]/20"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            With Discount
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
                                {stats.with_discount}
                            </span>
                        </button>
                        <button
                            onClick={() =>
                                router.get(
                                    route("admin.customers.index"),
                                    { discount_filter: "no_discount" },
                                    { preserveState: true }
                                )
                            }
                            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                                filters.discount_filter === "no_discount"
                                    ? "bg-[#FF9F43] text-white shadow-lg shadow-[#FF9F43]/20"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            No Discount
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
                                {stats.total_customers - stats.with_discount}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border-b border-slate-100 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto flex-1">
                            {/* Selection Checkbox (All) */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === customers.data.length && customers.data.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-[#FF9F43] border-slate-300 rounded focus:ring-[#FF9F43] transition-all cursor-pointer"
                                />
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full sm:max-w-md">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
                                    {isLoading && loadingType === "search" ? (
                                        <div className="w-4 h-4 border-2 border-[#FF9F43] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search size={16} />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search by name, email, company..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-[13px] focus:bg-white focus:ring-2 focus:ring-[#FF9F43]/10 transition-all outline-none border focus:border-[#FF9F43]"
                                />
                            </div>

                            {/* Clear Filters */}
                            {search && (
                                <button
                                    onClick={handleClearFilters}
                                    className="text-[12px] font-bold text-[#FF9F43] hover:text-[#e68a30] transition-colors whitespace-nowrap"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Bulk Actions */}
                        {(selectedIds.length > 0 || selectAllGlobal) && (
                            <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                                <button
                                    onClick={clearSelection}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 text-[13px] font-medium transition-colors"
                                >
                                    Deselect All
                                </button>
                                <ConfirmBulkDelete
                                    selectedIds={selectedIds}
                                    selectAllGlobal={selectAllGlobal}
                                    totalCount={customers.total}
                                    routeName="admin.customers.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar relative w-full touch-pan-x">
                        <table className="w-full text-left border-collapse min-w-[1400px]">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-3 px-4 w-10">
                                        {/* Selection placeholder */}
                                    </th>
                                    <th className="py-3 px-4 whitespace-nowrap">Date Registered</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Shop Name</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Manager</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Contact</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Email Address</th>
                                    <th className="py-3 px-4 text-center whitespace-nowrap">Discount Rate</th>
                                    <th className="py-3 px-4 text-center whitespace-nowrap">Total Purchases</th>
                                    <th className="py-3 px-4 text-center whitespace-nowrap">Total Returns</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Address</th>
                                    <th className="py-3 px-4 text-right sticky right-0 z-10 bg-slate-50/95 backdrop-blur-sm border-l border-slate-100">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={`divide-y divide-slate-100 ${
                                    isLoading ? "opacity-40 pointer-events-none" : "opacity-100"
                                } transition-opacity duration-200`}
                            >
                                {customers.data && customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className={`${selectedIds.includes(customer.id) ? 'bg-[#FF9F43]/5' : ''} hover:bg-slate-50/50 transition-all text-[12px] group`}
                                        >
                                            <td className="py-3 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(customer.id)}
                                                    onChange={() => toggleSelect(customer.id)}
                                                    className="w-4 h-4 text-[#FF9F43] border-slate-300 rounded focus:ring-[#FF9F43] transition-all cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                                                {new Date(customer.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-900 uppercase">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} className="text-[#FF9F43]" />
                                                    {customer.company_name || "N/A"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-700">
                                                <Link 
                                                    href={route('admin.customers.show', customer.id)}
                                                    className="hover:text-[#FF9F43] transition-colors"
                                                >
                                                    {customer.name}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="p-1 rounded bg-slate-100 text-[#FF9F43]">
                                                        <Phone size={12} strokeWidth={3} />
                                                    </span>
                                                    {customer.phone_number || "N/A"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {customer.email}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                        customer.discount_rate > 0
                                                            ? "bg-[#FF9F43]/10 text-[#FF9F43]"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >
                                                    {customer.discount_rate}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-center font-bold text-slate-900">
                                                ${parseFloat(customer.total_purchases || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3 text-center font-medium text-slate-600">
                                                ${parseFloat(customer.total_returns || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-slate-400 flex-shrink-0" />
                                                    {customer.address || "N/A"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-right sticky right-0 z-10 bg-white/95 backdrop-blur-sm border-l border-slate-50 group-hover:bg-slate-50/95 transition-all">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.customers.show', customer.id)}
                                                        className="px-3 py-1.5 text-[11px] font-bold bg-[#FF9F43]/10 text-[#FF9F43] rounded-lg hover:bg-[#FF9F43] hover:text-white transition-all shadow-sm"
                                                    >
                                                        Details
                                                    </Link>
                                                    {customer.discount_rate > 0 && (
                                                        <button
                                                            onClick={() => resetDiscount(customer.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Reset Discount"
                                                        >
                                                            <RefreshCw size={14} />
                                                        </button>
                                                    )}
                                                    <ConfirmDelete
                                                        id={customer.id}
                                                        routeName="admin.customers.destroy"
                                                        trigger={
                                                            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Users size={48} className="mb-3 opacity-20" />
                                                <p className="text-sm font-medium">No customers found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                        <Pagination meta={customers} />
                    </div>
                </div>
            </div>


            {/* Global Discount Modal */}
            {showGlobalModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            Apply Global Discount
                        </h3>
                        <form onSubmit={applyGlobalDiscount} className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Discount Rate (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={globalDiscount.rate}
                                    onChange={(e) =>
                                        setGlobalDiscount({ ...globalDiscount, rate: e.target.value })
                                    }
                                    placeholder="Enter discount percentage"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-[#FF9F43]/10 focus:border-[#FF9F43] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Apply To
                                </label>
                                <select
                                    value={globalDiscount.apply_to}
                                    onChange={(e) =>
                                        setGlobalDiscount({ ...globalDiscount, apply_to: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-[13px] focus:ring-2 focus:ring-[#FF9F43]/10 focus:border-[#FF9F43] outline-none"
                                >
                                    <option value="all">All Customers</option>
                                    <option value="existing_discount">Customers with Existing Discount</option>
                                    <option value="no_discount">Customers without Discount</option>
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowGlobalModal(false)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-[13px] font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#FF9F43] text-white rounded-lg text-[13px] font-bold hover:bg-[#e68a30] transition-colors shadow-lg shadow-[#FF9F43]/20"
                                >
                                    Apply Discount
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
