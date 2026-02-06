import React, { useRef, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import JsBarcode from "jsbarcode";
import { ChevronLeft, Printer, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Invoice({ lead }) {
    const printRef = useRef();
    const barcodeRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, lead.lead_number || `LD${lead.id}`, {
                format: "CODE128",
                width: 1.5,
                height: 40,
                displayValue: false,
                margin: 0,
            });
        }
    }, [lead]);

    const subtotal = lead.parts.reduce(
        (sum, part) => sum + parseFloat(part.sell_price || 0),
        0,
    );
    const discount = lead.discount || 0; // Assuming lead might have a discount field, or default to 0
    const taxRate = 0.13;
    const tax = (subtotal - discount) * taxRate;
    const total = subtotal - discount + tax;

    return (
        <AdminLayout>
            <Head title={`Invoice Template - ${lead.shop_name}`} />

            <div className="p-2 md:p-8  min-h-screen font-sans">
                {/* Control Header */}
                <div className="max-w-[850px] mx-auto flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 print:hidden">
                    <Link
                        href={route("admin.leads.show", lead.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all"
                    >
                        <ChevronLeft size={16} /> Back to Lead
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#AD0100] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-xl hover:bg-red-700 transition-all active:scale-95"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>

                {/* THE INVOICE TEMPLATE (BOXED DESIGN) */}
                <div
                    ref={printRef}
                    className="max-w-[850px] mx-auto bg-white p-6 border-[3px] border-black print:p-0 print:border-none shadow-xl print:shadow-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Top Section: Logo, Company Info, Meta Table */}
                    <div className="grid grid-cols-12 mb-4">
                        {/* Logo & Slogan */}
                        <div className="col-span-4 flex flex-col items-start">
                            <img
                                src="/img/logo.png"
                                alt="Parts Panel"
                                style={{
                                    height: "65px",
                                    objectFit: "contain",
                                    mixBlendMode: "multiply",
                                }}
                                className="mb-2"
                            />
                            <div className="bg-black text-white text-[11px] font-black uppercase px-3 py-1 tracking-widest mb-1 w-fit">
                                Quality Supply, Trusted Service
                            </div>
                            <p className="text-[10px] font-bold text-slate-700 uppercase">
                                OEM & Aftermarket Auto Parts
                            </p>
                        </div>

                        {/* Company Contact Info */}
                        <div className="col-span-4 flex flex-col justify-center px-4">
                            <h2 className="text-2xl font-black text-black mb-1 leading-none uppercase tracking-tighter">
                                Parts Panel
                            </h2>
                            <div className="space-y-1 mt-2">
                                <div className="flex items-start gap-2 text-[11px] font-bold text-black leading-tight">
                                    <MapPin
                                        size={12}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <span>
                                        2416 Wyecroft Road,
                                        <br />
                                        Unit 1, Oakville, ON, L6L 6M6
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-black">
                                    <Phone size={12} className="shrink-0" />
                                    <span>345-987-1254</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-black">
                                    <Mail size={12} className="shrink-0" />
                                    <span>sales@partspanel.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-black">
                                    <Globe size={12} className="shrink-0" />
                                    <span>www.partspanel.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Meta Table (Right) */}
                        <div className="col-span-4 flex flex-col items-end">
                            <div className="w-full border-[2.5px] border-black border-b-0">
                                <div className="flex border-b-[2.5px] border-black">
                                    <div className="w-1/2 bg-[#E2E8F0] p-1.5 text-[11px] font-black border-r-[2.5px] border-black text-center uppercase">
                                        Date
                                    </div>
                                    <div className="w-1/2 p-1.5 text-[11px] font-bold text-center">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex border-b-[2.5px] border-black">
                                    <div className="w-1/2 bg-[#E2E8F0] p-1.5 text-[11px] font-black border-r-[2.5px] border-black text-center uppercase">
                                        Order Number
                                    </div>
                                    <div className="w-1/2 p-1.5 text-[11px] font-bold text-center">
                                        #
                                        {lead.lead_number ||
                                            String(lead.id).padStart(5, "0")}
                                    </div>
                                </div>
                                <div className="flex border-b-[2.5px] border-black">
                                    <div className="w-1/2 bg-[#E2E8F0] p-1.5 text-[11px] font-black border-r-[2.5px] border-black text-center uppercase">
                                        Invoice Number
                                    </div>
                                    <div className="w-1/2 p-1.5 text-[11px] font-bold text-center">
                                        INV-{String(lead.id).padStart(6, "0")}
                                    </div>
                                </div>
                                <div className="flex border-b-[2.5px] border-black">
                                    <div className="w-1/2 bg-[#E2E8F0] p-1.5 text-[11px] font-black border-r-[2.5px] border-black text-center uppercase">
                                        P.O. Number
                                    </div>
                                    <div className="w-1/2 p-1.5 text-[11px] font-black text-center text-[#D93025]">
                                        {lead.po_number || "N/A"}
                                    </div>
                                </div>
                            </div>
                            {/* Barcode SVG */}
                            <div className="w-full mt-1 flex justify-center items-center py-1 overflow-hidden">
                                <svg
                                    ref={barcodeRef}
                                    className="w-full max-h-[45px]"
                                ></svg>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Ship To Section */}
                    <div className="border-[2.5px] border-black mb-4 overflow-hidden">
                        <div className="flex bg-[#E2E8F0] border-b-[2.5px] border-black uppercase text-[12px] font-black">
                            <div className="w-1/2 p-1 text-center border-r-[2.5px] border-black italic">
                                Bill To
                            </div>
                            <div className="w-1/2 p-1 text-center italic">
                                Ship To
                            </div>
                        </div>
                        <div className="flex min-h-[100px]">
                            {/* Bill To Info */}
                            <div className="w-1/2 p-3 border-r-[2.5px] border-black space-y-0.5">
                                <p className="text-[13px] font-black text-black">
                                    {lead.name}
                                </p>
                                <p className="text-[12px] font-bold text-slate-800">
                                    {lead.shop_name}
                                </p>
                                <p className="text-[12px] font-medium text-slate-700 leading-tight">
                                    {lead.street_address}
                                    {lead.unit_number &&
                                        `, Unit ${lead.unit_number}`}
                                    <br />
                                    {lead.city}, {lead.province},{" "}
                                    {lead.postcode}
                                </p>
                                <p className="text-[11px] font-bold text-black mt-1">
                                    {lead.contact_number &&
                                        lead.contact_number.replace(
                                            /(\d{3})(\d{3})(\d{4})/,
                                            "$1-$2-$3",
                                        )}
                                </p>
                                <p className="text-[11px] font-bold text-black">
                                    {lead.email}
                                </p>
                            </div>
                            {/* Ship To Info */}
                            <div className="w-1/2 p-3 space-y-0.5">
                                <p className="text-[13px] font-black text-black">
                                    {lead.name}
                                </p>
                                <p className="text-[12px] font-bold text-slate-800">
                                    {lead.shop_name}
                                </p>
                                <p className="text-[12px] font-medium text-slate-700 leading-tight">
                                    {lead.street_address}
                                    {lead.unit_number &&
                                        `, Unit ${lead.unit_number}`}
                                    <br />
                                    {lead.city}, {lead.province},{" "}
                                    {lead.postcode}
                                </p>
                                <p className="text-[11px] font-bold text-black mt-1">
                                    {lead.contact_number &&
                                        lead.contact_number.replace(
                                            /(\d{3})(\d{3})(\d{4})/,
                                            "$1-$2-$3",
                                        )}
                                </p>
                                <p className="text-[11px] font-bold text-black">
                                    {lead.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Method / Store / Payment Bar */}
                    <div className="border-[2.5px] border-black mb-4 uppercase text-[12px] font-black">
                        <div className="flex bg-[#E2E8F0] border-b-[2.5px] border-black italic">
                            <div className="w-1/3 p-1 text-center border-r-[2.5px] border-black">
                                Method
                            </div>
                            <div className="w-1/3 p-1 text-center border-r-[2.5px] border-black">
                                Store
                            </div>
                            <div className="w-1/3 p-1 text-center">Payment</div>
                        </div>
                        <div className="flex font-bold normal-case">
                            <div className="w-1/3 p-2 text-center border-r-[2.5px] border-black">
                                {lead.method || "Delivery"}
                            </div>
                            <div className="w-1/3 p-2 text-center border-r-[2.5px] border-black">
                                {lead.city || "Oakville"}
                            </div>
                            <div className="w-1/3 p-2 text-center uppercase">
                                {lead.status || "Due"}
                            </div>
                        </div>
                    </div>

                    {/* Main Parts Table */}
                    <div className="border-[2.5px] border-black mb-0 overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#E2E8F0] border-b-[2.5px] border-black uppercase text-[11px] font-black italic">
                                    <th className="p-2 text-center border-r-[2.5px] border-black w-[12%] tracking-wider">
                                        SKU
                                    </th>
                                    <th className="p-2 text-center border-r-[2.5px] border-black w-[58%] tracking-wider">
                                        Description
                                    </th>
                                    <th className="p-2 text-center border-r-[2.5px] border-black w-[8%] tracking-wider">
                                        QTY
                                    </th>
                                    <th className="p-2 text-center border-r-[2.5px] border-black w-[11%] tracking-wider">
                                        Unit Price
                                    </th>
                                    <th className="p-2 text-center w-[11%] tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-[2px] divide-black min-h-[400px]">
                                {lead.parts.map((part, idx) => (
                                    <tr key={idx} className="min-h-[40px]">
                                        <td className="p-2 text-[11px] font-bold text-black border-r-[2.5px] border-black align-top font-mono uppercase text-center">
                                            {part.sku ||
                                                `GM${1000 + (part.id || idx)}`}
                                        </td>
                                        <td className="p-2 text-[11px] font-black text-black border-r-[2.5px] border-black align-top leading-tight uppercase px-4">
                                            {lead.vehicle_info} {part.part_name}
                                        </td>
                                        <td className="p-2 text-[11px] font-black text-black border-r-[2.5px] border-black text-center align-top">
                                            1
                                        </td>
                                        <td className="p-2 text-[11px] font-black text-black border-r-[2.5px] border-black text-center align-top px-1">
                                            {parseFloat(
                                                part.sell_price || 0,
                                            ).toFixed(2)}
                                        </td>
                                        <td className="p-2 text-[11px] font-black text-black text-center align-top px-1">
                                            {parseFloat(
                                                part.sell_price || 0,
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {/* Padding rows to maintain size */}
                                {[
                                    ...Array(
                                        Math.max(0, 8 - lead.parts.length),
                                    ),
                                ].map((_, i) => (
                                    <tr key={`empty-${i}`} className="h-6">
                                        <td className="border-r-[2.5px] border-black"></td>
                                        <td className="border-r-[2.5px] border-black"></td>
                                        <td className="border-r-[2.5px] border-black"></td>
                                        <td className="border-r-[2.5px] border-black"></td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mt-[-2.5px]">
                        <div className="w-[280px] border-[2.5px] border-black">
                            <div className="flex border-b-[2.5px] border-black">
                                <div className="w-1/2 p-2 bg-[#E2E8F0] text-[11px] font-black border-r-[2.5px] border-black text-left uppercase italic">
                                    Subtotal
                                </div>
                                <div className="w-1/2 p-2 text-[12px] font-black text-right">
                                    {subtotal.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex border-b-[2.5px] border-black">
                                <div className="w-1/2 p-2 bg-[#E2E8F0] text-[11px] font-black border-r-[2.5px] border-black text-left uppercase italic">
                                    Discount
                                </div>
                                <div className="w-1/2 p-2 text-[12px] font-black text-right">
                                    ({discount.toFixed(2)})
                                </div>
                            </div>
                            <div className="flex border-b-[2.5px] border-black">
                                <div className="w-1/2 p-2 bg-[#E2E8F0] text-[11px] font-black border-r-[2.5px] border-black text-left uppercase italic">
                                    Tax{" "}
                                    <span className="font-bold normal-case">
                                        ON 13%
                                    </span>
                                </div>
                                <div className="w-1/2 p-2 text-[12px] font-black text-right">
                                    {tax.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex bg-[#E2E8F0] items-center">
                                <div className="w-1/2 p-2 text-[14px] font-black border-r-[2.5px] border-black text-left uppercase italic">
                                    Total
                                </div>
                                <div className="w-1/2 p-3 text-[18px] font-black text-right border-black">
                                    ${total.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-8 flex flex-col items-center">
                        <div className="w-full flex items-center justify-between mb-2">
                            {/* The Red Arrow Bar */}
                            <div className="flex-1 h-7 bg-[#AD0100] relative flex items-center justify-center gap-1 overflow-hidden pointer-events-none">
                                <CityLabel name="OAKVILLE" left />
                                <span className="text-white text-[10px] font-black opacity-50 px-1">
                                    |
                                </span>
                                <CityLabel name="MISSISSAUGA" />
                                <span className="text-white text-[10px] font-black opacity-50 px-1">
                                    |
                                </span>
                                <CityLabel name="BRAMPTON" />
                                <span className="text-white text-[10px] font-black opacity-50 px-1">
                                    |
                                </span>
                                <CityLabel name="LONDON" />
                                <span className="text-white text-[10px] font-black opacity-50 px-1">
                                    |
                                </span>
                                <CityLabel name="SASKATOON" />
                                <span className="text-white text-[10px] font-black opacity-50 px-1">
                                    |
                                </span>
                                <CityLabel name="REGINA" right />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; margin: 0; }
                    nav, header, aside, .print-hidden { display: none !important; }
                    .max-w-\[850px\] { 
                        width: 100% !important; 
                        max-width: 100% !important; 
                        padding: 0 !important; 
                        margin: 0 !important; 
                        border: none !important;
                        transform: scale(0.95);
                        transform-origin: top center;
                    }
                    @page { margin: 0.5cm; size: portrait; }
                }
                .clip-arrow-left { clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%); }
                .clip-arrow-right { clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%); }
            `,
                }}
            />
        </AdminLayout>
    );
}

function CityLabel({ name, left, right }) {
    return (
        <span
            className={`text-white text-[10px] font-black tracking-widest ${left ? "ml-4" : ""} ${right ? "mr-4" : ""}`}
        >
            {name}
        </span>
    );
}
