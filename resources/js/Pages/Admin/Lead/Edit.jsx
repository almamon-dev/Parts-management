import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import axios from "axios";
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
    Pencil,
} from "lucide-react";
import { Input } from "@/Components/ui/admin/input";
import { Select } from "@/Components/ui/admin/Select";
import { VENDORS } from "@/Constants/vendors";
import { MAKES as MAKES_LIST } from "@/Constants/makes";
import { MODELS } from "@/Constants/models";

const MAKES_OPTIONS = MAKES_LIST.map((make) => ({ value: make, label: make }));

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 1995 + i)
    .reverse()
    .map((year) => ({ value: year.toString(), label: year.toString() }));

const getModelsForMake = (make) => {
    if (!make || !MODELS[make]) return [];
    return MODELS[make].map((model) => ({ value: model, label: model }));
};

export default function Edit({ lead }) {
    // Helper function to parse vehicle_info into year, make, model, trim
    const parseVehicleInfo = (vehicleInfoString) => {
        const parts = (vehicleInfoString || "").split(" ");
        let year = "";
        let make = "";
        let model = "";
        let trim = "";

        if (parts.length > 0 && !isNaN(parseInt(parts[0]))) {
            year = parts[0];
            parts.shift(); // Remove year
        }

        if (parts.length > 0) {
            // Try to find a known make
            const foundMake = MAKES_LIST.find(
                (m) => m.toLowerCase() === parts[0].toLowerCase(),
            );
            if (foundMake) {
                make = foundMake;
                parts.shift(); // Remove make
            } else {
                // If no known make, assume the first part is make
                make = parts[0];
                parts.shift();
            }
        }

        if (parts.length > 0 && make && MODELS[make]) {
            // Try to find a known model for the make
            let currentModelCandidate = "";
            let modelFound = false;
            for (let i = 0; i < parts.length; i++) {
                currentModelCandidate += (i > 0 ? " " : "") + parts[i];
                if (
                    MODELS[make].some(
                        (m) =>
                            m.toLowerCase() ===
                            currentModelCandidate.toLowerCase(),
                    )
                ) {
                    model = MODELS[make].find(
                        (m) =>
                            m.toLowerCase() ===
                            currentModelCandidate.toLowerCase(),
                    );
                    trim = parts.slice(i + 1).join(" ");
                    modelFound = true;
                    break;
                }
            }
            if (!modelFound) {
                // If no specific model found, assume the first part is model and rest is trim
                model = parts[0];
                trim = parts.slice(1).join(" ");
            }
        } else if (parts.length > 0) {
            // If no make or no models for make, assume first part is model, rest is trim
            model = parts[0];
            trim = parts.slice(1).join(" ");
        }

        return { year, make, model, trim };
    };

    const {
        year: initialYear,
        make: initialMake,
        model: initialModel,
        trim: initialTrim,
    } = parseVehicleInfo(lead.vehicle_info);

    const { data, setData, put, processing, errors, reset, transform } =
        useForm({
            po_number: lead.po_number || "",
            shop_name: lead.shop_name || "",
            name: lead.name || "",
            contact_number: lead.contact_number || "",
            email: lead.email || "",
            street_address: lead.street_address || "",
            unit_number: lead.unit_number || "",
            city: lead.city || "",
            province: lead.province || "",
            postcode: lead.postcode || "",
            country: lead.country || "",
            shipping_street_address: lead.shipping_street_address || "",
            shipping_unit_number: lead.shipping_unit_number || "",
            shipping_city: lead.shipping_city || "",
            shipping_province: lead.shipping_province || "",
            shipping_postcode: lead.shipping_postcode || "",
            shipping_country: lead.shipping_country || "",
            notes: lead.notes || "",
            year: initialYear,
            make: initialMake,
            model: initialModel,
            trim: initialTrim,
            vin: lead.vin || "",
            color_code: lead.color_code || "",
            engine_size: lead.engine_size || "",
            status: lead.status || "Quote",
            parts:
                lead.parts.length > 0
                    ? lead.parts.map((p) => ({
                          ...p,
                          status: p.status || "None",
                          method: p.method || "None",
                          payment_status: p.payment_status || "None",
                      }))
                    : [
                          {
                              part_name: "",
                              vendor: "",
                              buy_price: "0",
                              sell_price: "0",
                              payment_status: "None",
                              method: "None",
                              status: "None",
                          },
                      ],
        });

    const [sameAsBilling, setSameAsBilling] = React.useState(false);

    React.useEffect(() => {
        if (sameAsBilling) {
            setData((prev) => ({
                ...prev,
                shipping_street_address: prev.street_address,
                shipping_unit_number: prev.unit_number,
                shipping_city: prev.city,
                shipping_province: prev.province,
                shipping_postcode: prev.postcode,
                shipping_country: prev.country,
            }));
        }
    }, [
        sameAsBilling,
        data.street_address,
        data.unit_number,
        data.city,
        data.province,
        data.postcode,
        data.country,
    ]);

    const addPartRow = () => {
        setData("parts", [
            ...data.parts,
            {
                part_name: "",
                vendor: "",
                buy_price: "0",
                sell_price: "0",
                payment_status: "None",
                method: "None",
                status: "None",
            },
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

    const fetchCustomerInfo = async (phone) => {
        if (phone.length < 10) return;
        try {
            const response = await axios.get(
                route("admin.leads.search-by-phone"),
                {
                    params: { phone },
                },
            );
            if (response.data.found) {
                const results = response.data.lead;
                setData((prev) => ({
                    ...prev,
                    shop_name: results.shop_name || prev.shop_name,
                    name: results.name || prev.name,
                    email: results.email || prev.email,
                    street_address:
                        results.street_address || prev.street_address,
                    unit_number: results.unit_number || prev.unit_number,
                    city: results.city || prev.city,
                    province: results.province || prev.province,
                    postcode: results.postcode || prev.postcode,
                    country: results.country || prev.country,
                }));
            }
        } catch (error) {
            console.error("Error fetching customer info:", error);
        }
    };

    const handleSubmit = () => {
        transform((data) => ({
            ...data,
            vehicle_info:
                `${data.year || ""} ${data.make || ""} ${data.model || ""} ${data.trim || ""}`
                    .trim()
                    .replace(/\s+/g, " "),
        }));

        put(route("admin.leads.update", lead.id));
    };

    const totalBuy = data.parts.reduce(
        (acc, part) => acc + (parseFloat(part.buy_price) || 0),
        0,
    );
    const totalSell = data.parts.reduce(
        (acc, part) => acc + (parseFloat(part.sell_price) || 0),
        0,
    );

    return (
        <AdminLayout>
            <Head title={`Edit Lead - ${lead.shop_name}`} />

            <div className="font-sans px-4 py-4 transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Pencil className="text-[#FF9F43]" size={24} />
                            Edit Lead: {lead.shop_name}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Update lead, vehicle, and part details.
                        </p>
                    </div>
                    <Link
                        href={route("admin.leads.index")}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <ChevronLeft size={16} /> Back
                    </Link>
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-3"
                >
                    {/* Top Row: Shop Info, Notes/PO, and Default Settings */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Shop & Requester Info */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Users size={18} className="text-[#FF9F43]" />
                                Shop & Requester Info
                            </h3>

                            <div className="grid grid-cols-1 gap-2">
                                <Input
                                    label="Shop"
                                    placeholder="Enter shop name"
                                    className="text-xs h-8"
                                    value={data.shop_name}
                                    onChange={(e) =>
                                        setData("shop_name", e.target.value)
                                    }
                                    error={errors.shop_name}
                                />
                                <Input
                                    label="Customer Name"
                                    placeholder="Enter name"
                                    className="text-xs h-8"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Phone"
                                        placeholder="Telephone"
                                        className="text-xs h-8"
                                        value={data.contact_number}
                                        onChange={(e) => {
                                            setData(
                                                "contact_number",
                                                e.target.value,
                                            );
                                            if (e.target.value.length >= 10) {
                                                fetchCustomerInfo(
                                                    e.target.value,
                                                );
                                            }
                                        }}
                                        error={errors.contact_number}
                                    />
                                    <Input
                                        label="Email"
                                        placeholder="Email"
                                        type="email"
                                        className="text-xs h-8"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        error={errors.email}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes & PO */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col h-full">
                            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <FileText
                                    size={18}
                                    className="text-[#FF9F43]"
                                />
                                Notes
                            </h3>
                            <Input
                                isTextArea
                                placeholder="Requirements or notes..."
                                className="flex-1 min-h-[80px] text-xs focus:ring-[#FF9F43]/10 mb-3"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                            />
                            <Input
                                label="PO Number"
                                placeholder="PO Number"
                                className="text-xs h-8"
                                value={data.po_number || ""}
                                onChange={(e) =>
                                    setData("po_number", e.target.value)
                                }
                                error={errors.po_number}
                            />
                        </div>

                        {/* Default Settings */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                Default Settings
                            </h3>
                            <div className="space-y-2">
                                {/* Bulk Vendor */}
                                <div className="space-y-1">
                                    <label className="text-[12px] font-semibold text-slate-700">
                                        Default Vendor
                                    </label>
                                    <select
                                        className="w-full h-8 bg-slate-50/50 border border-slate-200 rounded-lg px-3 text-xs font-medium focus:bg-white transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-10"
                                        onChange={(e) => {
                                            const updated = data.parts.map(
                                                (p) => ({
                                                    ...p,
                                                    vendor: e.target.value,
                                                }),
                                            );
                                            setData("parts", updated);
                                        }}
                                    >
                                        <option value="">Select Vendor</option>
                                        <option value="OEM">OEM</option>
                                        <option value="Aftermarket">
                                            Aftermarket
                                        </option>
                                        <option value="Used">Used</option>
                                        {VENDORS.map((v, vIdx) => (
                                            <option key={vIdx} value={v}>
                                                {v}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Bulk Method */}
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] font-semibold text-slate-700">
                                            Default Method
                                        </label>
                                        <select
                                            className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg px-2 text-[12px] focus:bg-white transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center] bg-[length:1rem_1rem] bg-no-repeat pr-6"
                                            onChange={(e) => {
                                                const updated = data.parts.map(
                                                    (p) => ({
                                                        ...p,
                                                        method: e.target.value,
                                                    }),
                                                );
                                                setData("parts", updated);
                                            }}
                                        >
                                            <option value="None">None</option>
                                            <option value="Visa Debit">
                                                Visa Debit
                                            </option>
                                            <option value="Visa Credit">
                                                Visa Credit
                                            </option>
                                            <option value="MC Debit">
                                                MC Debit
                                            </option>
                                            <option value="MC Credit">
                                                MC Credit
                                            </option>
                                            <option value="E-Transfer">
                                                E-Transfer
                                            </option>
                                            <option value="Multiple">
                                                Multiple
                                            </option>
                                            <option value="Website">
                                                Website
                                            </option>
                                            <option value="Store Credit">
                                                Store Credit
                                            </option>
                                            <option value="Cheque">
                                                Cheque
                                            </option>
                                        </select>
                                    </div>

                                    {/* Bulk Payment Status */}
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] font-semibold text-slate-700">
                                            Default Payment
                                        </label>
                                        <select
                                            className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg px-2 text-[12px] focus:bg-white transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.5rem_center] bg-[length:1rem_1rem] bg-no-repeat pr-6"
                                            onChange={(e) => {
                                                const updated = data.parts.map(
                                                    (p) => ({
                                                        ...p,
                                                        payment_status:
                                                            e.target.value,
                                                    }),
                                                );
                                                setData("parts", updated);
                                            }}
                                        >
                                            <option value="None">None</option>
                                            <option value="Due">Due</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Deposit">
                                                Deposit
                                            </option>
                                            <option value="Refunded">
                                                Refunded
                                            </option>
                                            <option value="Canceled">
                                                Canceled
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Lead Status */}
                                <div className="pt-3 border-t border-slate-100">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                        Lead Execution Status
                                    </label>
                                    <select
                                        className="w-full h-8 border-2 border-slate-100 bg-white rounded-lg px-4 text-xs font-bold transition-all focus:border-[#FF9F43] focus:ring-4 focus:ring-[#FF9F43]/5 outline-none text-[#FF9F43] uppercase tracking-wide"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="Quote">Quote</option>
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Fulfilled">
                                            Fulfilled
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Row: Billing and Shipping */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {/* Billing Address */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-[#FF9F43]" />
                                Billing Address
                            </h3>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2">
                                        <Input
                                            label="Street Address"
                                            placeholder="Street address"
                                            className="text-xs h-8"
                                            value={data.street_address}
                                            onChange={(e) =>
                                                setData(
                                                    "street_address",
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.street_address}
                                        />
                                    </div>
                                    <Input
                                        label="Unit #"
                                        placeholder="Unit #"
                                        className="text-xs h-8"
                                        value={data.unit_number || ""}
                                        onChange={(e) =>
                                            setData(
                                                "unit_number",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.unit_number}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        label="City"
                                        placeholder="City"
                                        className="text-xs h-8"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                        error={errors.city}
                                    />
                                    <Input
                                        label="Province"
                                        placeholder="Province"
                                        className="text-xs h-8"
                                        value={data.province}
                                        onChange={(e) =>
                                            setData("province", e.target.value)
                                        }
                                        error={errors.province}
                                    />
                                    <Input
                                        label="Postcode"
                                        placeholder="Postcode"
                                        className="text-xs h-8"
                                        value={data.postcode}
                                        onChange={(e) =>
                                            setData("postcode", e.target.value)
                                        }
                                        error={errors.postcode}
                                    />
                                </div>
                                <Input
                                    label="Country"
                                    placeholder="Country"
                                    className="text-xs h-8"
                                    value={data.country}
                                    onChange={(e) =>
                                        setData("country", e.target.value)
                                    }
                                    error={errors.country}
                                />
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin
                                        size={18}
                                        className="text-[#FF9F43]"
                                    />
                                    Shipping Address
                                </h3>
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={sameAsBilling}
                                        onChange={(e) =>
                                            setSameAsBilling(e.target.checked)
                                        }
                                        className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43]"
                                    />
                                    <span className="font-medium">
                                        Same as Billing Address
                                    </span>
                                </label>
                            </div>
                            <div
                                className={`space-y-4 ${sameAsBilling ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2">
                                        <Input
                                            label="Street Address"
                                            placeholder="Street address"
                                            className="text-xs h-8"
                                            value={
                                                data.shipping_street_address ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "shipping_street_address",
                                                    e.target.value,
                                                )
                                            }
                                            error={
                                                errors.shipping_street_address
                                            }
                                        />
                                    </div>
                                    <Input
                                        label="Unit #"
                                        placeholder="Unit #"
                                        className="text-xs h-8"
                                        value={data.shipping_unit_number || ""}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_unit_number",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.shipping_unit_number}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        label="City"
                                        placeholder="City"
                                        className="text-xs h-8"
                                        value={data.shipping_city || ""}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_city",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.shipping_city}
                                    />
                                    <Input
                                        label="Province"
                                        placeholder="Province"
                                        className="text-xs h-8"
                                        value={data.shipping_province || ""}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_province",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.shipping_province}
                                    />
                                    <Input
                                        label="Postcode"
                                        placeholder="Postcode"
                                        className="text-xs h-8"
                                        value={data.shipping_postcode || ""}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_postcode",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.shipping_postcode}
                                    />
                                </div>
                                <Input
                                    label="Country"
                                    placeholder="Country"
                                    className="text-xs h-8"
                                    value={data.shipping_country || ""}
                                    onChange={(e) =>
                                        setData(
                                            "shipping_country",
                                            e.target.value,
                                        )
                                    }
                                    error={errors.shipping_country}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Car size={18} className="text-[#FF9F43]" />
                            Vehicle Info
                        </h3>
                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-2">
                                <Select
                                    label="Year"
                                    placeholder="Year"
                                    className="bg-white text-xs h-8"
                                    options={YEARS}
                                    value={data.year}
                                    onChange={(e) =>
                                        setData("year", e.target.value)
                                    }
                                    error={errors.year}
                                />
                            </div>
                            <div className="col-span-3">
                                <Select
                                    label="Make"
                                    placeholder="Make"
                                    className="bg-white text-xs h-8"
                                    options={data.year ? MAKES_OPTIONS : []}
                                    value={data.make}
                                    onChange={(e) => {
                                        setData("make", e.target.value);
                                        setData("model", "");
                                    }}
                                    disabled={!data.year}
                                    error={errors.make}
                                />
                            </div>
                            <div className="col-span-3">
                                <Select
                                    label="Model"
                                    placeholder="Model"
                                    className="bg-white text-xs h-8"
                                    options={getModelsForMake(data.make)}
                                    value={data.model}
                                    onChange={(e) =>
                                        setData("model", e.target.value)
                                    }
                                    disabled={!data.make}
                                    error={errors.model}
                                />
                            </div>
                            <div className="col-span-4">
                                <Input
                                    label="Trim / Submodel"
                                    placeholder="Trim (e.g. Laredo, XLE)"
                                    className="text-xs h-8"
                                    value={data.trim || ""}
                                    onChange={(e) =>
                                        setData("trim", e.target.value)
                                    }
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    label="VIN / Frame"
                                    placeholder="VIN or Frame #"
                                    className="text-xs h-8"
                                    value={data.vin}
                                    onChange={(e) =>
                                        setData("vin", e.target.value)
                                    }
                                    error={errors.vin}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="Color Code"
                                    placeholder="Code"
                                    className="text-xs h-8"
                                    value={data.color_code}
                                    onChange={(e) =>
                                        setData("color_code", e.target.value)
                                    }
                                    error={errors.color_code}
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="Engine Size"
                                    placeholder="Size"
                                    className="text-xs h-8"
                                    value={data.engine_size}
                                    onChange={(e) =>
                                        setData("engine_size", e.target.value)
                                    }
                                    error={errors.engine_size}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Parts Selection */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
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
                        <div className="hidden xl:grid grid-cols-12 gap-2 mb-2 px-2">
                            <div className="col-span-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Part Name
                            </div>
                            <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                Vendor
                            </div>
                            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                Buy
                            </div>
                            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                Sell
                            </div>
                            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                Payment
                            </div>
                            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                Method
                            </div>
                            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                                Status
                            </div>
                        </div>

                        <div className="space-y-3">
                            {data.parts.map((part, idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-12 gap-x-2 gap-y-2 items-center bg-slate-50/30 p-2 xl:p-1.5 rounded-xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md"
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
                                    <div className="col-span-12 xl:col-span-5">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">
                                            Part Name
                                        </div>
                                        <input
                                            placeholder="Part name"
                                            className={`w-full h-8 bg-white border ${errors[`parts.${idx}.part_name`] ? "border-rose-300" : "border-slate-200"} rounded-lg px-2 text-[12px] focus:ring-2 focus:ring-[#FF9F43]/20 focus:border-[#FF9F43] outline-none transition-all font-medium`}
                                            value={part.part_name}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "part_name",
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addPartRow();
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Vendor */}
                                    <div className="col-span-12 xl:col-span-2">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">
                                            Vendor
                                        </div>
                                        <select
                                            className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
                                            value={part.vendor}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "vendor",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">Vendor</option>
                                            <option value="OEM">OEM</option>
                                            <option value="Aftermarket">
                                                Aftermarket
                                            </option>
                                            <option value="Used">Used</option>
                                            {VENDORS.map((vendor, vIdx) => (
                                                <option
                                                    key={vIdx}
                                                    value={vendor}
                                                >
                                                    {vendor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Buy Price */}
                                    <div className="col-span-6 xl:col-span-1">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">
                                            Buy
                                        </div>
                                        <input
                                            placeholder="Buy"
                                            type="number"
                                            className="w-full h-8 bg-white border border-slate-200 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition-all outline-none text-center focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10"
                                            value={part.buy_price}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "buy_price",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Sell Price */}
                                    <div className="col-span-6 xl:col-span-1">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">
                                            Sell
                                        </div>
                                        <input
                                            placeholder="Sell"
                                            type="number"
                                            className="w-full h-8 bg-white border border-[#FF9F43]/30 rounded-lg px-1 text-[11px] font-black text-[#FF9F43] transition-all outline-none text-center focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10"
                                            value={part.sell_price}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "sell_price",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Payment Status */}
                                    <div className="col-span-6 xl:col-span-1">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">
                                            Payment
                                        </div>
                                        <select
                                            className="w-full h-8 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
                                            value={part.payment_status}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "payment_status",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="None">None</option>
                                            <option value="Due">Due</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Deposit">
                                                Deposit
                                            </option>
                                            <option value="Refunded">
                                                Refunded
                                            </option>
                                            <option value="Canceled">
                                                Canceled
                                            </option>
                                        </select>
                                    </div>

                                    {/* Method */}
                                    <div className="col-span-6 xl:col-span-1">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1 text-center">
                                            Method
                                        </div>
                                        <select
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
                                            value={part.method}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "method",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="None">None</option>
                                            <option value="Visa Debit">
                                                Visa Debit
                                            </option>
                                            <option value="Visa Credit">
                                                Visa Credit
                                            </option>
                                            <option value="MC Debit">
                                                MC Debit
                                            </option>
                                            <option value="MC Credit">
                                                MC Credit
                                            </option>
                                            <option value="E-Transfer">
                                                E-Transfer
                                            </option>
                                            <option value="Multiple">
                                                Multiple
                                            </option>
                                            <option value="Website">
                                                Website
                                            </option>
                                            <option value="Store Credit">
                                                Store Credit
                                            </option>
                                            <option value="Cheque">
                                                Cheque
                                            </option>
                                        </select>
                                    </div>

                                    {/* Row Status */}
                                    <div className="col-span-12 xl:col-span-1">
                                        <div className="xl:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">
                                            Status
                                        </div>
                                        <select
                                            className="w-full h-9 bg-[#FF9F43]/5 border border-[#FF9F43]/10 text-[#FF9F43] font-bold rounded-lg px-2 text-[11px] uppercase tracking-wider transition-all outline-none"
                                            value={part.status}
                                            onChange={(e) =>
                                                handlePartChange(
                                                    idx,
                                                    "status",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="None">None</option>
                                            <option value="Shipped">
                                                Shipped
                                            </option>
                                            <option value="Collected">
                                                Collected
                                            </option>
                                            <option value="Delivered">
                                                Delivered
                                            </option>
                                            <option value="To be Shipped">
                                                To be Shipped
                                            </option>
                                            <option value="To be Collected">
                                                To be Collected
                                            </option>
                                            <option value="To be Delivered">
                                                To be Delivered
                                            </option>
                                            <option value="To be Ordered">
                                                To be Ordered
                                            </option>
                                            <option value="Ordered">
                                                Ordered
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals Display */}
                        <div className="mt-4 pt-2 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-2">
                            <div className="flex items-center gap-2 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Total Buy
                                </span>
                                <span className="text-sm font-black text-slate-600">
                                    $
                                    {totalBuy.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-[#FF9F43]/5 px-3 py-1.5 rounded-lg border border-[#FF9F43]/10">
                                <span className="text-[9px] font-bold text-[#FF9F43] uppercase tracking-widest">
                                    Total Sell
                                </span>
                                <span className="text-sm font-black text-[#FF9F43]">
                                    $
                                    {totalSell.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="mt-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex-1 min-h-[38px] bg-[#FF9F43] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#e68a30] active:scale-[0.99] transition-all shadow-md shadow-[#FF9F43]/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                <Save size={16} />
                                {processing
                                    ? "Updating..."
                                    : "Update Lead Info"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-6 min-h-[38px] bg-slate-100 text-slate-500 rounded-lg font-bold text-[10px] hover:bg-slate-200 hover:text-slate-700 transition-all uppercase tracking-widest"
                            >
                                Reset Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
