import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
import FileUpload from "@/Components/ui/admin/FileUpload";
import {
    ChevronLeft,
    Save,
    LayoutGrid,
    Star,
} from "lucide-react";

export default function Edit({ category }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        _method: "put",
        name: category.name || "",
        status: category.status || "active",
        category_type: category.category_type ? Number(category.category_type) : 1,
        image: category.image || null, // FileUpload handles string (existing path) or file object
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.categories.update", category.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Category" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-[22px] font-bold text-[#212B36] flex items-center gap-2">
                            <LayoutGrid className="text-[#FF9F43]" size={24} />
                            Edit Category
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Update Tiered Category: {category.name}</p>
                    </div>
                    <Link
                        href={route("admin.categories.index")}
                        className="flex items-center gap-2 bg-[#1B2838] text-white px-4 py-2 rounded-lg font-bold text-[13px] hover:bg-[#2c3e50] transition-all shadow-sm"
                    >
                        <ChevronLeft size={19} /> Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 relative group transition-all hover:border-[#FF9F43]/40">
                         <div className="space-y-4">
                             <div className="flex items-center gap-2 mb-2">
                                 <h3 className="text-[14px] font-bold text-[#212B36]">
                                     Category Information
                                 </h3>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <Input
                                     label="Category Name"
                                     value={data.name}
                                     error={errors.name}
                                     onChange={(e) => setData("name", e.target.value)}
                                     placeholder="Enter category name..."
                                     className="bg-gray-50/50"
                                     containerClassName="w-full"
                                 />

                                 <div>
                                     <label className="text-[13px] font-bold text-[#212B36] mb-1.5 block">
                                         Status
                                     </label>
                                     <select
                                         className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-semibold outline-none focus:border-[#FF9F43] bg-white transition-all h-[42px]"
                                         value={data.status}
                                         onChange={(e) => setData("status", e.target.value)}
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
                                             onClick={() => setData("category_type", type.id)}
                                             className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition-all ${
                                                 data.category_type === type.id
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
                                 field="image"
                                 data={data}
                                 setData={setData}
                                 errors={errors}
                                 clearErrors={clearErrors}
                             />


                         </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
                        <Link
                            href={route("admin.categories.index")}
                            className="px-6 py-2.5 rounded-lg text-slate-600 font-bold text-[14px] hover:bg-slate-100 transition-colors bg-white border border-slate-200 shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-[#FF9F43] text-white px-10 py-2.5 rounded-lg hover:bg-[#e68a30] transition font-bold text-[14px] shadow-lg shadow-[#FF9F43]/20 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
