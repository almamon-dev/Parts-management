import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/admin/input";
import {
    ChevronLeft,
    Save,
    XCircle,
    LayoutGrid,
    Type,
    User,
    Image as ImageIcon,
    UploadCloud,
    FileText,
} from "lucide-react";

export default function Edit({ blog }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        title: blog.title || "",
        content: blog.content || "",
        author: blog.author || "",
        category: blog.category || "",
        image: null,
        imagePreview: blog.image_url || null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setData("imagePreview", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("blogs.update", blog.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Blog - ${blog.title}`} />

            <div className="p-6 bg-[#F8F9FB] min-h-screen">
                {/* Header Area */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-[22px] font-bold text-[#212B36] flex items-center gap-2">
                            <LayoutGrid className="text-[#FF9F43]" size={24} />
                            Edit Blog Post
                        </h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            Update article details and media
                        </p>
                    </div>
                    <Link
                        href={route("blogs.index")}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-[13px] shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <ChevronLeft size={19} /> Back to List
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* Left Column: Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                            <Input
                                label="Blog Title"
                                placeholder="Enter title..."
                                value={data.title}
                                error={errors.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                icon={
                                    <Type size={18} className="text-gray-400" />
                                }
                            />

                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#212B36] flex items-center gap-2">
                                    <FileText size={16} /> Blog Content
                                </label>
                                <textarea
                                    className={`w-full border rounded-lg p-4 text-[14px] min-h-[400px] outline-none transition-all ${
                                        errors.content
                                            ? "border-red-500 bg-red-50/10"
                                            : "border-gray-200 focus:border-[#FF9F43]"
                                    }`}
                                    placeholder="Write content here..."
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                />
                                {errors.content && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                            <h3 className="text-[15px] font-bold text-[#212B36] border-b pb-3 mb-4">
                                Post Settings
                            </h3>

                            <Input
                                label="Author"
                                value={data.author}
                                error={errors.author}
                                onChange={(e) =>
                                    setData("author", e.target.value)
                                }
                                icon={
                                    <User size={18} className="text-gray-400" />
                                }
                            />

                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-[#212B36]">
                                    Category
                                </label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9F43]"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                >
                                    <option value="">Select Category</option>
                                    <option value="Technology">
                                        Technology
                                    </option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>

                            {/* Enhanced Image Section */}
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-[#212B36]">
                                    Featured Image
                                </label>

                                <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-[#FF9F43]/50 h-56 flex items-center justify-center">
                                    {data.imagePreview ? (
                                        <>
                                            <img
                                                src={data.imagePreview}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                alt="Current or New Preview"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                                                <ImageIcon size={30} />
                                                <label className="cursor-pointer bg-[#FF9F43] px-4 py-2 rounded-lg text-xs font-bold shadow-xl hover:bg-[#e68a30] transition-colors">
                                                    Change Image
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer hover:bg-gray-100 transition-colors">
                                            <UploadCloud
                                                size={40}
                                                className="text-gray-300 mb-2 group-hover:text-[#FF9F43]"
                                            />
                                            <span className="text-[12px] font-bold text-gray-500">
                                                Upload Image
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.image && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-[#FF9F43] text-white py-3 rounded-xl hover:bg-[#e68a30] transition-all font-bold shadow-lg disabled:opacity-50"
                            >
                                <Save size={20} />
                                {processing ? "Updating..." : "Update Post"}
                            </button>
                            <Link
                                href={route("blogs.index")}
                                className="w-full flex items-center justify-center gap-2 bg-[#1B2838] text-white py-3 rounded-xl hover:bg-[#2c3e50] transition-all font-bold"
                            >
                                <XCircle size={20} /> Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
