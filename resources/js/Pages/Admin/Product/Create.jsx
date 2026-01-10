import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
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
            <div className="p-6 bg-[#F8F9FB] min-h-screen font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Plus className="text-orange-500" /> Create New
                            Product
                        </h1>
                    </div>
                    <Link
                        href={route("products.index")}
                        className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <ChevronLeft size={18} /> Back to List
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Description Section */}
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Info size={18} className="text-orange-500" />
                                Product Description
                            </h3>
                            <Input
                                isTextArea
                                placeholder="Example: High-performance ceramic brake pads designed for reduced noise and dusting. Suitable for daily commuting..."
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
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-3">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Settings
                                        size={18}
                                        className="text-orange-500"
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
                                    className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add Row
                                </button>
                            </div>

                            <div className="space-y-4">
                                {data.fitments.map((fit, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-4 gap-3 items-start bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200"
                                    >
                                        <Input
                                            label="Year From"
                                            placeholder="2018"
                                            value={fit.year_from}
                                            error={
                                                errors[
                                                    `fitments.${idx}.year_from`
                                                ]
                                            }
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "year_from",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            label="Year To"
                                            placeholder="2024"
                                            value={fit.year_to}
                                            error={
                                                errors[
                                                    `fitments.${idx}.year_to`
                                                ]
                                            }
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "year_to",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            label="Make"
                                            placeholder="e.g. Toyota"
                                            value={fit.make}
                                            error={
                                                errors[`fitments.${idx}.make`]
                                            }
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "make",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="flex gap-2 items-start">
                                            <Input
                                                label="Model"
                                                placeholder="e.g. RAV4"
                                                value={fit.model}
                                                error={
                                                    errors[
                                                        `fitments.${idx}.model`
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    updateFitment(
                                                        idx,
                                                        "model",
                                                        e.target.value
                                                    )
                                                }
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
                                                    className="mt-8 text-slate-300 hover:text-red-500"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Part Numbers Section */}
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-3">
                                <Tag size={18} className="text-orange-500" />
                                Part Numbers
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {data.part_numbers.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="relative min-w-[180px]"
                                    >
                                        <Input
                                            placeholder="e.g. OEM-99827-BC"
                                            className="bg-white text-black"
                                            value={part}
                                            error={
                                                errors[`part_numbers.${idx}`]
                                            }
                                            onChange={(e) =>
                                                updatePartNumber(
                                                    idx,
                                                    e.target.value
                                                )
                                            }
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
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData("part_numbers", [
                                            ...data.part_numbers,
                                            "",
                                        ])
                                    }
                                    className="h-10 w-10 border-2 border-dashed border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:border-orange-300 hover:text-orange-400"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Category Grid */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-[#2D6BA4] mb-4 text-center">
                                Category
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
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
                                        className={`py-2 px-1 text-[11px] font-bold rounded-md border transition-all ${
                                            data.category_id === cat.id
                                                ? "bg-[#2D6BA4] text-white border-[#2D6BA4]"
                                                : "bg-[#A9A9A9] text-white border-[#A9A9A9]"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className="py-2 text-[11px] font-bold rounded-md bg-[#007D42] text-white flex items-center justify-center gap-1"
                                >
                                    Add <Plus size={12} />
                                </button>
                            </div>
                            {errors.category_id && (
                                <p className="text-red-500 text-[11px] mt-2 text-center">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        {/* Sub Category Grid */}
                        {data.category_id && (
                            <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                                <h3 className="text-sm font-bold text-amber-600 mb-4 text-center">
                                    Sub Category
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
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
                                            className={`py-2 px-1 text-[11px] font-bold rounded-md border transition-all ${
                                                data.sub_category_id === sub.id
                                                    ? "bg-amber-500 text-white border-amber-500"
                                                    : "bg-[#A9A9A9] text-white border-[#A9A9A9]"
                                            }`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pricing & Stock */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Buy Price ($)"
                                    type="number"
                                    placeholder="0.00"
                                    value={data.buy_price}
                                    error={errors.buy_price}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "buy_price",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    label="List Price ($)"
                                    type="number"
                                    placeholder="0.00"
                                    value={data.list_price}
                                    error={errors.list_price}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "list_price",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    label="Oakville"
                                    type="number"
                                    placeholder="0"
                                    value={data.stock_oakville}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "stock_oakville",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    label="Mississauga"
                                    type="number"
                                    placeholder="0"
                                    value={data.stock_mississauga}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "stock_mississauga",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    label="Saskatoon"
                                    type="number"
                                    placeholder="0"
                                    value={data.stock_saskatoon}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "stock_saskatoon",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="SKU"
                                placeholder="ABC-123-XYZ"
                                value={data.sku}
                                error={errors.sku}
                                onChange={(e) =>
                                    handleInputChange("sku", e.target.value)
                                }
                            />
                            <Input
                                label="Location ID"
                                placeholder="BIN-01"
                                value={data.location_id}
                                error={errors.location_id}
                                onChange={(e) =>
                                    handleInputChange(
                                        "location_id",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                            <FileUpload
                                data={data}
                                setData={setData}
                                errors={errors}
                                clearErrors={clearErrors}
                                field="images"
                                label="Media / Images"
                                multiple={true}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="col-span-2 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                            >
                                <Save size={18} />{" "}
                                {processing
                                    ? "Publishing..."
                                    : "Publish Product"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    reset();
                                    clearErrors();
                                }}
                                className="bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
