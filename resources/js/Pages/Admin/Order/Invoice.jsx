import React, { useRef, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import JsBarcode from "jsbarcode";
import { ChevronLeft, Printer, Mail, Phone, MapPin, Eye } from "lucide-react";

export default function Invoice({ order }) {
    const { settings } = usePage().props;
    const barcodeRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, order.order_number, {
                format: "CODE128",
                width: 2.2,
                height: 45,
                displayValue: false,
                margin: 0,
                background: "transparent",
            });
        }

        // Check for auto-print parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("print") === "1") {
            setTimeout(() => {
                window.print();
            }, 800);
        }
    }, [order]);

    return (
        <AdminLayout>
            <Head title={`Invoice - ${order.order_number}`} />

            <div className="p-2 md:p-8 min-h-screen font-sans bg-slate-50 print:bg-white">
                {/* Control Header */}
                <div className="max-w-[850px] mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 print:hidden">
                    <Link
                        href={route("admin.orders.show", order.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-all"
                    >
                        <ChevronLeft size={16} /> Back to Order
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#AD0100] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-xl hover:bg-red-700 transition-all active:scale-95"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>

                {/* THE INVOICE TEMPLATE */}
                <div
                    className="max-w-[850px] mx-auto bg-white p-4 md:p-6 border-[2.5px] border-black shadow-2xl print:shadow-none print:border-none print:p-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <div className="w-40">
                                <img
                                    src="/img/logo.png"
                                    className="w-full h-auto"
                                    alt="Logo"
                                    style={{ mixBlendMode: "multiply" }}
                                />
                                <div className="mt-2 text-[10px] font-black text-black uppercase leading-tight tracking-wider">
                                    QUALITY SUPPLY, TRUSTED SERVICE
                                    <div className="text-[9px] font-bold normal-case text-slate-500 mt-0.5">
                                        OEM & Aftermarket Auto Parts
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col text-[12px] pt-0.5">
                                <span className="text-[22px] font-black text-black leading-none mb-2 uppercase italic tracking-tighter">
                                    {settings.site_name || "PARTS PANEL"}
                                </span>
                                <div className="space-y-1 font-bold text-black text-[11px]">
                                    <p className="flex items-center gap-2">
                                        <MapPin
                                            size={12}
                                            className="text-slate-400"
                                        />
                                        {settings.address ||
                                            "2416 Wyecroft Road, Unit 1, Oakville, ON, L6L 6M6"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone
                                            size={12}
                                            className="text-slate-400"
                                        />
                                        {settings.contact_phone ||
                                            "345-887-1254"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Mail
                                            size={12}
                                            className="text-slate-400"
                                        />
                                        {settings.contact_email ||
                                            "sales@partspanel.com"}
                                    </p>
                                    <p className="flex items-center gap-2 underline">
                                        <Eye
                                            size={12}
                                            className="text-slate-400"
                                        />
                                        <a
                                            href={
                                                usePage().props.app_url || "#"
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#AD0100] transition-colors"
                                        >
                                            {usePage().props.app_url
                                                ? `www.${usePage().props.app_url.replace(/^https?:\/\/(www\.)?/, "")}`
                                                : "www.partspanel.com"}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <table className="border-collapse border-2 border-black text-[11px] w-72">
                                <tbody>
                                    <tr className="border-b-2 border-black">
                                        <td className="border-r-2 border-black bg-slate-100 p-1 font-black text-black text-center uppercase w-1/2 italic leading-tight">
                                            Date
                                        </td>
                                        <td className="p-1 px-2 text-right font-black">
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 border-black">
                                        <td className="border-r-2 border-black bg-slate-100 p-1 font-black text-black text-center uppercase italic leading-tight">
                                            Order Number
                                        </td>
                                        <td className="p-1 px-2 text-right font-black">
                                            #{order.order_number}
                                        </td>
                                    </tr>
                                    <tr className="border-b-2 border-black">
                                        <td className="border-r-2 border-black bg-slate-100 p-1 font-black text-black text-center uppercase italic leading-tight">
                                            Invoice Number
                                        </td>
                                        <td className="p-1 px-2 text-right font-black">
                                            INV-
                                            {order.order_number.replace(
                                                "OR",
                                                "",
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-r-2 border-black bg-slate-100 p-1 font-black text-black text-center uppercase italic leading-tight">
                                            P.O. Number
                                        </td>
                                        <td className="p-1 px-2 text-right font-black text-red-600">
                                            {order.po_number || "-"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Barcode SVG */}
                            <div className="w-72 mt-1 flex justify-center items-center py-0.5 overflow-hidden bg-white">
                                <svg
                                    ref={barcodeRef}
                                    className="w-full max-h-[35px]"
                                ></svg>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Ship To */}
                    <div className="grid grid-cols-2 border-2 border-black text-[11px] mb-4">
                        <div className="border-r-2 border-black">
                            <div className="font-black text-black bg-slate-100 p-1.5 mb-1.5 border-b-2 border-black text-center uppercase italic tracking-widest text-[11px]">
                                Bill To
                            </div>
                            <div className="p-3 pt-0 space-y-0.5 text-[11px]">
                                <div className="flex gap-1">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Name:
                                    </span>
                                    <span className="font-black text-[13px] text-black">
                                        {order.user.first_name}{" "}
                                        {order.user.last_name}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-baseline">
                                    <span className="font-bold text-slate-500 whitespace-nowrap text-[10px]">
                                        Company:
                                    </span>
                                    <span className="font-bold text-slate-800 uppercase tracking-tight text-[10px]">
                                        {order.user.company_name || "N/A"}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-start mt-0.5">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Address:
                                    </span>
                                    <span className="text-slate-600 font-medium whitespace-pre-line leading-tight">
                                        {order.billing_address ||
                                            order.user.address}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-center mt-1">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Phone:
                                    </span>
                                    <span className="font-black text-black">
                                        {order.user.phone_number}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Email:
                                    </span>
                                    <span className="font-bold text-slate-500">
                                        {order.user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="font-black text-black bg-slate-100 p-1.5 mb-1.5 border-b-2 border-black text-center uppercase italic tracking-widest text-[11px] flex items-center justify-center gap-2">
                                Ship To
                                <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-sm not-italic normal-case tracking-normal">
                                    {order.address_type || "Business"}
                                </span>
                            </div>
                            <div className="p-3 pt-0 space-y-0.5 text-[11px]">
                                <div className="flex gap-1">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Name:
                                    </span>
                                    <span className="font-black text-[13px] text-black">
                                        {order.user.first_name}{" "}
                                        {order.user.last_name}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-baseline">
                                    <span className="font-bold text-slate-500 whitespace-nowrap text-[10px]">
                                        Company:
                                    </span>
                                    <span className="font-bold text-slate-800 uppercase tracking-tight text-[10px]">
                                        {order.user.company_name || "N/A"}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-start mt-0.5">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Address:
                                    </span>
                                    <span className="text-slate-600 font-medium whitespace-pre-line leading-tight">
                                        {order.order_type === "Pick up"
                                            ? order.billing_address ||
                                              order.user.address
                                            : order.shipping_address ||
                                              order.user.address}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-center mt-1">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Phone:
                                    </span>
                                    <span className="font-black text-black">
                                        {order.user.phone_number}
                                    </span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span className="font-bold text-slate-500 whitespace-nowrap">
                                        Email:
                                    </span>
                                    <span className="font-bold text-slate-500">
                                        {order.user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info Bar */}
                    <div className="grid grid-cols-3 border-2 border-black text-[11px] mb-4 text-center">
                        <div className="border-r-2 border-black">
                            <div className="bg-slate-100 p-1.5 font-black border-b-2 border-black uppercase italic tracking-widest">
                                Method
                            </div>
                            <div className="p-2 font-black text-[12px] text-black italic">
                                {order.order_type}
                            </div>
                        </div>
                        <div className="border-r-2 border-black">
                            <div className="bg-slate-100 p-1.5 font-black border-b-2 border-black uppercase italic tracking-widest">
                                Store
                            </div>
                            <div className="p-2 font-black text-[12px] text-black italic">
                                Oakville Warehouse
                            </div>
                        </div>
                        <div>
                            <div className="bg-slate-100 p-1.5 font-black border-b-2 border-black uppercase italic tracking-widest">
                                Payment
                            </div>
                            <div className="p-2 font-black text-[12px] text-black uppercase italic">
                                {order.payment?.status === "succeeded"
                                    ? "PAID"
                                    : "DUE"}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border-2 border-black mb-4">
                        <table className="w-full border-collapse text-[11px]">
                            <thead>
                                <tr className="bg-slate-100 font-black uppercase italic tracking-widest text-[11px] border-b-2 border-black">
                                    <th className="p-2 text-left border-r-2 border-black w-32">
                                        SKU
                                    </th>
                                    <th className="p-2 text-left border-r-2 border-black">
                                        Description
                                    </th>
                                    <th className="p-2 text-center border-r-2 border-black w-20">
                                        QTY
                                    </th>
                                    <th className="p-2 text-right border-r-2 border-black w-28">
                                        Unit Price
                                    </th>
                                    <th className="p-2 text-right w-28">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black">
                                {order.items.map((item) => (
                                    <tr key={item.id} className="font-bold">
                                        <td className="p-2 text-blue-700 underline uppercase tracking-tighter border-r-2 border-black">
                                            {item.product.sku}
                                        </td>
                                        <td className="p-2 text-[11px] leading-tight border-r-2 border-black uppercase px-3">
                                            {item.product.description}
                                        </td>
                                        <td className="p-2 text-center text-[13px] font-black border-r-2 border-black">
                                            {item.quantity}
                                        </td>
                                        <td className="p-2 text-right border-r-2 border-black">
                                            ${parseFloat(item.price).toFixed(2)}
                                        </td>
                                        <td className="p-2 text-right font-black">
                                            $
                                            {(
                                                item.quantity * item.price
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {/* Filler rows */}
                                {Array.from({
                                    length: Math.max(
                                        0,
                                        10 - order.items.length,
                                    ),
                                }).map((_, i) => (
                                    <tr key={`filler-${i}`} className="h-8">
                                        <td className="border-r-2 border-black p-1"></td>
                                        <td className="border-r-2 border-black p-1"></td>
                                        <td className="border-r-2 border-black p-1"></td>
                                        <td className="border-r-2 border-black p-1"></td>
                                        <td className="p-1"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mb-4">
                        <table className="border-collapse border-2 border-black text-[12px] w-[300px]">
                            <tbody>
                                <tr>
                                    <td className="bg-slate-100 p-2 font-black text-black uppercase w-40 border-r-2 border-black italic">
                                        Subtotal
                                    </td>
                                    <td className="p-2 text-right font-black">
                                        ${parseFloat(order.subtotal).toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="border-t-2 border-black">
                                    <td className="bg-slate-100 p-2 font-black text-black uppercase border-r-2 border-black italic">
                                        Discount
                                    </td>
                                    <td className="p-2 text-right font-black">
                                        (0.00)
                                    </td>
                                </tr>
                                <tr className="border-t-2 border-black">
                                    <td className="bg-slate-100 p-2 font-black text-black uppercase border-r-2 border-black italic flex items-center justify-between">
                                        <span>Tax</span>
                                        <span className="text-[10px] font-bold opacity-70 normal-case">
                                            ON 13%
                                        </span>
                                    </td>
                                    <td className="p-2 text-right font-black">
                                        ${parseFloat(order.tax).toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="border-t-[3px] border-black">
                                    <td className="bg-slate-100 p-2.5 font-black text-black text-[16px] uppercase border-r-2 border-black italic">
                                        Total
                                    </td>
                                    <td className="p-2.5 text-right font-black text-[24px] leading-none shrink-0 italic">
                                        $
                                        {parseFloat(order.total_amount).toFixed(
                                            2,
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer red bar with locations */}
                    <div className="bg-[#AD0100] text-white font-black text-[10px] uppercase p-2.5 flex justify-center gap-4 tracking-[0.2em] mt-auto">
                        <span>OAKVILLE</span>
                        <span className="opacity-30">|</span>
                        <span>MISSISSAUGA</span>
                        <span className="opacity-30">|</span>
                        <span>BRAMPTON</span>
                        <span className="opacity-30">|</span>
                        <span>LONDON</span>
                        <span className="opacity-30">|</span>
                        <span>SASKATOON</span>
                        <span className="opacity-30">|</span>
                        <span>REGINA</span>
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
                        transform: scale(0.98);
                        transform-origin: top center;
                    }
                    @page { margin: 0.5cm; size: portrait; }
                }
            `,
                }}
            />
        </AdminLayout>
    );
}
