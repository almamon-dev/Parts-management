import React, { useRef, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { TableManager } from "@/Hooks/TableManager";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Search,
    Plus,
    Pencil,
    Eye,
    Calendar,
    MapPin,
    ImageOff,
    X,
    ChevronDown,
    Check,
    Upload,
    AlertCircle,
    Tag,
    Filter,
    Settings,
} from "lucide-react";
import ConfirmDelete from "@/Components/ui/admin/ConfirmDelete";
import ConfirmBulkDelete from "@/Components/ui/admin/ConfirmBulkDelete";
import PrintLabelButton from "@/Components/ui/admin/PrintLabelButton";

export default function Index({
    products,
    categoriesTier1 = [],
    categoriesTier2 = [],
    categoriesTier3 = [],
    subCategories = [],
    filters = {},
    counts = {},
}) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        search,
        handleSearch,
        isLoading,
        loadingType,
        selectedIds,
        toggleSelectAll,
        toggleSelect,
        selectAllGlobal,
        setSelectAllGlobal,
        clearSelection,
        handleFilterChange,
        handleClearFilters,
        currentFilters,
    } = TableManager("admin.products.index", products.data, {
        ...filters,
        only: ["products", "counts"],
    });

    // Optimized Loading Logic
    const isDataLoading = isLoading && products.data.length > 0;

    // Filter values for checking active states
    const currentStatus = currentFilters.status || "all";
    const currentCategoryName = currentFilters.category || "";
    const currentTier2Name = currentFilters.category_2 || "";
    const currentTier3Name = currentFilters.category_3 || "";
    const currentSearch = currentFilters.search || "";

    const handleStatusChange = (status) =>
        handleFilterChange({ status: status === "all" ? null : status });
    const handleCategoryChange = (categoryName) =>
        handleFilterChange({ category: categoryName });
    const handleTier2Change = (categoryName) =>
        handleFilterChange({ category_2: categoryName });
    const handleTier3Change = (categoryName) =>
        handleFilterChange({ category_3: categoryName });

    const formatDate = (dateString) =>
        dateString
            ? new Date(dateString).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })
            : "N/A";

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            router.post(route("admin.products.import"), formData, {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => {
                    setIsUploading(false);
                },
            });
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            public: {
                classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
                dot: "bg-emerald-500",
                ping: false,
            },
            visible: {
                classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
                dot: "bg-emerald-500",
                ping: false,
            },
            private: {
                classes: "bg-amber-50 text-amber-700 border-amber-100",
                dot: "bg-amber-500",
                ping: false,
            },
            draft: {
                classes: "bg-slate-100 text-slate-600 border-slate-200",
                dot: "bg-slate-400",
                ping: false,
            },
        };
        const theme = config[status?.toLowerCase()] || config.draft;
        return (
            <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${theme.classes}`}
            >
                <span
                    className={`inline-flex rounded-full h-1.5 w-1.5 mr-1.5 ${theme.dot}`}
                ></span>
                {status || "Draft"}
            </span>
        );
    };

    const isAllPageSelected =
        products.data.length > 0 &&
        (selectAllGlobal ||
            products.data.every((p) => selectedIds.includes(p.id)));

    return (
        <AdminLayout>
            <Head title="Products" />

            {isUploading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center border border-slate-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF9F43]/20 border-t-[#FF9F43] mx-auto mb-4"></div>
                        <p className="text-slate-900 font-bold text-lg">
                            Importing products...
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                            Please wait while we process your file.
                        </p>
                    </div>
                </div>
            )}

            <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Products
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Manage inventory and visibility.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".xlsx,.xls,.csv"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            disabled={isUploading || isLoading}
                            className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                        >
                            <Upload size={16} className="mr-2 text-slate-400" />{" "}
                            Import
                        </button>
                        {/* <a
                            href={route("admin.products.export")}
                            className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200"
                        >
                            <Download
                                size={16}
                                className="mr-2 text-slate-400"
                            />{" "}
                            Export
                        </a> */}
                        <Link
                            href={route("admin.products.create")}
                            className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-[#FF9F43] text-white text-[13px] font-bold rounded-lg hover:bg-[#e68a30] transition-all duration-200 shadow-lg shadow-orange-100"
                        >
                            <Plus size={16} className="mr-2" /> Add Item
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6 mb-4 px-1 text-sm border-b border-slate-200 overflow-x-auto custom-scrollbar whitespace-nowrap scroll-smooth">
                    {[
                        { id: "all", label: "All Products", count: counts.all },
                        {
                            id: "published",
                            label: "Published",
                            count: counts.published,
                        },
                        { id: "draft", label: "Drafts", count: counts.draft },
                        {
                            id: "private",
                            label: "Private",
                            count: counts.private,
                        },
                        {
                            id: "no_image",
                            label: "No Images",
                            count: counts.no_image,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleStatusChange(tab.id)}
                            disabled={isLoading}
                            className={`pb-3 transition-all relative font-semibold text-[13px] flex-shrink-0 ${currentStatus === tab.id ? "text-[#FF9F43]" : "text-slate-500 hover:text-slate-700"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {tab.label}{" "}
                            <span className="ml-1 text-slate-400 font-medium">
                                ({tab.count?.toLocaleString() || 0})
                            </span>
                            {currentStatus === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden relative">
                    {/* Linear Progress Bar */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF9F43]/10 overflow-hidden z-20">
                            <div className="h-full bg-[#FF9F43] animate-progress-indeterminate w-1/3 rounded-full" />
                        </div>
                    )}

                    {isAllPageSelected &&
                        !selectAllGlobal &&
                        products.total > products.data.length && (
                            <div className="bg-[#FF9F43]/10 border-b border-[#FF9F43]/20 px-6 py-3 text-[13px] text-[#e68a30] flex items-center justify-center gap-2">
                                <span>
                                    All <b>{products.data.length}</b> products
                                    on this page are selected.
                                </span>
                                <button
                                    onClick={() => setSelectAllGlobal(true)}
                                    className="font-bold underline"
                                >
                                    Select all {products.total.toLocaleString()}
                                </button>
                            </div>
                        )}

                    <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-100 gap-4">
                        <div className="flex flex-wrap items-center gap-3 flex-1">
                            <div className="relative w-full max-w-sm">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-slate-200 rounded-lg text-[13px] focus:bg-white focus:ring-2 focus:ring-[#FF9F43]/10 transition-all outline-none border focus:border-[#FF9F43]"
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    disabled={isLoading}
                                    className={`flex items-center h-9 px-3 rounded-lg text-[13px] font-medium transition-all disabled:opacity-50 border ${
                                        currentCategoryName
                                            ? "bg-[#FF9F43]/10 border-[#FF9F43]/20 text-[#e68a30]"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {currentCategoryName || "Categories"}{" "}
                                    <ChevronDown
                                        className={`ml-2 h-4 w-4 ${currentCategoryName ? "text-[#FF9F43]" : "opacity-40"}`}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-56 p-1 rounded-lg shadow-lg bg-white border-slate-100"
                                >
                                    <DropdownMenuItem
                                        onClick={() => handleCategoryChange("")}
                                        className="rounded-md text-[13px]"
                                    >
                                        All Categories
                                    </DropdownMenuItem>
                                    {categoriesTier1.map((cat) => (
                                        <DropdownMenuItem
                                            key={cat.id}
                                            onClick={() =>
                                                handleCategoryChange(cat.name)
                                            }
                                            className="flex justify-between rounded-md text-[13px]"
                                        >
                                            {cat.name}{" "}
                                            {currentCategoryName ===
                                                cat.name && (
                                                <Check
                                                    size={14}
                                                    className="text-[#FF9F43]"
                                                />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    disabled={isLoading}
                                    className={`flex items-center h-9 px-3 rounded-lg text-[13px] font-medium transition-all disabled:opacity-50 border ${
                                        currentTier2Name
                                            ? "bg-[#FF9F43]/10 border-[#FF9F43]/20 text-[#e68a30]"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {currentTier2Name || "Shop View"}{" "}
                                    <ChevronDown
                                        className={`ml-2 h-4 w-4 ${currentTier2Name ? "text-[#FF9F43]" : "opacity-40"}`}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-56 p-1 rounded-lg shadow-lg bg-white border-slate-100"
                                >
                                    <DropdownMenuItem
                                        onClick={() => handleTier2Change("")}
                                        className="rounded-md text-[13px]"
                                    >
                                        All (Shop View)
                                    </DropdownMenuItem>
                                    {categoriesTier2.map((cat) => (
                                        <DropdownMenuItem
                                            key={cat.id}
                                            onClick={() =>
                                                handleTier2Change(cat.name)
                                            }
                                            className="flex justify-between rounded-md text-[13px]"
                                        >
                                            {cat.name}{" "}
                                            {currentTier2Name === cat.name && (
                                                <Check
                                                    size={14}
                                                    className="text-[#FF9F43]"
                                                />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    disabled={isLoading}
                                    className={`flex items-center h-9 px-3 rounded-lg text-[13px] font-medium transition-all disabled:opacity-50 border ${
                                        currentTier3Name
                                            ? "bg-[#FF9F43]/10 border-[#FF9F43]/20 text-[#e68a30]"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {currentTier3Name || "Sorting"}{" "}
                                    <ChevronDown
                                        className={`ml-2 h-4 w-4 ${currentTier3Name ? "text-[#FF9F43]" : "opacity-40"}`}
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-56 p-1 rounded-lg shadow-lg bg-white border-slate-100"
                                >
                                    <DropdownMenuItem
                                        onClick={() => handleTier3Change("")}
                                        className="rounded-md text-[13px]"
                                    >
                                        All (Sorting)
                                    </DropdownMenuItem>
                                    {categoriesTier3.map((cat) => (
                                        <DropdownMenuItem
                                            key={cat.id}
                                            onClick={() =>
                                                handleTier3Change(cat.name)
                                            }
                                            className="flex justify-between rounded-md text-[13px]"
                                        >
                                            {cat.name}{" "}
                                            {currentTier3Name === cat.name && (
                                                <Check
                                                    size={14}
                                                    className="text-[#FF9F43]"
                                                />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {(currentCategoryName ||
                                currentTier2Name ||
                                currentTier3Name ||
                                search) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="text-slate-400 hover:text-rose-600 text-[13px] font-medium transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {(selectedIds.length > 0 || selectAllGlobal) && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearSelection}
                                    className="inline-flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-800 text-[13px] font-medium transition-colors"
                                >
                                    Deselect All
                                </button>
                                <ConfirmBulkDelete
                                    selectedIds={selectedIds}
                                    selectAllGlobal={selectAllGlobal}
                                    totalCount={products.total}
                                    search={currentSearch}
                                    routeName="admin.products.bulk-destroy"
                                    onSuccess={clearSelection}
                                />
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-3 px-6 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllPageSelected}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all"
                                        />
                                    </th>
                                    <th className="py-3 px-4">Product Info</th>
                                    <th className="py-3 px-4">Stock</th>
                                    <th className="py-3 px-4">SKU</th>
                                    <th className="py-3 px-4">LOC</th>
                                    <th className="py-3 px-4">Pricing</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right pr-10">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody
                                className={`divide-y divide-slate-50 transition-all duration-300 ${
                                    isDataLoading
                                        ? "opacity-40 grayscale-[0.5] pointer-events-none"
                                        : "opacity-100"
                                }`}
                            >
                                {products.data.length > 0 ? (
                                    products.data.map((item) => {
                                        const totalStock =
                                            (Number(item.stock_oakville) || 0) +
                                            (Number(item.stock_mississauga) ||
                                                0) +
                                            (Number(item.stock_saskatoon) || 0);
                                        const firstImage =
                                            item.files?.find(
                                                (f) => f.file_type === "image",
                                            ) || item.files?.[0];
                                        return (
                                            <tr
                                                key={item.id}
                                                className={`${selectedIds.includes(item.id) || selectAllGlobal ? "bg-[#FF9F43]/5" : "hover:bg-slate-50/30"} transition-all duration-150`}
                                            >
                                                <td className="py-4 px-6 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedIds.includes(
                                                                item.id,
                                                            ) || selectAllGlobal
                                                        }
                                                        onChange={() =>
                                                            toggleSelect(
                                                                item.id,
                                                            )
                                                        }
                                                        className="w-4 h-4 rounded border-slate-300 text-[#FF9F43] focus:ring-[#FF9F43] transition-all"
                                                    />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex gap-3">
                                                        <div className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                                                            {firstImage ? (
                                                                <img
                                                                    src={`/${firstImage.thumbnail_path}`}
                                                                    className="w-full h-full object-contain p-0.5"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    alt={
                                                                        item.description
                                                                    }
                                                                />
                                                            ) : (
                                                                <ImageOff className="w-5 h-5 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-semibold text-slate-800 text-[13px] leading-snug mb-0.5 line-clamp-1">
                                                                {
                                                                    item.description
                                                                }
                                                            </span>
                                                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                                <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded leading-none uppercase">
                                                                    {item
                                                                        .category
                                                                        ?.name ||
                                                                        "N/A"}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded leading-none uppercase">
                                                                    {item
                                                                        .shop_view
                                                                        ?.name ||
                                                                        "N/A"}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded leading-none uppercase">
                                                                    {item
                                                                        .sorting
                                                                        ?.name ||
                                                                        "N/A"}
                                                                </span>

                                                                {/* Fitments */}
                                                                {item.fitments?.map(
                                                                    (
                                                                        fit,
                                                                        fIdx,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                fIdx
                                                                            }
                                                                            className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded leading-none flex items-center gap-1"
                                                                        >
                                                                            <Settings
                                                                                size={
                                                                                    8
                                                                                }
                                                                            />
                                                                            {fit.year_from ===
                                                                            fit.year_to
                                                                                ? fit.year_from
                                                                                : `${fit.year_from}-${fit.year_to}`}{" "}
                                                                            {
                                                                                fit.make
                                                                            }{" "}
                                                                            {
                                                                                fit.model
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-4">
                                                    {totalStock === 0 ? (
                                                        <span className="text-rose-500 text-[10px] font-bold uppercase tracking-tight">
                                                            Out of Stock
                                                        </span>
                                                    ) : (
                                                        <div className="text-[11px] text-slate-500">
                                                            <span title="Oakville">
                                                                {item.stock_oakville ||
                                                                    0}
                                                            </span>{" "}
                                                            /{" "}
                                                            <span title="Mississauga">
                                                                {item.stock_mississauga ||
                                                                    0}
                                                            </span>{" "}
                                                            /{" "}
                                                            <span title="Saskatoon">
                                                                {item.stock_saskatoon ||
                                                                    0}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-[12px] font-mono text-slate-600">
                                                        {item.sku}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-slate-500 text-[12px]">
                                                    <div className="inline-flex items-center">
                                                        <MapPin
                                                            size={12}
                                                            className="mr-1 opacity-40"
                                                        />{" "}
                                                        {item.location_id ||
                                                            "—"}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col leading-tight">
                                                        <span className="text-slate-800 font-bold text-[13px]">
                                                            ${item.list_price}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            Buy: $
                                                            {item.buy_price}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {getStatusBadge(
                                                        item.visibility,
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right pr-6">
                                                    <div className="flex justify-end items-center gap-1.5">
                                                        <PrintLabelButton
                                                            product={item}
                                                        />
                                                        <Link
                                                            href={route(
                                                                "admin.products.show",
                                                                item.id,
                                                            )}
                                                            className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-indigo-500 hover:bg-white bg-transparent border border-transparent hover:border-slate-200 rounded-lg transition-all duration-200"
                                                        >
                                                            <Eye size={15} />
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.products.edit",
                                                                item.id,
                                                            )}
                                                            className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-[#e68a30] hover:bg-white bg-transparent border border-transparent hover:border-slate-200 rounded-lg transition-all duration-200"
                                                        >
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <ConfirmDelete
                                                            id={item.id}
                                                            routeName="admin.products.destroy"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                                    <Search size={32} />
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-700">
                                                    No products found
                                                </h3>
                                                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                                                    We couldn't find any
                                                    products matching your
                                                    search criteria.
                                                </p>
                                                {(search ||
                                                    currentStatus !== "all" ||
                                                    currentCategoryName) && (
                                                    <button
                                                        onClick={
                                                            handleClearFilters
                                                        }
                                                        className="mt-4 text-[#FF9F43] text-xs font-bold hover:underline"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                        <Pagination meta={products} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
