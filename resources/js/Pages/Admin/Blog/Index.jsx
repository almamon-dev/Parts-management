import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { Skeleton } from "@/Components/ui/Skeleton";
import { TableManager } from "@/Hooks/TableManager";
import {
    Search,
    Plus,
    Trash2,
    Pencil,
    X,
    User,
    Calendar,
    ImageIcon,
} from "lucide-react";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";

export default function Index({ blogs }) {
    // TableManager for search and selection logic
    const {
        search,
        handleSearch,
        isLoading,
        selectedIds,
        toggleSelectAll,
        toggleSelect,
        selectAllGlobal,
        setSelectAllGlobal,
        clearSelection,
    } = TableManager("admin.blogs.index", blogs?.data || [], {
        only: ["blogs"],
    });

    const skeletonRows = Array.from({ length: 5 });
    const blogData = blogs?.data || [];

    const isAllPageSelected =
        blogData.length > 0 &&
        (selectAllGlobal || blogData.every((p) => selectedIds.includes(p.id)));

    return (
        <AdminLayout>
            <Head title="Blog Management" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Blogs
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Manage your articles, news, and published content.
                        </p>
                    </div>

                    <Link
                        href={route("admin.blogs.create")}
                        className="bg-[#FF9F43] text-white px-4 py-2 rounded-md font-bold text-[13px] flex items-center gap-2 hover:bg-[#e68a2e] transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Create New Blog
                    </Link>
                </div>

                {/* --- Table Section --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    {/* Integrated Search & Selection Bar */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <div className="relative w-full max-w-md">
                            <Search
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search blogs..."
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none border"
                            />
                        </div>

                        {/* Bulk Action Bar */}
                        {(selectedIds.length > 0 || selectAllGlobal) && (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <span className="text-sm font-medium text-slate-500 mr-2">
                                    {selectAllGlobal
                                        ? blogs?.total
                                        : selectedIds.length}{" "}
                                    selected
                                </span>
                                <button
                                    onClick={clearSelection}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <ConfirmBulkDelete
                                    selectedIds={selectedIds}
                                    selectAllGlobal={selectAllGlobal}
                                    totalCount={blogs?.total || 0}
                                    search={search}
                                    routeName="admin.blogs.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 font-semibold text-[13px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-4 px-6 w-12">
                                        <input
                                            type="checkbox"
                                            checked={isAllPageSelected}
                                            onChange={toggleSelectAll}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                                        />
                                    </th>
                                    <th className="py-4 px-4">Blog Details</th>
                                    <th className="py-4 px-4">Category</th>
                                    <th className="py-4 px-4">Author</th>
                                    <th className="py-4 px-4">Date</th>
                                    <th className="py-4 px-4 text-right pr-8">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    /* --- Enhanced Per-Column Skeleton Loading --- */
                                    skeletonRows.map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {/* Checkbox Skeleton */}
                                            <td className="py-4 px-6">
                                                <Skeleton className="h-4 w-4 rounded" />
                                            </td>

                                            {/* Blog Details Skeleton (Image + Title + Small Content) */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-40 rounded" />
                                                        <Skeleton className="h-3 w-24 rounded" />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category Skeleton */}
                                            <td className="py-4 px-4">
                                                <Skeleton className="h-6 w-20 rounded-md" />
                                            </td>

                                            {/* Author Skeleton */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4 rounded-full" />
                                                    <Skeleton className="h-4 w-24 rounded" />
                                                </div>
                                            </td>

                                            {/* Date Skeleton */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4 rounded" />
                                                    <Skeleton className="h-4 w-16 rounded" />
                                                </div>
                                            </td>

                                            {/* Actions Skeleton */}
                                            <td className="py-4 px-3 text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : blogData.length > 0 ? (
                                    blogData.map((item) => {
                                        const isSelected =
                                            selectedIds.includes(item.id) ||
                                            selectAllGlobal;

                                        return (
                                            <tr
                                                key={item.id}
                                                className={`${
                                                    isSelected
                                                        ? "bg-indigo-50/30"
                                                        : "hover:bg-slate-50/50"
                                                } transition-colors group`}
                                            >
                                                <td className="py-4 px-6">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelect(
                                                                item.id,
                                                            )
                                                        }
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                                                    />
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                            {item.image_url ? (
                                                                <img
                                                                    src={
                                                                        item.image_url
                                                                    }
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <ImageIcon
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="max-w-[240px]">
                                                            <h6 className="text-sm font-bold text-slate-700 truncate capitalize">
                                                                {item.title}
                                                            </h6>
                                                            <p className="text-[11px] text-slate-400 line-clamp-1">
                                                                {item.content
                                                                    ?.replace(
                                                                        /<[^>]*>?/gm,
                                                                        "",
                                                                    )
                                                                    .substring(
                                                                        0,
                                                                        60,
                                                                    )}
                                                                ...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-[#FF9F43] border border-orange-100 uppercase tracking-tighter">
                                                        {item.category ||
                                                            "General"}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                                                        <User
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {item.author}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4 text-[12px] text-slate-500 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {new Date(
                                                            item.created_at,
                                                        ).toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-3 text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.blogs.edit",
                                                                item.id,
                                                            )}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg shadow-sm transition-all"
                                                        >
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <ConfirmDelete
                                                            id={item.id}
                                                            routeName="admin.blogs.destroy"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="py-32 text-center text-slate-400 font-medium"
                                        >
                                            No blogs found. Start by creating
                                            one!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* --- Pagination --- */}
                    <div className="p-5">
                        <Pagination meta={blogs} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
