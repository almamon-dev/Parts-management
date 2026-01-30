import React, { useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { 
    ChevronLeft,
    Printer,
    Mail,
    Phone,
    MapPin,
    Barcode,
} from "lucide-react";

export default function Invoice({ lead }) {
    const printRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    const subtotal = lead.parts.reduce((sum, part) => sum + parseFloat(part.sell_price || 0), 0);
    const taxRate = 0.13; // Based on the ON 13% in the image
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <AdminLayout>
            <Head title={`Invoice Template - ${lead.shop_name}`} />

            <div className="p-2 md:p-8 bg-slate-100 min-h-screen font-sans print:bg-white print:p-0">
                {/* Control Header */}
                <div className="max-w-full mx-auto flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 print:hidden">
                    <Link
                        href={route("admin.leads.show", lead.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all"
                    >
                        <ChevronLeft size={16} /> Back to Lead
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D93025] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-xl hover:bg-red-700 transition-all active:scale-95"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>

                {/* THE INVOICE TEMPLATE (BOXED DESIGN) */}
                <div 
                    ref={printRef}
                    className="max-w-full mx-auto bg-white p-3 sm:p-6 border-[2px] sm:border-[3px] border-slate-400 print:p-4 print:border-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Top Section: Logo, Company Info, Meta Table */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 mb-4 border-b-[2px] sm:border-b-[3px] border-slate-400 pb-4">
                        {/* Logo & Slogan */}
                        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-[#D93025] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-black text-xl sm:text-2xl rounded-sm">P</div>
                                <div className="flex flex-col">
                                    <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#D93025] leading-none">PARTS</span>
                                    <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-800 leading-none uppercase">Panel</span>
                                </div>
                                <div className="bg-black w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white font-black text-xl sm:text-2xl rounded-sm">P</div>
                            </div>
                            <div className="bg-black text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 tracking-widest mb-1 w-fit">
                                Quality Supply, Trusted Service
                            </div>
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase">OEM & Aftermarket Auto Parts</p>
                        </div>

                        {/* Company Contact Info */}
                        <div className="md:col-span-4 flex flex-col justify-center gap-1.5 md:px-6 text-center md:text-left">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 border-b-2 border-slate-100 pb-1 mb-1">Parts Panel</h2>
                            <div className="space-y-1">
                                <div className="flex items-start justify-center md:justify-start gap-2 text-[10px] sm:text-[11px] font-bold text-slate-700">
                                    <MapPin size={12} className="mt-0.5 text-slate-400 shrink-0" />
                                    <span>2416 Wyecroft Road, Unit 1, Oakville, ON, L6L 6M6</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] sm:text-[11px] font-bold text-slate-700">
                                    <Phone size={12} className="text-slate-400 shrink-0" />
                                    <span>345-987-1254</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] sm:text-[11px] font-bold text-slate-700">
                                    <Mail size={12} className="text-slate-400 shrink-0" />
                                    <span>sales@partspanel.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Meta Table (Right) */}
                        <div className="md:col-span-4 w-full">
                            <div className="border-[2px] border-slate-400">
                                <div className="flex border-b-[2px] border-slate-400">
                                    <div className="w-1/2 bg-slate-200 p-1 text-[10px] sm:text-[11px] font-black border-r-[2px] border-slate-400 text-center uppercase">Date</div>
                                    <div className="w-1/2 p-1 text-[10px] sm:text-[11px] font-bold text-center">{new Date().toLocaleDateString()}</div>
                                </div>
                                <div className="flex border-b-[2px] border-slate-400">
                                    <div className="w-1/2 bg-slate-200 p-1 text-[10px] sm:text-[11px] font-black border-r-[2px] border-slate-400 text-center uppercase">Lead ID</div>
                                    <div className="w-1/2 p-1 text-[10px] sm:text-[11px] font-bold text-center">{lead.lead_number || `LD-${String(lead.id).padStart(5, '0')}`}</div>
                                </div>
                                <div className="flex border-b-[2px] border-slate-400">
                                    <div className="w-1/2 bg-slate-200 p-1 text-[10px] sm:text-[11px] font-black border-r-[2px] border-slate-400 text-center uppercase">Invoice Number</div>
                                    <div className="w-1/2 p-1 text-[10px] sm:text-[11px] font-bold text-center">INV-{String(lead.id).padStart(6, '0')}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/2 bg-slate-200 p-1 text-[10px] sm:text-[11px] font-black border-r-[2px] border-slate-400 text-center uppercase">PO Number</div>
                                    <div className="w-1/2 p-1 text-[10px] sm:text-[11px] font-black text-center text-[#D93025]">{lead.po_number || "N/A"}</div>
                                </div>
                            </div>
                            {/* Barcode Mock */}
                            <div className="mt-2 flex flex-col items-center opacity-80 overflow-hidden">
                                <Barcode className="w-full h-6 sm:h-8" />
                                <span className="text-[8px] font-mono tracking-widest uppercase">{lead.vin?.substring(0, 15) || 'INV-1001-AUTO'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Ship To Section */}
                    <div className="border-[2px] border-slate-400 mb-4 overflow-hidden">
                        <div className="flex flex-col sm:flex-row bg-slate-200 border-b-[2px] border-slate-400">
                            <div className="w-full sm:w-1/2 p-1 text-[11px] sm:text-[12px] font-black text-center uppercase border-b-2 sm:border-b-0 sm:border-r-[2px] border-slate-400 italic">Bill To</div>
                            <div className="w-full sm:w-1/2 p-1 text-[11px] sm:text-[12px] font-black text-center uppercase italic">Ship To</div>
                        </div>
                        <div className="flex flex-col sm:flex-row min-h-0 sm:min-h-[100px]">
                            {/* Bill To Info */}
                            <div className="w-full sm:w-1/2 p-3 border-b-2 sm:border-b-0 sm:border-r-[2px] border-slate-400 space-y-0.5">
                                <p className="text-[12px] sm:text-[13px] font-black text-slate-900">{lead.name}</p>
                                <p className="text-[12px] sm:text-[13px] font-bold text-slate-700">{lead.shop_name}</p>
                                <p className="text-[11px] sm:text-[12px] font-medium text-slate-600 leading-tight">
                                    {lead.street_address}{lead.unit_number && `, Unit ${lead.unit_number}`}
                                    <br />
                                    {lead.city}, {lead.province}, {lead.postcode}
                                </p>
                                <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">{lead.contact_number}</p>
                            </div>
                            {/* Ship To Info (Default to same for lead) */}
                            <div className="w-full sm:w-1/2 p-3 space-y-0.5">
                                <p className="text-[12px] sm:text-[13px] font-black text-slate-900">{lead.name}</p>
                                <p className="text-[12px] sm:text-[13px] font-bold text-slate-700">{lead.shop_name}</p>
                                <p className="text-[11px] sm:text-[12px] font-medium text-slate-600 leading-tight">
                                    {lead.street_address}{lead.unit_number && `, Unit ${lead.unit_number}`}
                                    <br />
                                    {lead.city}, {lead.province}, {lead.postcode}
                                </p>
                                <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">{lead.contact_number}</p>
                            </div>
                        </div>
                    </div>

                    {/* Intermediate Bar: Method, Store, Payment */}
                    <div className="border-[2px] border-slate-400 mb-4">
                        <div className="flex bg-slate-200 border-b-[2px] border-slate-400">
                            <div className="w-1/3 p-1 text-[9px] sm:text-[11px] font-black text-center uppercase border-r-[2px] border-slate-400 italic tracking-wider">Method</div>
                            <div className="w-1/3 p-1 text-[9px] sm:text-[11px] font-black text-center uppercase border-r-[2px] border-slate-400 italic tracking-wider">Store</div>
                            <div className="w-1/3 p-1 text-[9px] sm:text-[11px] font-black text-center uppercase italic tracking-wider">Payment</div>
                        </div>
                        <div className="flex">
                            <div className="w-1/3 p-2 text-[10px] sm:text-[12px] font-bold text-center border-r-[2px] border-slate-400 uppercase">{lead.method || 'Delivery'}</div>
                            <div className="w-1/3 p-2 text-[10px] sm:text-[12px] font-bold text-center border-r-[2px] border-slate-400 uppercase truncate">{lead.city || 'Oakville'}</div>
                            <div className="w-1/3 p-2 text-[10px] sm:text-[12px] font-bold text-center uppercase text-[#D93025]">{lead.status || 'Due'}</div>
                        </div>
                    </div>

                    {/* Main Parts Table - Responsive Scroll Container */}
                    <div className="border-[2px] sm:border-[3px] border-slate-400 mb-0 overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[600px] sm:min-w-full">
                            <thead>
                                <tr className="bg-slate-200 border-b-[2px] sm:border-b-[3px] border-slate-400">
                                    <th className="p-2 text-left text-[10px] sm:text-[11px] font-black uppercase border-r-[2px] border-slate-400 w-24 tracking-wider">SKU</th>
                                    <th className="p-2 text-left text-[10px] sm:text-[11px] font-black uppercase border-r-[2px] border-slate-400 tracking-wider">Description</th>
                                    <th className="p-2 text-center text-[10px] sm:text-[11px] font-black uppercase border-r-[2px] border-slate-400 w-12 tracking-wider">QTY</th>
                                    <th className="p-2 text-right text-[10px] sm:text-[11px] font-black uppercase border-r-[2px] border-slate-400 w-20 tracking-wider">Price</th>
                                    <th className="p-2 text-right text-[10px] sm:text-[11px] font-black uppercase w-20 tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-[2px] divide-slate-400">
                                {lead.parts.map((part, idx) => (
                                    <tr key={idx}>
                                        <td className="p-2 text-[10px] sm:text-[11px] font-bold text-slate-800 border-r-[2px] border-slate-400 align-top font-mono uppercase">
                                            LP-{1000 + (part.id || idx)}
                                        </td>
                                        <td className="p-2 text-[10px] sm:text-[11px] font-black text-slate-900 border-r-[2px] border-slate-400 align-top leading-tight uppercase">
                                            {lead.vehicle_info} {part.part_name}
                                        </td>
                                        <td className="p-2 text-[10px] sm:text-[11px] font-black text-slate-900 border-r-[2px] border-slate-400 text-center align-top">
                                            1
                                        </td>
                                        <td className="p-2 text-[10px] sm:text-[11px] font-black text-slate-900 border-r-[2px] border-slate-400 text-right align-top">
                                            {parseFloat(part.sell_price || 0).toFixed(2)}
                                        </td>
                                        <td className="p-2 text-[10px] sm:text-[11px] font-black text-slate-900 text-right align-top">
                                            {parseFloat(part.sell_price || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {/* Minimum Height Logic */}
                                {[...Array(Math.max(0, 8 - lead.parts.length))].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-8">
                                        <td className="border-r-[2px] border-slate-400"></td>
                                        <td className="border-r-[2px] border-slate-400"></td>
                                        <td className="border-r-[2px] border-slate-400"></td>
                                        <td className="border-r-[2px] border-slate-400"></td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end">
                        <div className="w-full sm:w-[300px] border-x-[2px] sm:border-x-[3px] border-b-[2px] sm:border-b-[3px] border-slate-400">
                            <div className="flex border-b-[2px] border-slate-400">
                                <div className="w-1/2 p-2 bg-slate-200 text-[10px] font-black border-r-[2px] border-slate-400 text-left uppercase italic">Subtotal</div>
                                <div className="w-1/2 p-2 text-[11px] font-black text-right">{subtotal.toFixed(2)}</div>
                            </div>
                            <div className="flex border-b-[2px] border-slate-400">
                                <div className="w-1/2 p-2 bg-slate-200 text-[10px] font-black border-r-[2px] border-slate-400 text-left uppercase italic">Tax (13%)</div>
                                <div className="w-1/2 p-2 text-[11px] font-black text-right">{tax.toFixed(2)}</div>
                            </div>
                            <div className="flex bg-slate-200">
                                <div className="w-1/2 p-2 text-[12px] font-black border-r-[2px] border-slate-400 text-left uppercase italic">Total</div>
                                <div className="w-1/2 p-2 text-[14px] font-black text-right underline decoration-double">${total.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Stores Stripe - Hidden on super small mobile for layout */}
                    <div className="mt-8 relative overflow-hidden h-6 hidden sm:block">
                        <div className="absolute inset-0 flex">
                            <div className="w-full bg-[#FFD700] flex items-center justify-center gap-4 text-[9px] font-black text-slate-900 border-2 border-slate-400">
                                <div className="bg-[#D93025] text-white px-2 clip-arrow-left ml-4">OAKVILLE</div>
                                <span>|</span>
                                <span>MISSISSAUGA</span>
                                <span>|</span>
                                <span>BRAMPTON</span>
                                <span>|</span>
                                <span>LONDON</span>
                                <span>|</span>
                                <span>SASKATOON</span>
                                <span>|</span>
                                <div className="bg-[#D93025] text-white px-2 clip-arrow-right mr-4">REGINA</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-full mx-auto mt-4 text-center text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest print:hidden">
                    Copyright &copy; Parts Panel 2024. All Rights Reserved.
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; }
                    nav, header, aside, .print-hidden { display: none !important; }
                    .max-w-full { border: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; }
                    @page { margin: 1cm; size: portrait; }
                }
                .clip-arrow-left { clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%); }
                .clip-arrow-right { clip-path: polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%); }
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            `}} />
        </AdminLayout>
    );
}
