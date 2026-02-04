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
                            Manage B2B customer profiles and contact details
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowGlobalModal(true)}
                            className="inline-flex items-center px-5 py-2.5 bg-[#FF9F43] text-white text-[13px] font-bold rounded-xl hover:bg-[#e68a30] transition-all shadow-lg shadow-[#FF9F43]/20"
                        >
                            <Percent size={18} className="mr-2" />
                            Apply Global Discount
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Total B2B Partners
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {stats.total_customers}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-[#FF9F43]/10 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-[#FF9F43]" />
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
                        <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-3 px-4 w-10">
                                        {/* Selection placeholder */}
                                    </th>
                                    <th className="py-3 px-4 whitespace-nowrap">Company Name</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Full Name</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Discount</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Position</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Account Type</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Phone Number</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Email Address</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Company Address</th>
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
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-lg font-black border border-green-100">
                                                    {customer.discount_rate}%
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                                                {customer.position || "N/A"}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <span className="px-2 py-1 rounded text-[10px] bg-blue-50 text-blue-600 font-bold border border-blue-100 uppercase">
                                                    {customer.account_type || "N/A"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                                                {customer.phone_number || "N/A"}
                                            </td>
                                            <td className="py-3 px-3 text-slate-600">
                                                {customer.email}
                                            </td>
                                            <td className="py-3 px-3 text-slate-500 max-w-[250px] truncate" title={customer.address}>
                                                {customer.address || "N/A"}
                                            </td>
                                            <td className="py-3 px-3 text-right sticky right-0 z-10 bg-white/95 backdrop-blur-sm border-l border-slate-50 group-hover:bg-slate-50/95 transition-all">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.customers.show', customer.id)}
                                                        className="px-3 py-1.5 text-[11px] font-bold bg-[#FF9F43]/10 text-[#FF9F43] rounded-lg hover:bg-[#FF9F43] hover:text-white transition-all shadow-sm"
                                                    >
                                                        Details
                                                    </Link>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Percent className="text-[#FF9F43]" />
                                Apply Global Discount
                            </h3>
                            <button 
                                onClick={() => setShowGlobalModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={applyGlobalDiscount} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                                    Discount Rate (%)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={globalDiscount.rate}
                                        onChange={(e) =>
                                            setGlobalDiscount({ ...globalDiscount, rate: e.target.value })
                                        }
                                        placeholder="0.00"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-[#FF9F43] focus:ring-4 focus:ring-[#FF9F43]/10 focus:border-[#FF9F43] outline-none transition-all pr-12"
                                        required
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-200">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                                    Apply To Group
                                </label>
                                <select
                                    value={globalDiscount.apply_to}
                                    onChange={(e) =>
                                        setGlobalDiscount({ ...globalDiscount, apply_to: e.target.value })
                                    }
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-[#FF9F43]/10 focus:border-[#FF9F43] outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="all">All B2B Partners</option>
                                    <option value="existing_discount">Partners with Existing Discount</option>
                                    <option value="no_discount">Partners without Discount</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowGlobalModal(false)}
                                    className="flex-1 py-4 border-2 border-slate-50 rounded-2xl text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-[#FF9F43] text-white rounded-2xl text-sm font-black hover:bg-[#e68a30] transition-all shadow-xl shadow-[#FF9F43]/20"
                                >
                                    Apply Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
