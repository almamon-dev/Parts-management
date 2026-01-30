import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {
    Search,
    Star,
    ShoppingCart,
    ChevronDown,
    Plus,
    Minus,
    ImageOff,
    XCircle,
    Info,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { debounce } from "lodash";
import ProductDetailsModal from "@/Components/ui/user/ProductDetailsModal";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const SearchInput = memo(({ initialValue, onSearch, isLoading }) => {
    const [localValue, setLocalValue] = useState(initialValue || "");

    useEffect(() => {
        setLocalValue(initialValue || "");
    }, [initialValue]);

    const handleChange = (e) => {
        const val = e.target.value;
        setLocalValue(val);
        onSearch(val);
    };

    return (
        <div className="relative flex-1 min-w-full sm:min-w-[300px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-[#A80000]">
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#A80000] border-t-transparent rounded-full animate-spin" />
                ) : (
                    <Search className="w-5 h-5 pointer-events-none" />
                )}
            </div>
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                placeholder="Search description or SKU..."
                className="w-full pl-12 pr-12 py-3 rounded-full border border-slate-200 shadow-sm focus:ring-4 focus:ring-[#A80000]/10 focus:border-[#A80000] bg-white outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
            {localValue && !isLoading && (
                <button
                    onClick={() => {
                        setLocalValue("");
                        onSearch("");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            )}
        </div>
    );
});

const FilterDropdown = memo(
    ({ label, filterKey, options, currentValue, onFilter, isDisabled }) => {
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger 
                    disabled={isDisabled}
                    className={cn(
                        "bg-white px-5 py-3 rounded-full shadow-sm flex items-center gap-3 min-w-[140px] justify-between border border-slate-200 hover:border-[#A80000]/30 hover:bg-slate-50/50 outline-none focus:outline-none focus:ring-0 group select-none transition-all",
                        isDisabled && "opacity-50 cursor-not-allowed bg-slate-50 grayscale"
                    )}
                >
                    <span className={cn("text-xs font-bold truncate max-w-[100px] tracking-wide", currentValue ? "text-[#A80000]" : "text-slate-600 group-hover:text-slate-900")}>
                        {currentValue || label}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 group-hover:text-[#A80000] transition-colors" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className="min-w-max w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-slate-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-[100] p-1.5 outline-none focus:outline-none focus:ring-0"
                    align="start"
                >
                    <DropdownMenuItem
                        className="font-bold text-red-500 focus:bg-red-50 focus:outline-none cursor-pointer rounded-xl py-2 px-3 text-xs "
                        onClick={() => onFilter(filterKey, "")}
                    >
                        All {label}s
                    </DropdownMenuItem>
                    {options.map((opt) => (
                        <DropdownMenuItem
                            key={opt}
                            onClick={() => onFilter(filterKey, opt)}
                            className="focus:bg-slate-50 focus:outline-none cursor-pointer rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 capitalize"
                        >
                            {opt}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
);

const ProductRow = memo(
    ({
        product,
        quantity,
        styles,
        onToggleFavorite,
        onQuantityChange,
        onAddToCart,
        onImageClick,
    }) => {
        const firstImage = product.files?.[0] || null;

        // Dynamic Badge Styling
        const subCatName = product.sub_category?.name?.toUpperCase() || "";
        const isOEMUsed = subCatName === "OEM USED";
        const isAftermarket = subCatName === "AFTERMARKET";
        const isOEMTakeOff = subCatName === "OEM TAKE-OFF";

        const badgeStyle = isOEMUsed
            ? "bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.3)]"
            : isAftermarket
              ? "bg-[#0891B2] text-white shadow-[0_0_12px_rgba(8,145,178,0.3)]"
              : isOEMTakeOff
                ? "bg-[#F59E0B] text-white shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "bg-slate-500 text-white shadow-sm";

        return (
            <tr
                className={cn(
                    styles.rowHover,
                    styles.accent,
                    "transition-all group odd:bg-white even:bg-slate-50/50 h-[90px] border-b border-slate-50"
                )}
            >
                <td className="py-2 pl-4">
                    <div className="flex gap-3 items-center">
                        {/* Vertical Badge - Fixed Overflow for Long Names */}
                        <div
                            className={cn(
                                "h-[76px] w-8 flex items-center justify-center rounded-full shrink-0 transition-all duration-300 group-hover:scale-105 overflow-hidden",
                                badgeStyle
                            )}
                        >
                            <span className={cn(
                                "font-black [writing-mode:vertical-lr] rotate-180 tracking-[0.05em]  leading-none text-center",
                                (product.sub_category?.name || "PART").length > 12 ? "text-[6px]" : "text-[7.5px]"
                            )}>
                                {product.sub_category?.name || "PART"}
                            </span>
                        </div>

                        {/* Image Container */}
                        <div 
                            onClick={() => onImageClick(product)}
                            className="w-24 h-16 rounded-2xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative group-hover:border-[#A80000]/40 cursor-pointer transition-all active:scale-95"
                        >
                            {firstImage ? (
                                <img
                                    src={`/${firstImage.file_path}`}
                                    alt={product.description}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <ImageOff className="w-6 h-6 text-slate-200" />
                            )}
                        </div>

                        {/* Favorite Star */}
                        <button
                            onClick={() => onToggleFavorite(product.id)}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all shrink-0 hover:scale-110 active:scale-95",
                                product.is_favorite
                                    ? "bg-amber-50 shadow-sm"
                                    : "bg-slate-50 hover:bg-amber-50"
                            )}
                        >
                            <Star
                                className={cn(
                                    "w-4 h-4 transition-all",
                                    product.is_favorite
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300 group-hover:text-slate-400"
                                )}
                            />
                        </button>
                    </div>
                 </td>
                <td className="px-6 py-2">
                    <div className="flex flex-col gap-1.5">
                        <h4 className="font-bold text-slate-800 text-[14px] line-clamp-1 leading-tight tracking-tight ">
                            {product.description}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="inline-flex items-center h-5 bg-slate-50 border border-slate-200 rounded px-2 gap-2 shadow-sm group-hover:border-[#A80000]/30 transition-colors">
                                <span className="text-[9px] font-black text-[#A80000] whitespace-nowrap tracking-tighter">
                                    {product.fitments?.[0]
                                        ? `${product.fitments[0].year_from} — ${product.fitments[0].year_to}`
                                        : "N/A YEAR"}
                                </span>
                                <div className="w-px h-2.5 bg-slate-200" />
                                <span className="text-[9px] font-black text-slate-500 uppercase truncate max-w-[150px]">
                                    {product.fitments?.[0]
                                        ? `${product.fitments[0].make} ${product.fitments[0].model}`
                                        : "Universal Fit"}
                                </span>
                            </div>
                        </div>
                    </div>
                </td>

                <td className="px-2 py-2 text-[12px] font-mono font-bold text-slate-500 text-center group-hover:text-slate-900 transition-colors whitespace-nowrap">
                    {product.sku || <span className="text-slate-200">—</span>}
                </td>
                <td className="px-2 py-2 text-center whitespace-nowrap">
                    {product.applied_discount > 0 ? (
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-slate-400 line-through tracking-tighter">
                                ${product.list_price}
                            </span>
                            <span className={cn(
                                "text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5",
                                product.discount_type === 'specific' 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-amber-100 text-amber-700"
                            )}>
                                {product.applied_discount}% OFF
                            </span>
                        </div>
                    ) : (
                        <span className="text-[12px] font-bold text-slate-500 tracking-tighter">—</span>
                    )}
                </td>
                <td className="px-2 py-2 text-center text-[15px] font-black tracking-tight whitespace-nowrap">
                    <span className={product.applied_discount > 0 ? "text-emerald-600" : "text-slate-900"}>
                        ${product.your_price || product.list_price || "0.00"}
                    </span>
                </td>
                <td className="px-6 py-2">
                    <div className="flex items-center gap-2 justify-end">
                        <div className="flex items-center bg-slate-100/80 border border-slate-200/60 rounded-xl p-1">
                            <button
                                onClick={() => onQuantityChange(product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm text-slate-400 hover:text-red-500 transition-all active:scale-90 disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-[14px] font-black text-slate-700">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onQuantityChange(product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm text-slate-400 hover:text-[#A80000] transition-all active:scale-90"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <button
                            onClick={() => onAddToCart(product.id)}
                            className={cn(
                                "p-3 rounded-xl text-white shadow-lg transition-all active:scale-90 flex items-center justify-center gap-2",
                                product.in_cart
                                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                    : "bg-[#A80000] hover:bg-[#8B0000] shadow-[#A80000]/20"
                            )}
                        >
                            <ShoppingCart className={cn("w-5 h-5", product.in_cart ? "fill-white" : "fill-none")} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    },
);

export default function Index() {
    const { auth, products, categories, filters, filterOptions } =
        usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(null); // 'search' or 'filter'
    const [quantities, setQuantities] = useState(() =>
        Object.fromEntries(products.map((p) => [p.id, 1])),
    );

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = useCallback((product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(
            ([key, value]) =>
                value !== null && value !== "" && value !== undefined,
        );
    }, [filters]);

    const isSearchActive = useMemo(() => {
        const hasSearchTerm = filters.search && filters.search.trim() !== "";
        const hasFullFitment = filters.year_from && filters.make && filters.model;
        const hasCategory = filters.category && filters.category !== "";
        
        return !!(hasSearchTerm || hasFullFitment || hasCategory);
    }, [filters]);

    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setIsLoading(true);
                setLoadingType('search');
                router.get(
                    route("parts.index"),
                    { ...filters, search: value },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                        only: ["products", "filterOptions", "filters"],
                        onFinish: () => {
                            setIsLoading(false);
                            setLoadingType(null);
                        },
                    },
                );
            }, 300),
        [filters],
    );

    const applyFilter = useCallback(
        (key, value) => {
            if (filters[key] === value) return;
            
            const nextFilters = { ...filters, [key]: value };
            const isPrimarySearchSelected = (nextFilters.search && nextFilters.search.trim() !== "") || 
                                           (nextFilters.year_from && nextFilters.make && nextFilters.model);

        
            setIsLoading(true);
            setLoadingType('filter');
            router.get(
                route("parts.index"),
                nextFilters,
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ["products", "filterOptions", "filters"],
                    onFinish: () => {
                        setIsLoading(false);
                        setLoadingType(null);
                    },
                },
            );
        },
        [filters],
    );

    const clearAllFilters = () => {
        setIsLoading(true);
        router.get(
            route("parts.index"),
            {},
            {
                preserveState: false,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleQuantityChange = useCallback((id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta),
        }));
    }, []);

    const handleToggleFavorite = (productId) => {
        router.post(
            route("parts.favourite"),
            { product_id: productId },
            { 
                preserveScroll: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };


    const handleAddToCart = (productId) => {
        router.post(
            route("parts.to-cart"),
            { product_id: productId, quantity: quantities[productId] || 1 },
            { 
                preserveScroll: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const getSubCategoryStyles = (subCatName) => {
        const name = subCatName?.toUpperCase() || "";
        if (name.includes("OEM"))
            return {
                rowHover: "hover:bg-indigo-50/10",
                accent: "border-l-4 border-l-indigo-600/40",
            };
        if (name.includes("AFTERMARKET"))
            return {
                rowHover: "hover:bg-cyan-50/10",
                accent: "border-l-4 border-l-cyan-600/40",
            };
        return {
            rowHover: "hover:bg-slate-50/50",
            accent: "border-l-4 border-l-slate-400/40",
        };
    };

    const filterConfigs = useMemo(
        () => [
            {
                label: "Category",
                key: "category",
                options: categories?.map((c) => c.name) || [],
            },
            {
                label: "Year",
                key: "year_from",
                options: filterOptions?.years || [],
            },
            { label: "Make", key: "make", options: filterOptions?.makes || [] },
            {
                label: "Model",
                key: "model",
                options: filterOptions?.models || [],
            },
        ],
        [categories, filterOptions],
    );

    return (
        <>
            <Head title="Shop Parts" />
            <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
                <div className="max-w-9xl mx-auto">
                    {/* Header Title */}
                    <div className="mb-6 md:mb-10 text-center md:text-left">
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Shop Parts</h1>
                        <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">Browse and order thousands of high-quality auto parts.</p>
                    </div>

                {/* Filter Bar */}
                <div className="flex flex-col xl:flex-row gap-4 mb-8">
                    <SearchInput
                        initialValue={filters.search}
                        onSearch={debouncedSearch}
                        isLoading={isLoading && loadingType === 'search'}
                    />
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
                            <FilterDropdown
                                label="Category"
                                filterKey="category"
                                options={categories?.map((c) => c.name) || []}
                                currentValue={filters.category}
                                onFilter={applyFilter}
                            />
                            <FilterDropdown
                                label="Year"
                                filterKey="year_from"
                                options={filterOptions?.years || []}
                                currentValue={filters.year_from}
                                onFilter={applyFilter}
                            />
                            <FilterDropdown
                                label="Make"
                                filterKey="make"
                                options={filterOptions?.makes || []}
                                currentValue={filters.make}
                                onFilter={applyFilter}
                                isDisabled={!filters.year_from}
                            />
                            <FilterDropdown
                                label="Model"
                                filterKey="model"
                                options={filterOptions?.models || []}
                                currentValue={filters.model}
                                onFilter={applyFilter}
                                isDisabled={!filters.make}
                            />
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-[12px] font-bold text-[#A80000] hover:text-[#8B0000] transition-colors whitespace-nowrap flex items-center gap-1"
                            >
                                <XCircle className="w-4 h-4" /> Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Section - Enhanced Mobile Scroll */}
                <div className="bg-white rounded-[12px] md:rounded-[16px] shadow-xl shadow-slate-200/40 border border-slate-200/60 relative mb-10">
                    {/* Linear Progress Bar */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#A80000]/10 overflow-hidden z-20 rounded-t-[12px] md:rounded-t-[16px]">
                            <div className="h-full bg-[#A80000] animate-infinite-loading w-1/3 rounded-full shadow-[0_0_8px_rgba(168,0,0,0.5)]" />
                        </div>
                    )}

                    <div className="w-full -mx-0 overflow-hidden">
                        <div className="overflow-x-auto pb-4 touch-pan-x scrollbar-hide">
                            <table className="w-full text-left min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] md:text-[11px] font-black  tracking-[0.12em] text-slate-500 border-b border-slate-100">
                                        <th className="px-5 py-6 w-[220px]">Item View</th>
                                        <th className="px-5 py-6 min-w-[300px]">Product Description</th>

                                        <th className="px-2 py-6 text-center w-[120px]">SKU</th>
                                        <th className="px-2 py-6 text-center w-[100px]">List Price</th>
                                        <th className="px-2 py-6 text-center w-[120px]">Your Price</th>
                                        <th className="px-5 py-6 w-[180px]"></th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-slate-100 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
                                    {!isSearchActive ? (
                                        <tr>
                                            <td colSpan="6" className="py-20 md:py-32 px-6 text-center bg-white">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded-full flex items-center justify-center text-[#A80000]">
                                                        <Info className="w-8 h-8 md:w-10 md:h-10" />
                                                    </div>
                                                    <div className="flex flex-col gap-1 max-w-sm mx-auto">
                                                        <p className="text-slate-900 font-black text-base md:text-lg  tracking-tight">Search for Parts</p>
                                                        <p className="text-slate-400 text-xs md:text-sm font-medium">Please enter a search term or select <strong>Category, Year, Make, or Model</strong> to view products.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : products.length > 0 ? (
                                        products.map((product) => (
                                            <ProductRow
                                                key={product.id}
                                                product={product}
                                                quantity={quantities[product.id] || 1}
                                                styles={getSubCategoryStyles(product.sub_category?.name)}
                                                onToggleFavorite={handleToggleFavorite}
                                                onQuantityChange={handleQuantityChange}
                                                onAddToCart={handleAddToCart}
                                                onImageClick={handleOpenModal}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-20 md:py-32 px-6 text-center bg-white">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center text-[#A80000]">
                                                        <Search className="w-8 h-8 md:w-10 md:h-10" />
                                                    </div>
                                                    <div className="flex flex-col gap-1 max-w-sm mx-auto">
                                                        <p className="text-slate-900 font-black text-base md:text-lg  tracking-tight">No products found</p>
                                                        <p className="text-slate-400 text-xs md:text-sm font-medium">Try adjusting your filters or search terms.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
            </div>
            </div>

            <ProductDetailsModal 
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onToggleFavorite={handleToggleFavorite}
            />
        </>
    );
}

Index.layout = page => <UserLayout children={page} />;
