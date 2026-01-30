import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { TableManager } from "@/Hooks/TableManager";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";
import { 
    Users, 
    Plus, 
    Search,
    Eye,
    MapPin,
    Package,
    Pencil,
    FileText,
    Phone,
    Tag,
} from "lucide-react";

export default function Index({ leads, filters = {} }) {
    const {
        search, handleSearch, isLoading, loadingType,
        selectedIds, toggleSelectAll, toggleSelect,
        selectAllGlobal, setSelectAllGlobal, clearSelection,
        currentFilters, handleFilterChange, handleClearFilters,
    } = TableManager("admin.leads.index", leads.data, {
        ...filters,
        only: ["leads"]
    });

    const isAllPageSelected = leads.data.length > 0 && (selectAllGlobal || leads.data.every((p) => selectedIds.includes(p.id)));

    return (
        <AdminLayout>
            <Head title="Lead Management" />

            <div className="font-sans">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
                        <p className="text-slate-500 text-sm mt-1">Track and manage your sales leads and parts requests.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.leads.create")}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-[#FF9F43] text-white text-[13px] font-bold rounded-lg hover:bg-[#e68a30] transition-all duration-200 shadow-lg shadow-[#FF9F43]/20"
                        >
                            <Plus size={16} className="mr-2" /> Add New Lead
                        </Link>
                    </div>
                </div>

                {/* Search & Bulk Action Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
                    <div className={`transition-all duration-300 overflow-hidden ${isAllPageSelected && !selectAllGlobal && leads.total > leads.data.length ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-[#FF9F43]/10 border-b border-[#FF9F43]/20 px-6 py-3 text-[13px] text-[#e68a30] flex items-center justify-center gap-2">
                            <span>All <b>{leads.data.length}</b> leads on this page are selected.</span>
                            <button onClick={() => setSelectAllGlobal(true)} className="font-bold underline">Select all {leads.total.toLocaleString()}</button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 border-b border-slate-100 gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto flex-1">
                            {/* Search Input with Local Spinner */}
                            <div className="relative w-full sm:max-w-md">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
                                    {isLoading && loadingType === 'search' ? (
                                        <div className="w-4 h-4 border-2 border-[#FF9F43] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search size={16} />
                                    )}
                                </div>
                                <input
                                    type="text" 
                                    value={search} 
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search by Invoice, Shop, Name, VIN, Part..."
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
                                    totalCount={leads.total}
                                    routeName="admin.leads.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar relative w-full touch-pan-x">
                        <table className="w-full text-left border-collapse min-w-[1500px]">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-3 px-4 w-10 text-center sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm border-r border-slate-100">
                                        <input 
                                            type="checkbox" 
                                            checked={isAllPageSelected} 
                                            onChange={toggleSelectAll} 
                                            className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all" 
                                        />
                                    </th>
                                    <th className="py-3 px-4 whitespace-nowrap">Date</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Shop Name</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Name</th>
                                    <th className="py-3 px-4 whitespace-nowrap">Contact</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4">Vendor</th>
                                    <th className="py-3 px-4 text-center">Buy</th>
                                    <th className="py-3 px-4 text-center">Sell</th>
                                    <th className="py-3 px-4">Notes</th>
                                    <th className="py-3 px-4">City</th>
                                    <th className="py-3 px-4">PO Number</th>
                                    <th className="py-3 px-4">Invoice #</th>
                                    <th className="py-3 px-4 text-right sticky right-0 z-10 bg-slate-50/95 backdrop-blur-sm border-l border-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-slate-100 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
                                {(leads.data && leads.data.length > 0) ? (
                                    leads.data.map((lead) => (
                                        <tr key={lead.id} className={`
                                            ${selectedIds.includes(lead.id) || selectAllGlobal ? 'bg-[#FF9F43]/5' : 'hover:bg-slate-50/50'} 
                                            transition-all text-[12px] group
                                        `}>
                                            <td className="py-3 px-4 text-center sticky left-0 z-10 bg-white/95 backdrop-blur-sm border-r border-slate-50 group-hover:bg-slate-50/95 transition-all">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(lead.id) || selectAllGlobal} 
                                                    onChange={() => toggleSelect(lead.id)} 
                                                    className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all" 
                                                />
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap font-bold text-slate-900 uppercase">
                                                {lead.shop_name}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-700">
                                                {lead.name}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="p-1 rounded bg-slate-100 text-[#FF9F43]">
                                                        <Phone size={12} strokeWidth={3} />
                                                    </span>
                                                    {lead.contact_number}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-slate-600 line-clamp-1 max-w-[200px]" title={lead.vehicle_info}>
                                                {lead.vehicle_info}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                                                {lead.vendors}
                                            </td>
                                            <td className="py-3 px-3 text-center font-bold text-slate-900">
                                                ${parseFloat(lead.total_buy || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3 text-center font-bold text-[#FF9F43]">
                                                ${parseFloat(lead.total_sell || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3 max-w-[120px] truncate text-slate-500" title={lead.notes}>
                                                {lead.notes}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                                                {lead.city}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                    <Tag size={12} className="text-[#FF9F43]" />
                                                    {lead.po_number || "-"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 font-bold text-slate-900 tracking-tight">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${lead.status === 'Processing' ? 'bg-[#FF9F43]' : lead.status === 'Fulfilled' ? 'bg-[#00B050]' : 'bg-slate-300'}`} />
                                                    {lead.lead_number || `INV${String(lead.id).padStart(5, '0')}`}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-right sticky right-0 z-10 bg-white/95 backdrop-blur-sm border-l border-slate-50 group-hover:bg-slate-50/95 transition-all">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route("admin.leads.invoice", lead.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 transition-all"
                                                        title="Invoice"
                                                    >
                                                        <FileText size={15} />
                                                    </Link>
                                                    <Link
                                                        href={route("admin.leads.edit", lead.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 transition-all"
                                                    >
                                                        <Pencil size={15} />
                                                    </Link>
                                                    <Link
                                                        href={route("admin.leads.show", lead.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF9F43] hover:bg-[#FF9F43]/5 transition-all"
                                                    >
                                                        <Eye size={15} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="13" className="py-20 text-center bg-white">
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                    <Search size={32} />
                                                </div>
                                                <p className="font-medium">No leads found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                        <Pagination meta={leads} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
