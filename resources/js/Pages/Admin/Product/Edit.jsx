import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
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
        post(route("products.update", product.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Product" />
            <div className="p-6 bg-[#F8F9FB] min-h-screen font-sans">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="text-orange-500" /> Edit
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
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b">
                                <Info size={18} className="text-orange-500" />{" "}
                                Product Description
                            </h3>
                            <Input
                                isTextArea
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
                                    />{" "}
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
                                            value={fit.year_from}
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
                                            value={fit.year_to}
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
                                            value={fit.make}
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
                                <Tag size={18} className="text-orange-500" />{" "}
                                Part Numbers
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {data.part_numbers.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="relative min-w-[180px]"
                                    >
                                        <Input
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
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-[#2D6BA4] mb-4 text-center">
                                Category
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
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
                                        className={`py-2 px-1 text-[11px] font-bold rounded-md border transition-all ${
                                            data.category_id === cat.id
                                                ? "bg-[#2D6BA4] text-white border-[#2D6BA4]"
                                                : "bg-[#A9A9A9] text-white border-[#A9A9A9]"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sub Category - Added Missing Design */}
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
                                            onClick={() =>
                                                setData(
                                                    "sub_category_id",
                                                    sub.id
                                                )
                                            }
                                            className={`py-2 px-1 text-[11px] font-bold rounded-md border transition-all ${
                                                Number(data.sub_category_id) ===
                                                Number(sub.id)
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
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 text-center">
                                Product Visibility
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {["public", "private", "draft"].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() =>
                                                setData("visibility", status)
                                            }
                                            className={`py-2 px-1 text-[11px] font-bold rounded-md border transition-all capitalize ${
                                                data.visibility === status
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    )
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-3 text-center italic">
                                {data.visibility === "public" &&
                                    "Visible to all customers."}
                                {data.visibility === "private" &&
                                    "Only admins can see this."}
                                {data.visibility === "draft" &&
                                    "Saved as a work in progress."}
                            </p>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Buy Price ($)"
                                    type="number"
                                    value={data.buy_price}
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
                                    value={data.list_price}
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
                                value={data.sku}
                                onChange={(e) =>
                                    handleInputChange("sku", e.target.value)
                                }
                            />
                            <Input
                                label="Location ID"
                                value={data.location_id}
                                onChange={(e) =>
                                    handleInputChange(
                                        "location_id",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Existing Media Preview */}
                        {product.files && product.files.length > 0 && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                    Current Media
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {product.files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="relative group aspect-square rounded-lg overflow-hidden border"
                                        >
                                            <img
                                                src={`/${file.file_path}`}
                                                className="w-full h-full object-cover"
                                                alt="Product"
                                            />

                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ConfirmDelete
                                                    id={file.id}
                                                    routeName="products.file-destroy"
                                                    title="Delete Image?"
                                                    text="Are you sure you want to delete this image permanently?"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                            <FileUpload
                                data={data}
                                setData={setData}
                                errors={errors}
                                field="images"
                                label="Add New Images"
                                multiple={true}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                        >
                            <Save size={18} />{" "}
                            {processing ? "Publishing..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
