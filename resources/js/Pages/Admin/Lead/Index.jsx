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
} from "lucide-react";

export default function Index({ leads, filters = {} }) {
    const {
        search, handleSearch, isLoading,
        selectedIds, toggleSelectAll, toggleSelect,
        selectAllGlobal, setSelectAllGlobal, clearSelection,
    } = TableManager("admin.leads.index", leads.data, {
        ...filters,
        only: ["leads"]
    });

    const isAllPageSelected = leads.data.length > 0 && (selectAllGlobal || leads.data.every((p) => selectedIds.includes(p.id)));

    const getStatusStyles = (status) => {
        switch (status) {
            case "Quote":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Processing":
                return "bg-red-100 text-red-700 border-red-200";
            case "Fulfilled":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <AdminLayout>
            <Head title="Lead Management" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
                        <p className="text-slate-500 mt-1">Track and manage your sales leads and parts requests.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.leads.create")}
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-[#FF9F43] text-white text-[13px] font-bold rounded-lg hover:bg-[#e68a30] transition-all duration-200 shadow-lg shadow-[#FF9F43]/20"
                        >
                            <Plus size={16} className="mr-2" /> Add New Lead
                        </Link>
                    </div>
                </div>

                {/* Search & Bulk Action Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
                    {/* Progress Bar */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF9F43]/10 overflow-hidden z-20">
                            <div className="h-full bg-[#FF9F43] animate-progress-indeterminate w-1/3 rounded-full" />
                        </div>
                    )}

                    {isAllPageSelected && !selectAllGlobal && leads.total > leads.data.length && (
                        <div className="bg-[#FF9F43]/10 border-b border-[#FF9F43]/20 px-6 py-3 text-[13px] text-[#e68a30] flex items-center justify-center gap-2">
                            <span>All <b>{leads.data.length}</b> leads on this page are selected.</span>
                            <button onClick={() => setSelectAllGlobal(true)} className="font-bold underline">Select all {leads.total.toLocaleString()}</button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-100 gap-4">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text" 
                                    value={search} 
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search leads..."
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
                                    totalCount={leads.total}
                                    routeName="admin.leads.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
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
                                    <th className="py-3 px-6">Lead ID</th>
                                    <th className="py-3 px-6">Lead Information</th>
                                    <th className="py-3 px-6">Vehicle Details</th>
                                    <th className="py-3 px-6">Parts</th>
                                    <th className="py-3 px-6 text-center">Status</th>
                                    <th className="py-3 px-6">Location</th>
                                    <th className="py-3 px-6 text-right pr-10">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-slate-50 transition-all duration-300 ${isLoading ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                                {leads.data.length > 0 ? (
                                    leads.data.map((lead) => (
                                        <tr key={lead.id} className={`${selectedIds.includes(lead.id) || selectAllGlobal ? 'bg-[#FF9F43]/5' : 'hover:bg-slate-50/30'} transition-all duration-150`}>
                                            <td className="py-4 px-6 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.includes(lead.id) || selectAllGlobal} 
                                                    onChange={() => toggleSelect(lead.id)} 
                                                    className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all" 
                                                />
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-bold border border-slate-200 uppercase whitespace-nowrap tracking-tighter">
                                                    {lead.lead_number || `LD-${String(lead.id).padStart(5, '0')}`}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 text-[13px] leading-snug mb-0.5">{lead.shop_name}</span>
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                        <span>{lead.name}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span>{lead.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-semibold text-slate-800 tracking-tight">{lead.vehicle_info}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">VIN: {lead.vin || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF9F43]/10 text-[#FF9F43] rounded-full text-[10px] font-bold border border-[#FF9F43]/20">
                                                    <Package size={12} />
                                                    {lead.parts_count} ITEM{lead.parts_count !== 1 ? 'S' : ''}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(lead.status)}`}>
                                                    {lead.status?.toUpperCase() || 'QUOTE'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <MapPin size={14} className="text-slate-400 opacity-60" />
                                                    <span className="text-[12px] font-medium">{lead.city}, {lead.province}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right pr-6 flex items-center justify-end gap-2">
                                                <Link
                                                    href={route("admin.leads.invoice", lead.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#FF9F43] hover:border-[#FF9F43]/30 transition-all group/quote"
                                                    title="Create Quote/Invoice"
                                                >
                                                    <FileText size={14} className="group-hover/quote:scale-110 transition-transform" />
                                                </Link>
                                                <Link
                                                    href={route("admin.leads.edit", lead.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#FF9F43] hover:border-[#FF9F43]/30 transition-all"
                                                >
                                                    <Pencil size={14} />
                                                </Link>
                                                <Link
                                                    href={route("admin.leads.show", lead.id)}
                                                    className="inline-flex items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-[#FF9F43] hover:border-[#FF9F43]/30 transition-all group/btn"
                                                >
                                                    <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                    <Search size={32} />
                                                </div>
                                                <p className="text-slate-400 font-medium text-[14px]">No leads found matching your criteria.</p>
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
