import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
import FileUpload from "@/Components/ui/admin/FileUpload";
import {
    ChevronLeft,
    Save,
    XCircle,
    Plus,
    Trash2,
    LayoutGrid,
    Star,
} from "lucide-react";

// --- Reusable Modern Switch Component ---
const ModernSwitch = ({ label, active, onClick }) => (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-[12px] h-[54px] w-full transition-all">
        <span className="text-gray-700 font-medium text-[14px]">{label}</span>
        <button
            type="button"
            onClick={onClick}
            className={`w-[48px] h-[24px] rounded-full relative transition-all duration-300 flex items-center ${
                active ? "bg-[#FF9F43]" : "bg-gray-300"
            }`}
        >
            <div
                className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-300 absolute ${
                    active ? "left-[26px]" : "left-[4px]"
                }`}
            ></div>
        </button>
    </div>
);

export default function Create() {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            categories: [
                {
                    name: "",
                    image: null,
                    status: "active",
                    category_type: 1,
                },
            ],
        });

    const addCategory = () => {
        if (data.categories.length < 20) {
            setData("categories", [
                ...data.categories,
                {
                    name: "",
                    image: null,
                    status: "active",
                    category_type: 1,
                },
            ]);
        }
    };

    const removeCategory = (index) => {
        const updated = [...data.categories];
        updated.splice(index, 1);
        setData("categories", updated);
    };

    const updateCategory = (index, key, value) => {
        const updated = [...data.categories];
        updated[index][key] = value;
        setData("categories", updated);

        const errorPath = `categories.${index}.${key}`;
        if (errors[errorPath]) clearErrors(errorPath);
    };

    const handleImageUpdate = (index, file) => {
        updateCategory(index, "image", file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"), {
            onSuccess: () => reset(),
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Categories" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-[22px] font-bold text-[#212B36] flex items-center gap-2">
                            <LayoutGrid className="text-[#FF9F43]" size={24} />
                            Add Categories
                        </h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            Bulk creation mode: Manage multiple tiered categories
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={addCategory}
                            disabled={data.categories.length >= 20}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-bold text-[13px] shadow-sm disabled:opacity-50"
                        >
                            <Plus size={18} /> Add New Row
                        </button>
                        <Link
                            href={route("admin.categories.index")}
                            className="flex items-center gap-2 bg-[#1B2838] text-white px-4 py-2 rounded-lg hover:bg-[#2c3e50] transition-all font-bold text-[13px] shadow-sm"
                        >
                            <ChevronLeft size={19} /> Back to List
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={`grid gap-6 ${
                        data.categories.length === 1 
                            ? "grid-cols-1" 
                            : data.categories.length === 2 
                            ? "grid-cols-1 md:grid-cols-2" 
                            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    }`}>
                        {data.categories.map((cat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 relative group transition-all hover:border-[#FF9F43]/40"
                            >
                                {data.categories.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCategory(index)}
                                        className="absolute -top-3 -right-3 bg-red-50 text-red-500 p-2 rounded-full border border-red-100 shadow-sm hover:bg-red-500 hover:text-white transition-all z-10"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-6 h-6 rounded-full bg-[#FF9F43]/10 text-[#FF9F43] flex items-center justify-center text-[12px] font-bold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-[14px] font-bold text-[#212B36]">
                                            Category Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Category Name"
                                            placeholder="Enter name..."
                                            value={cat.name}
                                            error={errors[`categories.${index}.name`]}
                                            onChange={(e) => updateCategory(index, "name", e.target.value)}
                                            className="bg-gray-50/50"
                                            containerClassName="w-full"
                                        />

                                        <div>
                                            <label className="text-[13px] font-bold text-[#212B36] mb-1.5 block">
                                                Status
                                            </label>
                                            <select
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-semibold outline-none focus:border-[#FF9F43] bg-white transition-all h-[42px]"
                                                value={cat.status}
                                                onChange={(e) => updateCategory(index, "status", e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-bold text-[#212B36] mb-1.5 block">
                                            Category Tier (Type)
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 1, label: "Part Type" },
                                                { id: 2, label: "Shop View" },
                                                { id: 3, label: "Sorting" },
                                            ].map((type) => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => updateCategory(index, "category_type", type.id)}
                                                    className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition-all ${
                                                        Number(cat.category_type) === type.id
                                                            ? "bg-[#FF9F43] border-[#FF9F43] text-white shadow-sm shadow-[#FF9F43]/20"
                                                            : "bg-white border-slate-200 text-slate-500 hover:border-[#FF9F43]/30"
                                                    }`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <FileUpload
                                        label="Category Image"
                                        field={`categories.${index}.image`}
                                        data={data}
                                        setData={(field, value) => handleImageUpdate(index, value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />


                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-gray-400">Total Selection:</span>
                            <div className="flex items-center bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                                <span className="font-bold text-[#FF9F43]">{data.categories.length}</span>
                                <span className="mx-1 text-gray-400">/</span>
                                <span className="text-gray-600 font-semibold">20 Max</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[#1B2838] hover:bg-slate-100 transition font-bold text-[14px]"
                            >
                                <XCircle size={18} /> Clear All
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-[#FF9F43] text-white px-10 py-2.5 rounded-lg hover:bg-[#e68a30] transition font-bold text-[14px] shadow-lg shadow-[#FF9F43]/20 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {processing ? "Saving..." : "Save Categories"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
