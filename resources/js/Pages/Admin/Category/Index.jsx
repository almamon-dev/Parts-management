import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { Skeleton } from "@/Components/ui/skeleton";
import { TableManager } from "@/Hooks/TableManager";
import { Search, Plus, Trash2, Pencil, X } from "lucide-react";
import ConfirmDelete from "@/Components/ui/ConfirmDelete";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";

export default function Index({ category }) {
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
    } = TableManager("categories.index", category.data);

    const skeletonRows = Array.from({ length: 5 });

    const isAllPageSelected =
        category.data.length > 0 &&
        (selectAllGlobal ||
            category.data.every((p) => selectedIds.includes(p.id)));

    return (
        <AdminLayout>
            <Head title="Category and Sub Category" />

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Category
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Manage your category and and sub-category here.
                        </p>
                    </div>

                    <Link
                        href="/categories/create"
                        className="bg-[#FF9F43] text-white px-4 py-2 rounded-md font-bold text-[13px] flex items-center gap-2 hover:bg-[#e68a2e] transition-colors"
                    >
                        <Plus size={16} /> Add item
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
                                placeholder="Search by name, SKU or category..."
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none border"
                            />
                        </div>

                        {/* Bulk Action Bar */}
                        {(selectedIds.length > 0 || selectAllGlobal) && (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <span className="text-sm font-medium text-slate-500 mr-2">
                                    {selectAllGlobal
                                        ? category.total
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
                                    totalCount={category.total}
                                    search={search}
                                    routeName="categories.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    {isAllPageSelected &&
                        !selectAllGlobal &&
                        category.total > category.data.length && (
                            <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-2 text-center">
                                <p className="text-sm text-indigo-900">
                                    All {category.data.length} items on this
                                    page are selected.{" "}
                                    <button
                                        onClick={() => setSelectAllGlobal(true)}
                                        className="text-indigo-600 font-bold hover:underline ml-1"
                                    >
                                        Select all {category.total} items in
                                        category and sub category
                                    </button>
                                </p>
                            </div>
                        )}

                    {selectAllGlobal && (
                        <div className="bg-indigo-50/50 border-b border-indigo-100 px-6 py-2 text-center">
                            <p className="text-sm text-indigo-900">
                                All <strong>{category.total}</strong> items
                                selected.{" "}
                                <button
                                    onClick={clearSelection}
                                    className="text-indigo-600 font-bold hover:underline ml-1"
                                >
                                    Clear selection
                                </button>
                            </p>
                        </div>
                    )}

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
                                    <th className="py-4 px-4">Name</th>
                                    <th className="py-4 px-4">
                                        Sub Categories
                                    </th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-4 text-right pr-8">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    skeletonRows.map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-6">
                                                <Skeleton className="h-4 w-4 rounded" />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Skeleton className="h-4 w-12" />
                                            </td>
                                            <td className="p-4">
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                            </td>
                                            <td className="p-4">
                                                <Skeleton className="h-8 w-24 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : category.data.length > 0 ? (
                                    category.data.map((item) => {
                                        const isSelected =
                                            selectAllGlobal ||
                                            selectedIds.includes(item.id);

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
                                                                item.id
                                                            )
                                                        }
                                                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                                                    />
                                                </td>

                                                <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                                                    {item.name}
                                                </td>

                                                <td className="py-4 px-4 max-w-[300px]">
                                                    <div className="flex flex-wrap gap-1.5 items-center">
                                                        {item.sub_categories
                                                            ?.length > 0 ? (
                                                            <>
                                                                {item.sub_categories
                                                                    .slice(0, 5)
                                                                    .map(
                                                                        (
                                                                            sub,
                                                                            idx
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    sub.id ||
                                                                                    idx
                                                                                }
                                                                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
                                                                            >
                                                                                {
                                                                                    sub.name
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}

                                                                {item
                                                                    .sub_categories
                                                                    .length >
                                                                    5 && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                                        +
                                                                        {item
                                                                            .sub_categories
                                                                            .length -
                                                                            5}{" "}
                                                                        more
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs italic">
                                                                No
                                                                Sub-categories
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                                                            item.status ===
                                                            "active"
                                                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                                                                : "bg-slate-50 text-slate-500 ring-1 ring-slate-400/10"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                                item.status ===
                                                                "active"
                                                                    ? "bg-emerald-500"
                                                                    : "bg-slate-400"
                                                            }`}
                                                        />
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3 text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                "categories.edit",
                                                                item.id
                                                            )}
                                                            className="p-1.5 text-gray-400 hover:text-blue-500 bg-white border rounded shadow-sm transition"
                                                        >
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <ConfirmDelete
                                                            id={item.id}
                                                            routeName="categories.destroy"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-32 text-center text-slate-400 font-medium"
                                        >
                                            No category items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-5">
                        <Pagination meta={category} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
