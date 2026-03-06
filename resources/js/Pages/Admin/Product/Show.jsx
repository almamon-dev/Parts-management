import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
import { Select } from "@/Components/ui/admin/Select";
import FileUpload from "@/Components/ui/admin/FileUpload";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
import { MAKES as MAKES_LIST } from "@/Constants/makes";
import { MODELS } from "@/Constants/models";
import PrintLabelButton from "@/Components/ui/admin/PrintLabelButton";
import {
    ChevronLeft,
    Save,
    Plus,
    Trash2,
    Info,
    Settings,
    Tag,
} from "lucide-react";

const MAKES = MAKES_LIST.map((make) => ({ value: make, label: make }));

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) => 1995 + i)
    .reverse()
    .map((year) => ({ value: year.toString(), label: year.toString() }));


const VISIBILITY_OPTIONS = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "draft", label: "Draft" },
];

const getModelsForMake = (make) => {
    if (!make || !MODELS[make]) return [];
    return MODELS[make].map((model) => ({ value: model, label: model }));
};

export default function Edit({
    product,
    categoriesTier1,
    categoriesTier2,
    categoriesTier3,
    subCategories,
}) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        _method: "PUT",
        ...product,
        images: [],
    });

    const handleInputChange = (field, value) => {
        setData(field, value);
        if (errors[field]) clearErrors(field);
    };

    const updateFitment = (index, field, value) => {
        const updated = [...data.fitments];
        updated[index][field] = value;
        setData("fitments", updated);
    };

    const updatePartNumber = (index, value) => {};

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <AdminLayout>
            <Head title="Edit Product" />
            <div className="p-4 bg-slate-50/50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Info className="text-[#FF9F43]" size={24} />
                            <span>Product Details</span>
                        </h1>
                        <p className="text-slate-500 text-[13px] mt-1">
                            View product details and specifications.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <PrintLabelButton product={product} variant="button" />
                        <Link
                            href={route("admin.products.index")}
                            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            <ChevronLeft size={16} /> Back to Inventory
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pointer-events-none">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-5">
                        {/* Description Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Info size={18} className="text-[#FF9F43]" />
                                Product Description
                            </h3>
                            <Input
                                isTextArea
                                className="min-h-[100px] text-[13px] focus:ring-[#FF9F43]/10"
                                value={data.description}
                                error={errors.description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        {/* Fitments Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
                                <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                                    <Settings
                                        size={18}
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
                                    className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                                >
                                    <Plus size={14} /> Add Row
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.fitments.map((fit, idx) => (
                                    <div
                                        key={idx}
                                        className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-slate-50/40 p-3 rounded-xl border border-slate-100 relative group"
                                    >
                                        <Select
                                            label="Year From"
                                            placeholder="Select Year"
                                            className="bg-white text-[13px]"
                                            options={YEARS}
                                            value={fit.year_from}
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "year_from",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Select
                                            label="Year To"
                                            placeholder="Select Year"
                                            className="bg-white text-[13px]"
                                            options={
                                                fit.year_from
                                                    ? YEARS.filter(
                                                          (year) =>
                                                              parseInt(
                                                                  year.value,
                                                              ) >=
                                                              parseInt(
                                                                  fit.year_from,
                                                              ),
                                                      )
                                                    : []
                                            }
                                            value={fit.year_to}
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "year_to",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Select
                                            label="Make"
                                            placeholder="Select Make"
                                            className="bg-white text-[13px]"
                                            options={fit.year_to ? MAKES : []}
                                            value={fit.make}
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "make",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <div className="flex gap-3 items-end">
                                            <Select
                                                label="Model"
                                                placeholder="Select Model"
                                                className="grow bg-white text-[13px]"
                                                options={getModelsForMake(
                                                    fit.make,
                                                )}
                                                value={fit.model}
                                                onChange={(e) =>
                                                    updateFitment(
                                                        idx,
                                                        "model",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {data.fitments.length > 1 && (
                                                <div className="flex gap-1 mb-[2px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newFitment = {
                                                                ...fit,
                                                            };
                                                            const updated = [
                                                                ...data.fitments,
                                                            ];
                                                            updated.splice(
                                                                idx + 1,
                                                                0,
                                                                newFitment,
                                                            );
                                                            setData(
                                                                "fitments",
                                                                updated,
                                                            );
                                                        }}
                                                        className="inline-flex items-center justify-center w-9 h-9 text-slate-300 hover:text-[#FF9F43] bg-white border border-slate-100 rounded-lg shadow-sm transition-colors"
                                                        title="Duplicate"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData(
                                                                "fitments",
                                                                data.fitments.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        idx,
                                                                ),
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center w-9 h-9 text-slate-300 hover:text-rose-500 bg-white border border-slate-100 rounded-lg shadow-sm transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                            {data.fitments.length === 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newFitment = {
                                                            ...fit,
                                                        };
                                                        const updated = [
                                                            ...data.fitments,
                                                        ];
                                                        updated.splice(
                                                            idx + 1,
                                                            0,
                                                            newFitment,
                                                        );
                                                        setData(
                                                            "fitments",
                                                            updated,
                                                        );
                                                    }}
                                                    className="inline-flex items-center justify-center w-9 h-9 text-slate-300 hover:text-[#FF9F43] bg-white border border-slate-100 rounded-lg shadow-sm mb-[2px] transition-colors"
                                                    title="Duplicate"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PP ID Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm transition-all">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
                                <Tag size={18} className="text-[#FF9F43]" />
                                Product Identity (PP ID)
                            </h3>
                            <div className="bg-orange-50/20 p-4 rounded-2xl border border-orange-100 flex items-center justify-between gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Unique Identifier
                                    </span>
                                    <span className="text-[13px] font-semibold text-slate-600">
                                        The primary reference ID for this part
                                    </span>
                                </div>
                                <div className="w-full max-w-[180px]">
                                    <div className="bg-white border-orange-200/50 px-4 py-2.5 rounded-xl text-center shadow-inner">
                                        <span className="text-[18px] font-black text-[#FF9F43] tracking-wider leading-none">
                                            {data.pp_id || "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alternate Part Numbers Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm transition-all">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
                                <Tag size={18} className="text-[#FF9F43]" />
                                Alternate Part Numbers
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {data.part_numbers.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-slate-50/50 border border-slate-100/50 px-4 py-2.5 rounded-xl text-center group transition-all hover:bg-white hover:shadow-sm"
                                    >
                                        <span className="text-[13px] font-bold text-slate-600 group-hover:text-[#FF9F43] transition-colors">
                                            {part}
                                        </span>
                                    </div>
                                ))}
                                {data.part_numbers.length === 0 && (
                                    <div className="col-span-full py-8 text-center bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-100/50">
                                        <p className="text-[12px] text-slate-400 font-medium italic">
                                            No alternate part numbers recorded.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Category Tier 1 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">
                                Category (Part Type){" "}
                                <span className="text-rose-500">*</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categoriesTier1?.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            handleInputChange(
                                                "part_type_id",
                                                cat.id,
                                            )
                                        }
                                        className={`py-2 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                            Number(data.part_type_id) ===
                                            Number(cat.id)
                                                ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            {errors.part_type_id && (
                                <p className="text-rose-500 text-[10px] mt-1 italic">
                                    {errors.part_type_id}
                                </p>
                            )}
                        </div>

                        {/* Category Tier 2 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">
                                Category (Shop View){" "}
                                <span className="text-rose-500">*</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categoriesTier2?.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            handleInputChange(
                                                "shop_view_id",
                                                cat.id,
                                            )
                                        }
                                        className={`py-2 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                            Number(data.shop_view_id) ===
                                            Number(cat.id)
                                                ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            {errors.shop_view_id && (
                                <p className="text-rose-500 text-[10px] mt-1 italic">
                                    {errors.shop_view_id}
                                </p>
                            )}
                        </div>

                        {/* Category Tier 3 */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">
                                Category{" "}
                                <span className="text-rose-500">*</span>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {categoriesTier3?.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            handleInputChange(
                                                "sorting_id",
                                                cat.id,
                                            )
                                        }
                                        className={`py-2 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                            Number(data.sorting_id) ===
                                            Number(cat.id)
                                                ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            {errors.sorting_id && (
                                <p className="text-rose-500 text-[10px] mt-1 italic">
                                    {errors.sorting_id}
                                </p>
                            )}
                        </div>

                        {/* Visibility & Position */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                            <div className="grid grid-cols-1 gap-3 pb-3 border-b border-slate-50">
                                <Select
                                    label="Visibility"
                                    placeholder="Select visibility"
                                    className="bg-white text-[13px] h-10"
                                    options={VISIBILITY_OPTIONS}
                                    value={data.visibility}
                                    error={errors.visibility}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "visibility",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            "is_clearance",
                                            !data.is_clearance,
                                        )
                                    }
                                    className={`w-full py-2.5 px-4 rounded-xl border text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
                                        data.is_clearance
                                            ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                                            : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                                    }`}
                                >
                                    <Tag
                                        size={16}
                                        className={
                                            data.is_clearance
                                                ? "text-rose-500"
                                                : "text-slate-400"
                                        }
                                    />
                                    {data.is_clearance
                                        ? "Listed in Clearance Sale"
                                        : "Add to Clearance Sale"}
                                </button>
                                {errors.is_clearance && (
                                    <p className="text-rose-500 text-[10px] mt-1">
                                        {errors.is_clearance}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                            <div className="space-y-3 pb-3 border-b border-slate-50">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Pricing (USD)
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <Input
                                        label="List Price"
                                        type="number"
                                        className="text-[13px]"
                                        value={data.list_price}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "list_price",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pb-3 border-b border-slate-50">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Inventory Status
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        label="Oakville"
                                        type="number"
                                        className="text-[13px]"
                                        value={data.stock_oakville}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "stock_oakville",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        label="Mississauga"
                                        type="number"
                                        className="text-[13px]"
                                        value={data.stock_mississauga}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "stock_mississauga",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Input
                                        label="Saskatoon"
                                        type="number"
                                        className="text-[13px]"
                                        value={data.stock_saskatoon}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "stock_saskatoon",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <Input
                                    label="SKU"
                                    className="text-[13px]"
                                    value={data.sku}
                                    onChange={(e) =>
                                        handleInputChange("sku", e.target.value)
                                    }
                                />
                                <Input
                                    label="LOC"
                                    className="text-[13px]"
                                    value={data.location_id}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "location_id",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Media Preview */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">
                                Product Media
                            </h3>
                            {product.files && product.files.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {product.files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-1"
                                        >
                                            <img
                                                src={`/${file.file_path}`}
                                                className="w-full h-full object-cover rounded-lg"
                                                alt="Product"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 text-[13px] border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    No images available for this product.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
