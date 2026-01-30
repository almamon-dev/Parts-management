import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
import { Select } from "@/Components/ui/admin/Select";
import FileUpload from "@/Components/ui/admin/FileUpload";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
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

// Make to Models Mapping
const MAKE_MODELS = {
    "ACURA": ["ILX", "MDX", "NSX", "RDX", "RLX", "TLX"],
    "AUDI": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "TT"],
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4"],
    "BUICK": ["Enclave", "Encore", "Envision", "LaCrosse", "Regal"],
    "CADILLAC": ["ATS", "CT4", "CT5", "CT6", "Escalade", "XT4", "XT5", "XT6"],
    "CHEVROLET": ["Blazer", "Camaro", "Colorado", "Corvette", "Cruze", "Equinox", "Impala", "Malibu", "Silverado", "Suburban", "Tahoe", "Traverse"],
    "CHRYSLER": ["200", "300", "Pacifica", "Town & Country"],
    "DODGE": ["Challenger", "Charger", "Durango", "Grand Caravan", "Journey", "Ram 1500"],
    "FORD": ["Bronco", "Edge", "Escape", "Expedition", "Explorer", "F-150", "F-250", "Fiesta", "Focus", "Fusion", "Mustang", "Ranger"],
    "GMC": ["Acadia", "Canyon", "Sierra", "Terrain", "Yukon"],
    "HONDA": ["Accord", "Civic", "CR-V", "Fit", "HR-V", "Odyssey", "Pilot", "Ridgeline"],
    "HYUNDAI": ["Accent", "Elantra", "Kona", "Palisade", "Santa Fe", "Sonata", "Tucson"],
    "JEEP": ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wrangler"],
    "KIA": ["Forte", "K5", "Optima", "Rio", "Sedona", "Sorento", "Soul", "Sportage", "Telluride"],
    "LEXUS": ["ES", "GS", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX"],
    "MAZDA": ["CX-3", "CX-5", "CX-9", "Mazda3", "Mazda6", "MX-5"],
    "MERCEDES": ["A-Class", "C-Class", "E-Class", "G-Class", "GLA", "GLC", "GLE", "GLS", "S-Class"],
    "NISSAN": ["Altima", "Armada", "Frontier", "Kicks", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan"],
    "RAM": ["1500", "2500", "3500", "ProMaster"],
    "SUBARU": ["Ascent", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "WRX"],
    "TESLA": ["Model 3", "Model S", "Model X", "Model Y"],
    "TOYOTA": ["4Runner", "Camry", "Corolla", "Highlander", "Prius", "RAV4", "Sienna", "Tacoma", "Tundra"],
    "VOLKSWAGEN": ["Atlas", "Golf", "Jetta", "Passat", "Tiguan"],
    "VOLVO": ["S60", "S90", "V60", "XC40", "XC60", "XC90"]
};

// Helper function to get models for a specific make
const getModelsForMake = (make) => {
    if (!make || !MAKE_MODELS[make]) return [];
    return MAKE_MODELS[make].map(model => ({ value: model, label: model }));
};

export default function Edit({ product, categories, subCategories }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        _method: "PUT",
        ...product,
        images: [],
    });

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
    };

    const updatePartNumber = (index, value) => {
        const updated = [...data.part_numbers];
        updated[index] = value;
        setData("part_numbers", updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.products.update", product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Product" />
            <div className="p-4 bg-slate-50/50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="text-[#FF9F43]" size={24} /> 
                            <span>Edit Product</span>
                        </h1>
                        <p className="text-slate-500 text-[13px] mt-1">Modify existing product details and specifications.</p>
                    </div>
                    <Link
                        href={route("admin.products.index")}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <ChevronLeft size={16} /> Back to Inventory
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5"
                >
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
                                        e.target.value
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
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Select
                                            label="Year To"
                                            placeholder="Select Year"
                                            className="bg-white text-[13px]"
                                            options={fit.year_from ? YEARS.filter(year => parseInt(year.value) >= parseInt(fit.year_from)) : []}
                                            value={fit.year_to}
                                            onChange={(e) =>
                                                updateFitment(
                                                    idx,
                                                    "year_to",
                                                    e.target.value
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
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="flex gap-3 items-end">
                                            <Select
                                                label="Model"
                                                placeholder="Select Model"
                                                className="grow bg-white text-[13px]"
                                                options={getModelsForMake(fit.make)}
                                                value={fit.model}
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
                                                    className="inline-flex items-center justify-center w-9 h-9 text-slate-300 hover:text-rose-500 bg-white border border-slate-100 rounded-lg shadow-sm mb-[2px] transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Part Numbers Section */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
                                <Tag size={18} className="text-[#FF9F43]" /> 
                                Alternate Part Numbers
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {data.part_numbers.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group"
                                    >
                                        <Input
                                            className="bg-slate-50 border-slate-100 focus:bg-white text-[13px]"
                                            value={part}
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
                                                className="absolute -top-1.5 -right-1.5 bg-white text-slate-300 hover:text-rose-500 rounded-lg w-6 h-6 border border-slate-100 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
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
                                    className="h-[42px] border-2 border-dashed border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:border-[#FF9F43]/50 hover:text-[#FF9F43] transition-all bg-slate-50/10"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Category Grid */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">Category</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories?.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            setData((prev) => ({
                                                ...prev,
                                                category_id: cat.id,
                                                sub_category_id: "",
                                            }))
                                        }
                                        className={`py-2 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                            Number(data.category_id) === Number(cat.id)
                                                ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sub Category */}
                        {data.category_id && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <h3 className="text-[14px] font-bold text-slate-800 mb-4">Sub Category</h3>
                                <div className="flex flex-wrap gap-2">
                                    {filteredSubCategories?.map((sub) => (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    "sub_category_id",
                                                    sub.id
                                                )
                                            }
                                            className={`py-2 px-3 text-[11px] font-bold rounded-full border transition-all ${
                                                Number(data.sub_category_id) === Number(sub.id)
                                                    ? "bg-[#FF9F43] text-white border-[#FF9F43] shadow-md shadow-orange-100"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            }`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                </div>
                                {filteredSubCategories.length === 0 && (
                                    <p className="text-slate-400 text-[11px] italic">No sub-categories available.</p>
                                )}
                            </div>
                        )}

                        {/* Visibility */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <h3 className="text-[14px] font-bold text-slate-800 mb-4">Product Visibility</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {["public", "private", "draft"].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() =>
                                                setData("visibility", status)
                                            }
                                            className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all capitalize ${
                                                data.visibility === status
                                                    ? "bg-[#FF9F43] text-white border-[#FF9F43]"
                                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    )
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-3 text-center italic">
                                {data.visibility === "public" && "Visible to all customers on the storefront."}
                                {data.visibility === "private" && "Only authorized staff can access this item."}
                                {data.visibility === "draft" && "Work in progress. Not visible on storefront."}
                            </p>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                            <div className="space-y-3 pb-3 border-b border-slate-50">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pricing (USD)</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <Input
                                        label="List Price"
                                        type="number"
                                        className="text-[13px]"
                                        value={data.list_price}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "list_price",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3 pb-3 border-b border-slate-50">
                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inventory Status</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        label="Oakville"
                                        type="number"
                                        className="text-[13px]"
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
                                        className="text-[13px]"
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
                                        className="text-[13px]"
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

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <Input
                                    label="SKU ID"
                                    className="text-[13px]"
                                    value={data.sku}
                                    onChange={(e) =>
                                        handleInputChange("sku", e.target.value)
                                    }
                                />
                                <Input
                                    label="Location"
                                    className="text-[13px]"
                                    value={data.location_id}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "location_id",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Existing Media Preview */}
                        {product.files && product.files.length > 0 && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                                <h3 className="text-[14px] font-bold text-slate-800 mb-4">Current Media</h3>
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

                                            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ConfirmDelete
                                                    id={file.id}
                                                    routeName="admin.products.file-destroy"
                                                    title="Delete Image?"
                                                    text="Are you sure you want to delete this image permanently?"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                            <FileUpload
                                data={data}
                                setData={setData}
                                errors={errors}
                                field="images"
                                label="Add New Images"
                                multiple={true}
                                className="text-[13px]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#FF9F43] text-white h-11 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#e68a30] active:scale-95 transition-all disabled:opacity-50 mt-2"
                        >
                            <Save size={18} />{" "}
                            {processing ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
