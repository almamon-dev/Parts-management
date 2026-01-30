import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { 
    Users, 
    Save, 
    Plus, 
    Trash2, 
    ChevronLeft,
    Hash,
    Car,
    FileText,
    MapPin,
    Package,
} from "lucide-react";
import { Input } from "@/Components/ui/admin/input";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        shop_name: "",
        name: "",
        contact_number: "",
        email: "",
        street_address: "",
        unit_number: "",
        city: "",
        province: "",
        postcode: "",
        country: "",
        notes: "",
        vehicle_info: "",
        vin: "",
        color_code: "",
        engine_size: "",
        status: "Quote",
        po_number: "",
        parts: [
            {
                part_name: "",
                vendor: "",
                buy_price: "0",
                sell_price: "0",
                payment_status: "None",
                method: "Cash",
                status: "",
            }
        ]
    });

    const addPartRow = () => {
        setData("parts", [
            ...data.parts,
            {
                part_name: "",
                vendor: "",
                buy_price: "0",
                sell_price: "0",
                payment_status: "None",
                method: "Cash",
                status: "",
            }
        ]);
    };

    const removePartRow = (index) => {
        const newParts = [...data.parts];
        newParts.splice(index, 1);
        setData("parts", newParts);
    };

    const handlePartChange = (index, field, value) => {
        const newParts = [...data.parts];
        newParts[index][field] = value;
        setData("parts", newParts);
    };

    const handleSubmit = () => {
        post(route("admin.leads.store"));
    };

    return (
        <AdminLayout>
            <Head title="Create New Lead" />

            <div className="font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Plus className="text-[#FF9F43]" size={20} /> 
                            <span>Create New Lead</span>
                        </h1>
                        <p className="text-slate-500 text-[12px] mt-0.5">Capture lead, vehicle, and part details.</p>
                    </div>
                    <Link
                        href={route("admin.leads.index")}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <ChevronLeft size={14} /> Back
                    </Link>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-9 space-y-4">
                        {/* Shop & Requester Info */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Users size={16} className="text-[#FF9F43]" />
                                Shop & Requester Info
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                    label="Shop"
                                    placeholder="Enter shop name"
                                    className="text-[13px] h-9"
                                    value={data.shop_name}
                                    onChange={(e) => setData("shop_name", e.target.value)}
                                    error={errors.shop_name}
                                />
                                <Input
                                    label="Customer Name"
                                    placeholder="Enter name"
                                    className="text-[13px] h-9"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    error={errors.name}
                                />
                                <Input
                                    label="Phone"
                                    placeholder="Telephone number"
                                    className="text-[13px] h-9"
                                    value={data.contact_number}
                                    onChange={(e) => setData("contact_number", e.target.value)}
                                    error={errors.contact_number}
                                />
                                <Input
                                    label="Email"
                                    placeholder="Email address"
                                    type="email"
                                    className="text-[13px] h-9"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    error={errors.email}
                                />
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <MapPin size={16} className="text-[#FF9F43]" />
                                Address Details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <div className="sm:col-span-8">
                                        <Input
                                            label="Street Address"
                                            placeholder="Street address"
                                            className="text-[13px] h-9"
                                            value={data.street_address}
                                            onChange={(e) => setData("street_address", e.target.value)}
                                            error={errors.street_address}
                                        />
                                    </div>
                                    <div className="sm:col-span-4">
                                        <Input
                                            label="Unit #"
                                            placeholder="Unit #"
                                            className="text-[13px] h-9"
                                            value={data.unit_number}
                                            onChange={(e) => setData("unit_number", e.target.value)}
                                            error={errors.unit_number}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Input
                                        label="City"
                                        placeholder="City"
                                        className="text-[13px] h-9"
                                        value={data.city}
                                        onChange={(e) => setData("city", e.target.value)}
                                        error={errors.city}
                                    />
                                    <Input
                                        label="Province"
                                        placeholder="Province"
                                        className="text-[13px] h-9"
                                        value={data.province}
                                        onChange={(e) => setData("province", e.target.value)}
                                        error={errors.province}
                                    />
                                    <Input
                                        label="Postcode"
                                        placeholder="Postcode"
                                        className="text-[13px] h-9"
                                        value={data.postcode}
                                        onChange={(e) => setData("postcode", e.target.value)}
                                        error={errors.postcode}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                        label="Country"
                                        placeholder="Country"
                                        className="text-[13px] h-9"
                                        value={data.country}
                                        onChange={(e) => setData("country", e.target.value)}
                                        error={errors.country}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Specification */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Car size={16} className="text-[#FF9F43]" />
                                Vehicle Info
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                <div className="sm:col-span-12 xl:col-span-6">
                                    <Input
                                        label="Vehicle Details"
                                        placeholder="Year, Make, Model, Trim Level"
                                        className="text-[13px] h-9"
                                        value={data.vehicle_info}
                                        onChange={(e) => setData("vehicle_info", e.target.value)}
                                        error={errors.vehicle_info}
                                    />
                                </div>
                                <div className="sm:col-span-6 xl:col-span-2">
                                    <Input
                                        label="VIN / Frame"
                                        placeholder="VIN or Frame #"
                                        className="text-[13px] h-9"
                                        value={data.vin}
                                        onChange={(e) => setData("vin", e.target.value)}
                                        error={errors.vin}
                                    />
                                </div>
                                <div className="sm:col-span-3 xl:col-span-2">
                                    <Input
                                        label="Color Code"
                                        placeholder="Code"
                                        className="text-[13px] h-9"
                                        value={data.color_code}
                                        onChange={(e) => setData("color_code", e.target.value)}
                                        error={errors.color_code}
                                    />
                                </div>
                                <div className="sm:col-span-3 xl:col-span-2">
                                    <Input
                                        label="Engine Size"
                                        placeholder="Size"
                                        className="text-[13px] h-9"
                                        value={data.engine_size}
                                        onChange={(e) => setData("engine_size", e.target.value)}
                                        error={errors.engine_size}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Parts Selection */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Package size={18} className="text-[#FF9F43]" />
                                    Parts Selection
                                </h3>
                                <button
                                    type="button"
                                    onClick={addPartRow}
                                    className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Plus size={14} /> Add Row
                                </button>
                            </div>

                            {/* Table Header Labels */}
                            <div className="hidden xl:grid grid-cols-12 gap-3 mb-2 px-2">
                                <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Part Name</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Vendor</div>
                                <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Buy</div>
                                <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Sell</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Payment</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Method</div>
                                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</div>
                            </div>

                            <div className="space-y-3">
                                {data.parts.map((part, idx) => (
                                    <div 
                                        key={idx} 
                                        className="grid grid-cols-1 xl:grid-cols-12 gap-2 items-center bg-slate-50/30 p-2 rounded-xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md"
                                    >
                                        {/* Row Remove Button (Floating) */}
                                        {data.parts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePartRow(idx)}
                                                className="absolute -right-2 -top-2 xl:top-1/2 xl:-translate-y-1/2 xl:-left-3 xl:right-auto opacity-100 xl:opacity-0 group-hover:opacity-100 transition-all z-10 bg-white text-rose-500 border border-rose-100 rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}

                                        {/* Parts Input */}
                                        <div className="col-span-12 xl:col-span-2">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">Part Name</div>
                                            <input
                                                placeholder="Part name"
                                                className={`w-full h-9 bg-white border ${errors[`parts.${idx}.part_name`] ? 'border-rose-300' : 'border-slate-200'} rounded-lg px-2 text-[12px] focus:ring-2 focus:ring-[#FF9F43]/20 focus:border-[#FF9F43] outline-none transition-all font-medium`}
                                                value={part.part_name}
                                                onChange={(e) => handlePartChange(idx, "part_name", e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addPartRow();
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* Vendor */}
                                        <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">Vendor</div>
                                            <select 
                                                className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
                                                value={part.vendor}
                                                onChange={(e) => handlePartChange(idx, "vendor", e.target.value)}
                                            >
                                                <option value="">Vendor</option>
                                                <option value="OEM">OEM</option>
                                                <option value="Aftermarket">Aftermarket</option>
                                                <option value="Used">Used</option>
                                            </select>
                                        </div>

                                        {/* Buy Price */}
                                        <div className="col-span-3 sm:col-span-2 xl:col-span-1">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">Buy</div>
                                            <input
                                                placeholder="Buy"
                                                type="number"
                                                className="w-full h-9 bg-white border border-slate-200 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition-all outline-none text-center focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10"
                                                value={part.buy_price}
                                                onChange={(e) => handlePartChange(idx, "buy_price", e.target.value)}
                                            />
                                        </div>

                                        {/* Sell Price */}
                                        <div className="col-span-3 sm:col-span-2 xl:col-span-1">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">Sell</div>
                                            <input
                                                placeholder="Sell"
                                                type="number"
                                                className="w-full h-9 bg-white border border-[#FF9F43]/30 rounded-lg px-1 text-[11px] font-black text-[#FF9F43] transition-all outline-none text-center focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10"
                                                value={part.sell_price}
                                                onChange={(e) => handlePartChange(idx, "sell_price", e.target.value)}
                                            />
                                        </div>

                                        {/* Payment Status */}
                                        <div className="col-span-6 sm:col-span-2 xl:col-span-2">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">Payment</div>
                                            <select 
                                                className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
                                                value={part.payment_status}
                                                onChange={(e) => handlePartChange(idx, "payment_status", e.target.value)}
                                            >
                                                <option value="None">None</option>
                                                <option value="Due">Due</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Deposit">Deposit</option>
                                            </select>
                                        </div>

                                        {/* Method */}
                                        <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">Method</div>
                                            <select 
                                                className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
                                                value={part.method}
                                                onChange={(e) => handlePartChange(idx, "method", e.target.value)}
                                            >
                                                <option value="None">None</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Card">Card</option>
                                                <option value="E-Transfer">Bank Transfer</option>
                                            </select>
                                        </div>

                                        {/* Row Status */}
                                        <div className="col-span-12 xl:col-span-2">
                                            <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">Status</div>
                                            <select 
                                                className="w-full h-9 bg-[#FF9F43]/5 border border-[#FF9F43]/10 text-[#FF9F43] font-bold rounded-lg px-2 text-[11px] uppercase tracking-wider transition-all outline-none"
                                                value={part.status}
                                                onChange={(e) => handlePartChange(idx, "status", e.target.value)}
                                            >
                                                <option value="">Status</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Ordered">Ordered</option>
                                                <option value="Received">Received</option>
                                                <option value="Canceled">Canceled</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Additional Notes & PO */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <FileText size={16} className="text-[#FF9F43]" />
                                    Notes
                                </h3>
                                <Input
                                    isTextArea
                                    placeholder="Requirements or notes..."
                                    className="min-h-[100px] text-[12px] focus:ring-[#FF9F43]/10"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                />
                            </div>
                            
                            <div className="pt-3 border-t border-slate-50">
                                <Input
                                    label="PO Number"
                                    placeholder="Enter PO number"
                                    className="text-[13px] h-9 font-bold text-[#D93025]"
                                    value={data.po_number}
                                    onChange={(e) => setData("po_number", e.target.value)}
                                    error={errors.po_number}
                                />
                            </div>
                        </div>

                        {/* Payment & Method Quick Toggle */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                             <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Default Settings</h4>
                             
                             <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-semibold text-slate-700">Default Method</label>
                                    <select 
                                        className="w-full h-9 bg-slate-50 border border-slate-100 rounded-lg px-2 text-[12px] focus:bg-white transition-all"
                                        onChange={(e) => {
                                            const updated = data.parts.map(p => ({...p, method: e.target.value}));
                                            setData("parts", updated);
                                        }}
                                    >
                                        <option> None </option>
                                        <option>Cash</option>
                                        <option>Card</option>
                                        <option>Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-semibold text-slate-700">Default Payment Status</label>
                                    <select 
                                        className="w-full h-9 bg-slate-50 border border-slate-100 rounded-lg px-2 text-[12px] focus:bg-white transition-all"
                                        onChange={(e) => {
                                            const updated = data.parts.map(p => ({...p, payment_status: e.target.value}));
                                            setData("parts", updated);
                                        }}
                                    >
                                        <option value="None">None</option>
                                        <option value="Due">Due</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Deposit">Deposit</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 pt-2 border-t border-slate-50">
                                    <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${data.status === 'Quote' ? 'bg-yellow-400' : data.status === 'Processing' ? 'bg-red-500' : 'bg-green-500'}`} />
                                        Lead Execution Status
                                    </label>
                                    <select 
                                        className="w-full h-9 bg-slate-50 border border-slate-100 rounded-lg px-2 text-[12px] font-bold focus:bg-white transition-all"
                                        value={data.status}
                                        onChange={(e) => setData("status", e.target.value)}
                                    >
                                        <option value="Quote">Quote</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Fulfilled">Fulfilled</option>
                                    </select>
                                </div>
                             </div>
                        </div>

                        {/* Form Submission */}
                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex-1 bg-[#FF9F43] text-white h-9 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#e68a30] active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Save size={16} />
                                {processing ? "Saving..." : "Save Lead Info"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="w-16 bg-slate-100 text-slate-500 h-9 rounded-lg font-bold text-[12px] hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
