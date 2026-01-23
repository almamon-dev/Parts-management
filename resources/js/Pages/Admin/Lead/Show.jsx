import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { 
    Users, 
    ChevronLeft,
    Car,
    FileText,
    MapPin,
    Package,
    Mail,
    Phone,
    Info,
    Eye,
} from "lucide-react";

export default function Show({ lead }) {
    return (
        <AdminLayout>
            <Head title={`Lead Details - ${lead.shop_name}`} />

            <div className="p-3 bg-slate-50/50 min-h-screen font-sans text-slate-800">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF9F43]/10 rounded-xl flex items-center justify-center text-[#FF9F43]">
                            <Eye size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-slate-900">Lead: {lead.shop_name}</h1>
                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    lead.status === 'Quote' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 
                                    lead.status === 'Processing' ? 'bg-red-50 border-red-200 text-red-700' : 
                                    'bg-green-50 border-green-200 text-green-700'
                                }`}>
                                    {lead.status?.toUpperCase() || 'QUOTE'}
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">Detailed overview of lead requirements.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.leads.invoice", lead.id)}
                            className="inline-flex items-center gap-2 bg-[#FF9F43] text-white px-4 py-1.5 rounded-lg text-[12px] font-bold shadow-lg shadow-[#FF9F43]/20 hover:bg-[#e68a30] transition-all"
                        >
                            <FileText size={14} /> Create Invoice
                        </Link>
                        <Link
                            href={route("admin.leads.index")}
                            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            <ChevronLeft size={14} /> Back
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Lead Information */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                             <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                                <Info size={16} className="text-[#FF9F43]" />
                                Lead Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Shop Name</label>
                                        <span className="text-[14px] font-bold text-slate-900">{lead.shop_name}</span>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Requester Name</label>
                                        <span className="text-[14px] font-bold text-slate-900">{lead.name}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#FF9F43] shrink-0">
                                            <Mail size={14} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                                            <span className="text-[13px] font-semibold text-slate-700">{lead.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#FF9F43] shrink-0">
                                            <Phone size={14} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Number</label>
                                            <span className="text-[13px] font-semibold text-slate-700">{lead.contact_number}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Specification */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                                <Car size={16} className="text-[#FF9F43]" />
                                Vehicle Specification
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Vehicle</label>
                                    <span className="text-[14px] font-bold text-slate-900 tracking-tight">{lead.vehicle_info}</span>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">VIN Number</label>
                                    <span className="text-[13px] font-semibold text-slate-700">{lead.vin || 'N/A'}</span>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Engine Size</label>
                                    <span className="text-[13px] font-semibold text-slate-700">{lead.engine_size || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Requested Parts */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-2 flex items-center gap-2 border-b border-slate-50 pb-2">
                                <Package size={16} className="text-[#FF9F43]" />
                                Requested Parts ({lead.parts.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Part Details</th>
                                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status & Method</th>
                                            <th className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Pricing</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {lead.parts.map((part) => (
                                            <tr key={part.id}>
                                                <td className="px-3 py-3">
                                                    <span className="text-[13px] font-bold text-slate-800">{part.part_name}</span>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <span className="text-[12px] font-medium text-slate-600">{part.vendor || 'N/A'}</span>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border w-fit ${
                                                            part.payment_status === 'Paid' ? 'bg-green-50 border-green-100 text-green-600' : 
                                                            part.payment_status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                                                            'bg-slate-50 border-slate-100 text-slate-500'
                                                        }`}>
                                                            {part.payment_status}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{part.method}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-medium text-slate-400">Buy: ${part.buy_price}</span>
                                                        <span className="text-[13px] font-extrabold text-[#FF9F43]">Sell: ${part.sell_price}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Service Location */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                                <MapPin size={16} className="text-[#FF9F43]" />
                                Service Location
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <p className="text-[13px] font-semibold text-slate-700 leading-relaxed italic">
                                        {lead.street_address}, {lead.unit_number && `#${lead.unit_number},`}
                                        <br />
                                        {lead.city}, {lead.province} {lead.postcode}
                                        <br />
                                        {lead.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Technical Notes */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                             <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                                <FileText size={16} className="text-[#FF9F43]" />
                                Technical Notes
                            </h3>
                            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 min-h-[100px]">
                                <p className="text-[12px] text-slate-500 font-medium italic leading-relaxed">
                                    {lead.notes ? `"${lead.notes}"` : "No internal notes provided for this lead."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
