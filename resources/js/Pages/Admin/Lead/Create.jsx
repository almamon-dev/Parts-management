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

export default function Create() {
    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            po_number: "",
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
            shipping_street_address: "",
            shipping_unit_number: "",
            shipping_city: "",
            shipping_province: "",
            shipping_postcode: "",
            shipping_country: "",
            notes: "",
            year: "",
            make: "",
            model: "",
            trim: "",
            vin: "",
            color_code: "",
            engine_size: "",
            status: "Quote",
            parts: [
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
                const lead = response.data.lead;
                setData((prev) => ({
                    ...prev,
                    shop_name: lead.shop_name || prev.shop_name,
                    name: lead.name || prev.name,
                    email: lead.email || prev.email,
                    street_address: lead.street_address || prev.street_address,
                    unit_number: lead.unit_number || prev.unit_number,
                    city: lead.city || prev.city,
                    province: lead.province || prev.province,
                    postcode: lead.postcode || prev.postcode,
                    country: lead.country || prev.country,
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

        post(route("admin.leads.store"));
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
            <Head title="Create New Lead" />

            <div className="font-sans px-6 py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Create New Lead
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Capture lead, vehicle, and part details.
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
                    className="space-y-6"
                >
                    {/* Top Row: Shop Info, Notes/PO, and Default Settings */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Shop & Requester Info */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Users size={18} className="text-[#FF9F43]" />
                                Shop & Requester Info
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <Input
                                    label="Shop"
                                    placeholder="Enter shop name"
                                    className="text-sm h-10"
                                    value={data.shop_name}
                                    onChange={(e) =>
                                        setData("shop_name", e.target.value)
                                    }
                                    error={errors.shop_name}
                                />
                                <Input
                                    label="Customer Name"
                                    placeholder="Enter name"
                                    className="text-sm h-10"
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
                                        className="text-sm h-10"
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
                                        className="text-sm h-10"
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
                        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col h-full">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText
                                    size={18}
                                    className="text-[#FF9F43]"
                                />
                                Notes
                            </h3>
                            <Input
                                isTextArea
                                placeholder="Requirements or notes..."
                                className="flex-1 min-h-[100px] text-sm focus:ring-[#FF9F43]/10 mb-4"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                            />
                            <Input
                                label="PO Number"
                                placeholder="PO Number"
                                className="text-sm h-10"
                                value={data.po_number || ""}
                                onChange={(e) =>
                                    setData("po_number", e.target.value)
                                }
                                error={errors.po_number}
                            />
                        </div>

                        {/* Default Settings */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Default Settings
                            </h3>
                            <div className="space-y-4">
                                {/* Bulk Vendor */}
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-semibold text-slate-700">
                                        Default Vendor
                                    </label>
                                    <select
                                        className="w-full h-10 bg-slate-50/50 border border-slate-200 rounded-lg px-3 text-sm font-medium focus:bg-white transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-10"
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
                                        className="w-full h-11 border-2 border-slate-100 bg-white rounded-xl px-4 text-sm font-bold transition-all focus:border-[#FF9F43] focus:ring-4 focus:ring-[#FF9F43]/5 outline-none text-[#FF9F43] uppercase tracking-wide"
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Billing Address */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-[#FF9F43]" />
                                Billing Address
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <Input
                                            label="Street Address"
                                            placeholder="Street address"
                                            className="text-sm h-10"
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
                                        className="text-sm h-10"
                                        value={data.unit_number}
                                        onChange={(e) =>
                                            setData(
                                                "unit_number",
                                                e.target.value,
                                            )
                                        }
                                        error={errors.unit_number}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <Input
                                        label="City"
                                        placeholder="City"
                                        className="text-sm h-10"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                        error={errors.city}
                                    />
                                    <Input
                                        label="Province"
                                        placeholder="Province"
                                        className="text-sm h-10"
                                        value={data.province}
                                        onChange={(e) =>
                                            setData("province", e.target.value)
                                        }
                                        error={errors.province}
                                    />
                                    <Input
                                        label="Postcode"
                                        placeholder="Postcode"
                                        className="text-sm h-10"
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
                                    className="text-sm h-10"
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
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <Input
                                            label="Street Address"
                                            placeholder="Street address"
                                            className="text-sm h-10"
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
                                        className="text-sm h-10"
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
                                <div className="grid grid-cols-3 gap-3">
                                    <Input
                                        label="City"
                                        placeholder="City"
                                        className="text-sm h-10"
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
                                        className="text-sm h-10"
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
                                        className="text-sm h-10"
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
                                    className="text-sm h-10"
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
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-2">
                                <Select
                                    label="Year"
                                    placeholder="Year"
                                    className="bg-white text-sm h-10"
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
                                    className="bg-white text-sm h-10"
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
                                    className="bg-white text-sm h-10"
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
                                    className="text-sm h-10"
                                    value={data.trim}
                                    onChange={(e) =>
                                        setData("trim", e.target.value)
                                    }
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    label="VIN / Frame"
                                    placeholder="VIN or Frame #"
                                    className="text-sm h-10"
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
                                    className="text-sm h-10"
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
                                    className="text-sm h-10"
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
                                    className="grid grid-cols-12 gap-x-3 gap-y-4 items-center bg-slate-50/30 p-4 xl:p-2 rounded-xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md"
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
                                            className={`w-full h-9 bg-white border ${errors[`parts.${idx}.part_name`] ? "border-rose-300" : "border-slate-200"} rounded-lg px-2 text-[12px] focus:ring-2 focus:ring-[#FF9F43]/20 focus:border-[#FF9F43] outline-none transition-all font-medium`}
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
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
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
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg px-1 text-[11px] font-bold text-slate-600 transition-all outline-none text-center focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10"
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
                                            className="w-full h-9 bg-white border border-[#FF9F43]/30 rounded-lg px-1 text-[11px] font-black text-[#FF9F43] transition-all outline-none text-center focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10"
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
                                            className="w-full h-9 bg-white border border-slate-200 rounded-lg px-2 text-[11px] font-medium transition-all outline-none focus:border-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-6"
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
                        <div className="mt-6 pt-4 border-t border-slate-50 flex flex-col sm:flex-row justify-end gap-3">
                            <div className="flex items-center gap-3 bg-slate-50/50 px-4 py-2.5 rounded-xl border border-slate-100/50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Total Buy
                                </span>
                                <span className="text-base font-black text-slate-600">
                                    $
                                    {totalBuy.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 bg-[#FF9F43]/5 px-4 py-2.5 rounded-xl border border-[#FF9F43]/10">
                                <span className="text-[10px] font-bold text-[#FF9F43] uppercase tracking-widest">
                                    Total Sell
                                </span>
                                <span className="text-base font-black text-[#FF9F43]">
                                    $
                                    {totalSell.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="mt-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex-1 min-h-[46px] bg-[#FF9F43] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#e68a30] active:scale-[0.99] transition-all shadow-md shadow-[#FF9F43]/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                <Save size={20} />
                                {processing
                                    ? "Processing..."
                                    : "Save Lead Info"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-8 min-h-[46px] bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-200 hover:text-slate-700 transition-all uppercase tracking-widest"
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
