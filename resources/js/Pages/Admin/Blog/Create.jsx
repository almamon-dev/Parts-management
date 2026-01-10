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
    Tag,
    Image as ImageIcon,
    UploadCloud,
    FileText,
} from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        content: "",
        author: "",
        category: "",
        image: null,
        imagePreview: null,
    });

    // ইমেজ সিলেক্ট করলে প্রিভিউ দেখানোর জন্য
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
        post(route("blogs.store"), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Create New Blog" />

            <div className="p-6 bg-[#F8F9FB] min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-[22px] font-bold text-[#212B36] flex items-center gap-2">
                            <LayoutGrid className="text-[#FF9F43]" size={24} />
                            Create New Blog
                        </h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            Publish a new article to your website
                        </p>
                    </div>
                    <Link
                        href={route("blogs.index")}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-bold text-[13px] shadow-sm"
                    >
                        <ChevronLeft size={19} /> Back to Blogs
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                            <Input
                                label="Blog Title"
                                placeholder="Enter a catchy title..."
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
                                    className={`w-full border rounded-lg p-4 text-[14px] min-h-[300px] outline-none transition-all ${
                                        errors.content
                                            ? "border-red-500 bg-red-50/10"
                                            : "border-gray-200 focus:border-[#FF9F43]"
                                    }`}
                                    placeholder="Write your blog content here..."
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

                    {/* Right Column: Meta Info & Image */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                            <h3 className="text-[15px] font-bold text-[#212B36] border-b pb-3 mb-4">
                                Post Details
                            </h3>

                            <Input
                                label="Author Name"
                                placeholder="E.g. Admin"
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
                                {errors.category && (
                                    <p className="text-red-500 text-xs">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-[#212B36]">
                                    Featured Image
                                </label>
                                <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-[#FF9F43]/50">
                                    {data.imagePreview ? (
                                        <div className="relative h-48 w-full">
                                            <img
                                                src={data.imagePreview}
                                                className="h-full w-full object-cover"
                                                alt="Preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData({
                                                        ...data,
                                                        image: null,
                                                        imagePreview: null,
                                                    })
                                                }
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                                            <UploadCloud
                                                size={40}
                                                className="text-gray-300 mb-2 group-hover:text-[#FF9F43] transition-colors"
                                            />
                                            <span className="text-[13px] font-semibold text-gray-500 group-hover:text-[#FF9F43]">
                                                Click to upload image
                                            </span>
                                            <span className="text-[11px] text-gray-400 mt-1">
                                                JPG, PNG (Max 2MB)
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

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-[#FF9F43] text-white py-3 rounded-xl hover:bg-[#e68a30] transition font-bold shadow-lg disabled:opacity-50"
                            >
                                <Save size={20} />
                                {processing ? "Publishing..." : "Publish Blog"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="w-full bg-[#1B2838] text-white py-3 rounded-xl hover:bg-[#2c3e50] transition font-bold"
                            >
                                Reset Form
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
