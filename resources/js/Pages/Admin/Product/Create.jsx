import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
import { Select } from "@/Components/ui/admin/Select";
import FileUpload from "@/Components/ui/admin/FileUpload";
import {
    ChevronLeft,
    Save,
    Plus,
    Trash2,
    Info,
    Settings,
    Tag,
} from "lucide-react";

const MAKES = [
    "ACURA", "AUDI", "BMW", "BUICK", "CADILLAC", "CHEVROLET", "CHRYSLER",
    "DODGE", "EAGLE", "FORD", "FREIGHTLINER", "GMC", "HONDA", "HUMMER",
    "HYUNDAI", "INFINITI", "ISUZU", "JEEP", "KIA", "LEXUS", "LINCOLN",
    "MACK", "MAZDA", "MERCEDES", "MERCURY", "MITSUBISHI", "NISSAN",
    "OLDSMOBILE", "PONTIAC", "RAM", "SAAB", "SATURN", "SCION", "SMART",
    "STERLING", "SUBARU", "SUZUKI", "TESLA", "TOYOTA", "VOLKSWAGEN",
    "VOLVO", "VOLVO TRUCK"
].map(make => ({ value: make, label: make }));

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 1995 + i)
    .reverse()
    .map((year) => ({ value: year.toString(), label: year.toString() }));

const CAR_MODELS = [
    // ACURA
    "ILX", "MDX", "NSX", "RDX", "RLX", "TLX",
    // AUDI
    "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "TT",
    // BMW
    "1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4",
    // FORD
    "F-150", "Mustang", "Explorer", "Escape", "Focus", "Fusion", "Edge", "Ranger",
    // HONDA
    "Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline", "Fit",
    // TOYOTA
    "Corolla", "Camry", "RAV4", "Tacoma", "Highlander", "4Runner", "Sienna", "Tundra", "Prius"
].map(model => ({ value: model, label: model }));

export default function Create({ categories, subCategories }) {
    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            description: "",
            buy_price: "",
            list_price: "",
            sku: "",
            location_id: "",
            visibility: "public",
            category_id: "",
            sub_category_id: "",
            stock_oakville: 0,
            stock_mississauga: 0,
            stock_saskatoon: 0,
            part_numbers: [""],
            fitments: [{ year_from: "", year_to: "", make: "", model: "" }],
            images: [],
        });

    // --- Logic ---
    const filteredSubCategories = subCategories?.filter(
        (sub) => Number(sub.category_id) === Number(data.category_id)
    );

    const handleInputChange = (field, value) => {
        setData(field, value);
        if (errors[field]) clearErrors(field);
    };

    const updateFitment = (index, field, value) => {
        const updated = [...data.fitments];
        updated[index][field] = value;
        setData("fitments", updated);

        const errorKey = `fitments.${index}.${field}`;
        if (errors[errorKey]) clearErrors(errorKey);
    };

    const updatePartNumber = (index, value) => {
        const updated = [...data.part_numbers];
        updated[index] = value;
        setData("part_numbers", updated);

        const errorKey = `part_numbers.${index}`;
        if (errors[errorKey]) clearErrors(errorKey);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Product" />
            <div className="p-3 bg-slate-50/50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Plus className="text-[#FF9F43]" size={20} /> 
                            <span>Create New Product</span>
                        </h1>
                        <p className="text-slate-500 text-[12px] mt-0.5">Add a new item to your inventory catalog.</p>
                    </div>
                    <Link
                        href={route("products.index")}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <ChevronLeft size={14} /> Back
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4"
                >
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Description Section */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Info size={16} className="text-[#FF9F43]" />
                                Product Description
                            </h3>
                            <Input
                                isTextArea
                                placeholder="Write a detailed description of the product..."
                                className="min-h-[80px] text-[13px] focus:ring-[#FF9F43]/10"
                                value={data.description}
                                error={errors.description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Fitments Section */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <div className="flex justify-between items-center mb-3 border-b border-slate-50 pb-2">
                                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                                    <Settings
                                        size={16}
                                        className="text-[#FF9F43]"
                                    />
                                    Vehicle Fitment
                                </h3>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData("fitments", [
                                            ...data.fitments,
                                            {
                                                year_from: "",
                                                year_to: "",
                                                make: "",
                                                model: "",
                                            },
                                        ])
                                    }
                                    className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
                                >
                                    <Plus size={12} /> Add Row
                                </button>
                            </div>

                            <div className="space-y-2">
                                {data.fitments.map((fit, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end bg-slate-50/40 p-2 rounded-lg border border-slate-100 relative group"
                                    >
                                        <Select
                                            label="Year From"
                                            placeholder="Year"
                                            className="bg-white text-[12px] h-9"
                                            options={YEARS}
                                            value={fit.year_from}
                                            error={errors[`fitments.${idx}.year_from`]}
                                            onChange={(e) => updateFitment(idx, "year_from", e.target.value)}
                                        />
                                        <Select
                                            label="Year To"
                                            placeholder="Year"
                                            className="bg-white text-[12px] h-9"
                                            options={YEARS}
                                            value={fit.year_to}
                                            error={errors[`fitments.${idx}.year_to`]}
                                            onChange={(e) => updateFitment(idx, "year_to", e.target.value)}
                                        />
                                        <Select
                                            label="Make"
                                            placeholder="Make"
                                            className="bg-white text-[12px] h-9"
                                            options={MAKES}
                                            value={fit.make}
                                            error={errors[`fitments.${idx}.make`]}
                                            onChange={(e) => updateFitment(idx, "make", e.target.value)}
                                        />
                                        <div className="flex gap-2 items-end">
                                            <Select
                                                label="Model"
                                                placeholder="Model"
                                                className="grow bg-white text-[12px] h-9"
                                                options={CAR_MODELS}
                                                value={fit.model}
                                                error={errors[`fitments.${idx}.model`]}
                                                onChange={(e) => updateFitment(idx, "model", e.target.value)}
                                            />
                                            {data.fitments.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "fitments",
                                                            data.fitments.filter(
                                                                (_, i) =>
                                                                    i !== idx
                                                            )
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center w-8 h-8 text-slate-300 hover:text-rose-500 bg-white border border-slate-100 rounded-lg shadow-sm mb-[1px] transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Part Numbers Section */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-50 pb-2">
                                <Tag size={16} className="text-[#FF9F43]" />
                                Alternate Part Numbers
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {data.part_numbers.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group"
                                    >
                                        <Input
                                            placeholder="OEM-PN-..."
                                            className="bg-slate-50 border-slate-100 focus:bg-white text-[12px] h-9"
                                            value={part}
                                            error={errors[`part_numbers.${idx}`]}
                                            onChange={(e) => updatePartNumber(idx, e.target.value)}
                                        />
                                        {data.part_numbers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "part_numbers",
                                                        data.part_numbers.filter(
                                                            (_, i) => i !== idx
                                                        )
                                                    )
                                                }
                                                className="absolute -top-1 -right-1 bg-white text-slate-300 hover:text-rose-500 rounded-md w-5 h-5 border border-slate-100 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={10} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setData("part_numbers", [...data.part_numbers, ""])}
                                    className="h-9 border-2 border-dashed border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:border-[#FF9F43]/50 hover:text-[#FF9F43] transition-all bg-slate-50/10"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Category Grid */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center justify-between">
                                <span>Category</span>
                                <Link
                                    href={route("categories.create")}
                                    className="text-[9px] font-bold text-slate-500 hover:text-[#FF9F43] bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded"
                                >
                                    Add New
                                </Link>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categories?.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({
                                                ...prev,
                                                category_id: cat.id,
                                                sub_category_id: "",
                                            }));
                                            clearErrors("category_id");
                                        }}
                                        className={`py-1.5 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                            data.category_id === cat.id
                                                ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            {errors.category_id && (
                                <p className="text-rose-500 text-[10px] mt-1.5 italic">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        {/* Sub Category Grid */}
                        {data.category_id && (
                            <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <h3 className="text-[13px] font-bold text-slate-800 mb-3">Sub Category</h3>
                                <div className="flex flex-wrap gap-2">
                                    {filteredSubCategories?.map((sub) => (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => {
                                                setData(
                                                    "sub_category_id",
                                                    sub.id
                                                );
                                                clearErrors("sub_category_id");
                                            }}
                                            className={`py-1.5 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                                data.sub_category_id === sub.id
                                                    ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            }`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                                {filteredSubCategories.length === 0 && (
                                    <p className="text-slate-400 text-[10px] italic text-center">No results.</p>
                                )}
                            </div>
                        )}

                        {/* Inventory & Specs */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
                            <div className="space-y-2 pb-2 border-b border-slate-50">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing (USD)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        label="Buy Price"
                                        type="number"
                                        placeholder="0.00"
                                        className="text-[12px] h-9"
                                        value={data.buy_price}
                                        error={errors.buy_price}
                                        onChange={(e) => handleInputChange("buy_price", e.target.value)}
                                    />
                                    <Input
                                        label="List Price"
                                        type="number"
                                        placeholder="0.00"
                                        className="text-[12px] h-9"
                                        value={data.list_price}
                                        error={errors.list_price}
                                        onChange={(e) => handleInputChange("list_price", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pb-2 border-b border-slate-50">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Status</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        label="OKV"
                                        type="number"
                                        className="text-[12px] h-9"
                                        value={data.stock_oakville}
                                        onChange={(e) => handleInputChange("stock_oakville", e.target.value)}
                                    />
                                    <Input
                                        label="MSA"
                                        type="number"
                                        className="text-[12px] h-9"
                                        value={data.stock_mississauga}
                                        onChange={(e) => handleInputChange("stock_mississauga", e.target.value)}
                                    />
                                    <Input
                                        label="SKT"
                                        type="number"
                                        className="text-[12px] h-9"
                                        value={data.stock_saskatoon}
                                        onChange={(e) => handleInputChange("stock_saskatoon", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Input
                                    label="SKU ID"
                                    placeholder="SKU-..."
                                    className="text-[12px] h-9"
                                    value={data.sku}
                                    error={errors.sku}
                                    onChange={(e) => handleInputChange("sku", e.target.value)}
                                />
                                <Input
                                    label="Location"
                                    placeholder="BIN-..."
                                    className="text-[12px] h-9"
                                    value={data.location_id}
                                    error={errors.location_id}
                                    onChange={(e) => handleInputChange("location_id", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm transition-all">
                            <FileUpload
                                data={data}
                                setData={setData}
                                errors={errors}
                                clearErrors={clearErrors}
                                field="images"
                                label="Product Images"
                                multiple={true}
                                className="text-[12px]"
                            />
                        </div>

                        {/* Form Submission */}
                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-[#FF9F43] text-white h-9 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#e68a30] active:scale-95 transition-all disabled:opacity-50"
                            >
                                <Save size={16} />
                                {processing ? "Publishing..." : "Publish Item"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    clearErrors();
                                }}
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
