import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { 
    ChevronLeft, 
    ShoppingCart, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar,
    Package,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    CreditCard,
    Info,
    Printer,
    Eye
} from "lucide-react";

export default function Show({ order }) {
    const { settings } = usePage().props;
    const { data, setData, patch, processing } = useForm({
        status: order.status
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('print') === '1') {
            // Short delay to ensure styles are loaded
            setTimeout(() => {
                window.print();
                // Optional: remove the query param without refreshing to avoid re-triggering
                window.history.replaceState({}, '', window.location.pathname);
            }, 500);
        }
    }, []);

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.orders.update-status', order.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Success toast or notification could be added here
            }
        });
    };

    const getStatusStyle = (status) => {
        const config = {
            processing: { classes: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500", icon: <Package size={14} /> },
            fulfilled: { classes: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500", icon: <CheckCircle2 size={14} /> },
            canceled: { classes: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500", icon: <XCircle size={14} /> },
        };
        const theme = config[status?.toLowerCase()] || { classes: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", icon: <Clock size={14} /> };
        
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${theme.classes}`}>
                <span className={`inline-flex rounded-full h-1.5 w-1.5 ${theme.dot}`}></span>
                {status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title={`Order ${order.order_number}`} />

            {/* Print-Only Professional Invoice Section */}
            <div className="hidden print:block bg-white p-0 text-slate-900 font-sans leading-tight">
                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        @page { margin: 0.5cm; }
                        body { background: white !important; }
                    }
                ` }} />
                
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-6">
                        <div className="w-40">
                             <img src="/img/logo.png" className="w-full h-auto" alt="Logo" />
                             <div className="mt-2 text-[10px] font-bold text-slate-700 uppercase tracking-tighter">
                                Quality Supply, Trusted Service
                             </div>
                             <div className="text-[9px] text-slate-500 leading-none">
                                OEM & Aftermarket Auto Parts
                             </div>
                        </div>
                        <div className="flex flex-col text-[11px] mt-2">
                            <span className="text-[16px] font-black text-slate-800 leading-none mb-1">{settings.site_name || 'Lee Auto Parts'}</span>
                            <span className="flex items-center gap-1 text-slate-500 font-medium whitespace-pre-line">
                                <MapPin size={10} className="shrink-0" />
                                {settings.address || '2416 Wyecroft Road, Unit 1, Oakville, ON, L6L 6M6'}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 font-medium mt-1">
                                <Phone size={10} className="shrink-0" />
                                {settings.contact_phone || '345-987-1254'}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 font-medium">
                                <Mail size={10} className="shrink-0" />
                                {settings.contact_email || 'sales@partspanel.com'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <table className="border-collapse border border-slate-400 text-[11px] w-56">
                            <tbody>
                                <tr>
                                    <td className="border border-slate-400 bg-slate-100 p-1 font-bold text-slate-700 w-24">Date</td>
                                    <td className="border border-slate-400 p-1 text-right">{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-400 bg-slate-100 p-1 font-bold text-slate-700">Order Number</td>
                                    <td className="border border-slate-400 p-1 text-right">{order.order_number}</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-400 bg-slate-100 p-1 font-bold text-slate-700">Invoice Number</td>
                                    <td className="border border-slate-400 p-1 text-right">INV-{order.order_number.replace('OR', '')}</td>
                                </tr>
                                <tr>
                                    <td className="border border-slate-400 bg-slate-100 p-1 font-bold text-slate-700">P.O. Number</td>
                                    <td className="border border-slate-400 p-1 text-right">-</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-2 text-center w-56 flex flex-col items-center">
                            <div className="h-10 w-full bg-repeating-linear-gradient flex items-center justify-center font-mono text-[10px] tracking-[0.5em] font-bold">
                                ||||||||||||||||||||||||||||||||||||||||||||||||
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To / Ship To */}
                <div className="grid grid-cols-2 border border-slate-400 text-[11px] mb-4">
                    <div className="p-2 border-r border-slate-400">
                        <div className="font-bold text-slate-700 bg-slate-100 -m-2 p-1.5 mb-2 border-b border-slate-400 text-center uppercase tracking-widest text-[10px]">Bill To</div>
                        <div className="font-bold">{order.user.first_name} {order.user.last_name}</div>
                        <div className="text-slate-600">{order.user.company_name}</div>
                        <div className="text-slate-600">{order.user.address}</div>
                        <div className="text-slate-600">{order.user.phone_number}</div>
                        <div className="text-slate-600">{order.user.email}</div>
                    </div>
                    <div className="p-2">
                        <div className="font-bold text-slate-700 bg-slate-100 -m-2 p-1.5 mb-2 border-b border-slate-400 text-center uppercase tracking-widest text-[10px]">Ship To</div>
                        <div className="font-bold">{order.user.first_name} {order.user.last_name}</div>
                        <div className="text-slate-600">{order.user.company_name}</div>
                        <div className="text-slate-600">{order.shipping_address || order.user.address}</div>
                        <div className="text-slate-600">{order.user.phone_number}</div>
                        <div className="text-slate-600">{order.user.email}</div>
                    </div>
                </div>

                {/* Method / Store / Payment */}
                <div className="grid grid-cols-3 border border-slate-400 text-[11px] mb-4 text-center">
                    <div className="border-r border-slate-400">
                        <div className="bg-slate-100 p-1 font-bold border-b border-slate-400 uppercase tracking-widest text-[10px]">Method</div>
                        <div className="p-1.5 font-bold">{order.order_type}</div>
                    </div>
                    <div className="border-r border-slate-400">
                        <div className="bg-slate-100 p-1 font-bold border-b border-slate-400 uppercase tracking-widest text-[10px]">Store</div>
                        <div className="p-1.5 font-bold">Oakville</div>
                    </div>
                    <div>
                        <div className="bg-slate-100 p-1 font-bold border-b border-slate-400 uppercase tracking-widest text-[10px]">Payment</div>
                        <div className="p-1.5 font-bold">{order.payment?.status === 'succeeded' ? 'PAID' : 'DUE'}</div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse border border-slate-400 text-[11px] mb-8">
                    <thead>
                        <tr className="bg-slate-100 font-bold uppercase tracking-wider text-[10px]">
                            <th className="border border-slate-400 p-2 text-left w-32">SKU</th>
                            <th className="border border-slate-400 p-2 text-left">Description</th>
                            <th className="border border-slate-400 p-2 text-center w-16">QTY</th>
                            <th className="border border-slate-400 p-2 text-right w-24">Unit Price</th>
                            <th className="border border-slate-400 p-2 text-right w-24">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td className="border border-slate-400 p-2 font-mono">{item.product.sku}</td>
                                <td className="border border-slate-400 p-2">{item.product.description}</td>
                                <td className="border border-slate-400 p-2 text-center font-bold">{item.quantity}</td>
                                <td className="border border-slate-400 p-2 text-right">${parseFloat(item.price).toFixed(2)}</td>
                                <td className="border border-slate-400 p-2 text-right font-bold">${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        {/* Filler rows to match layout if needed, but not strictly necessary for functionality */}
                        <tr className="h-64">
                            <td className="border border-slate-400 p-2"></td>
                            <td className="border border-slate-400 p-2"></td>
                            <td className="border border-slate-400 p-2"></td>
                            <td className="border border-slate-400 p-2"></td>
                            <td className="border border-slate-400 p-2"></td>
                        </tr>
                    </tbody>
                </table>

                {/* Subtotals & Totals */}
                <div className="flex justify-end pr-0">
                    <table className="border-collapse border border-slate-400 text-[11px] w-56">
                        <tbody>
                            <tr>
                                <td className="border border-slate-400 bg-slate-100 p-1.5 font-bold text-slate-700 w-24 uppercase tracking-tighter">Subtotal</td>
                                <td className="border border-slate-400 p-1.5 text-right font-bold">${parseFloat(order.subtotal).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="border border-slate-400 bg-slate-100 p-1.5 font-bold text-slate-700 uppercase tracking-tighter">Discount</td>
                                <td className="border border-slate-400 p-1.5 text-right font-bold">(0.00)</td>
                            </tr>
                            <tr>
                                <td className="border border-slate-400 bg-slate-100 p-1.5 font-bold text-slate-700 flex items-center justify-between uppercase tracking-tighter">
                                    <span>Tax</span>
                                    <span className="text-[8px] opacity-70">ON 13%</span>
                                </td>
                                <td className="border border-slate-400 p-1.5 text-right font-bold">${parseFloat(order.tax).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="border border-slate-400 bg-slate-100 p-1.5 font-black text-slate-900 text-[13px] uppercase tracking-wider">TOTAL</td>
                                <td className="border border-slate-400 p-1.5 text-right font-black text-[14px]">${parseFloat(order.total_amount).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Banner */}
                <div className="mt-12 flex items-center justify-between bg-[#EAB308] text-[8px] font-black uppercase text-white p-2">
                    <div className="flex-1 flex justify-center gap-4">
                        <span>OAKVILLE</span>
                        <span>|</span>
                        <span>MISSISSAUGA</span>
                        <span>|</span>
                        <span>BRAMPTON</span>
                        <span>|</span>
                        <span>LONDON</span>
                        <span>|</span>
                        <span>SASKATOON</span>
                        <span>|</span>
                        <span>REGINA</span>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans print:hidden">
                {/* Header Section - Aligned with Product/Edit */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Order {order.order_number}</h1>
                            {getStatusStyle(order.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-slate-500 text-[13px] font-medium">
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="opacity-60" /> {new Date(order.created_at).toLocaleString()}</span>
                            <span className="flex items-center gap-1.5 truncate max-w-[200px]"><User size={14} className="opacity-60" /> {order.user.first_name} {order.user.last_name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all font-sans"
                        >
                            <Printer size={16} /> Print Invoice
                        </button>
                        <Link
                            href={route("admin.orders.index")}
                            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            <ChevronLeft size={16} /> Back to Orders
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Order Items */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                                        <ShoppingCart size={18} className="text-[#FF9F43]" />
                                        Items in Order
                                    </h3>
                                    <span className="text-[11px] text-slate-400 font-medium ml-6 mt-1 flex items-center gap-1.5">
                                        Type: <span className="text-slate-900 font-bold">{order.order_type}</span>
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{order.items.length} items</span>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-50">
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Description</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Qty</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Price</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#FF9F43]/30 transition-colors">
                                                            {item.product.files?.[0] ? (
                                                                <img src={`/${item.product.files[0].file_path}`} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <Package size={20} className="text-slate-200" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-[13px] font-bold text-slate-800 truncate group-hover:text-[#FF9F43] transition-colors">{item.product.description}</span>
                                                            <span className="text-[11px] text-slate-400 font-bold tracking-tight">SKU: {item.product.sku}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-[13px] font-black text-slate-700">x{item.quantity}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-[13px] font-medium text-slate-600">${parseFloat(item.price).toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-[14px] font-black text-slate-900">${(item.quantity * item.price).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Detailed Summary Card */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                                <div className="space-y-3 w-full max-w-[320px] ml-auto">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500 font-medium">Subtotal</span>
                                        <span className="text-slate-800 font-bold">${parseFloat(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500 font-medium">Discount</span>
                                        <span className="text-slate-800 font-bold">$0.00</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-slate-500 font-medium">Tax & Fees</span>
                                        <span className="text-slate-800 font-bold">${parseFloat(order.tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between pt-4 mt-2 border-t border-slate-200">
                                        <span className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Net Amount</span>
                                        <div className="text-right">
                                            <span className="text-[20px] font-black text-[#FF9F43] leading-none block">${parseFloat(order.total_amount).toFixed(2)}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Total USD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Status Update Card - Unified Look */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                                <Clock size={18} className="text-[#FF9F43]" />
                                Fulfillment Status
                            </h3>
                            <div className="flex flex-col md:flex-row items-end gap-4">
                                <div className="flex-1 w-full">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Update Order Status</label>
                                    <select 
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full bg-slate-50 border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 py-3 px-4 focus:ring-[#FF9F43]/10 focus:border-[#FF9F43] transition-all outline-none"
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Fulfilled">Fulfilled</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={handleStatusUpdate}
                                    disabled={processing || data.status === order.status}
                                    className="w-full md:w-auto min-w-[160px] bg-[#FF9F43] text-white h-[46px] rounded-xl font-black text-[13px] hover:bg-[#e68a30] transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? 'Updating...' : 'Save Status'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Customer & Shipping */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Customer Overview */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                                <User size={18} className="text-[#FF9F43]" />
                                Customer Info
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Full Name</span>
                                        <span className="text-[14px] font-bold text-slate-900 truncate">{order.user.first_name} {order.user.last_name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 font-bold">
                                        <Mail size={20} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Email Address</span>
                                        <span className="text-[14px] font-bold text-slate-900 truncate">{order.user.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Contact Phone</span>
                                        <span className="text-[14px] font-bold text-slate-900 truncate tracking-tight">{order.user.phone_number || 'Not Provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logistics & Payment */}
                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 overflow-hidden">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                                <MapPin size={18} className="text-[#FF9F43]" />
                                Shipment & Billing
                            </h3>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-3">
                                    <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 px-1">
                                        <MapPin size={14} className="text-[#FF9F43]" /> Shipping Address
                                    </span>
                                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 text-[13px] text-slate-600 leading-relaxed font-medium italic">
                                        {order.shipping_address || 'Customer did not provide a shipping address.'}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2 px-1">
                                        <CreditCard size={14} className="text-[#FF9F43]" /> Payment Snapshot
                                    </span>
                                    <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[12px] text-slate-500 font-bold uppercase tracking-tight">Status</span>
                                            <span className={`text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${order.payment?.status === 'succeeded' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                {order.payment?.status || 'UNPAID'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                                            <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Txn ID</span>
                                            <span className="text-[11px] font-mono font-bold text-slate-600 truncate max-w-[140px]" title={order.payment?.transaction_id}>
                                                {order.payment?.transaction_id || 'manual_txn_entry'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {order.notes && (
                                    <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-100">
                                        <span className="text-[11px] text-[#e68a30] font-black uppercase tracking-widest flex items-center gap-2 mb-2 px-1">
                                            <Info size={14} /> Private Notes
                                        </span>
                                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic">"{order.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
