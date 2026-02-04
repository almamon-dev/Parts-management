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
    Tag,
} from "lucide-react";

import { MAKES } from "@/Constants/makes";
import { MODELS } from "@/Constants/models";

const YEARS = Array.from({ length: 2026 - 1995 + 1 }, (_, i) =>
    (2026 - i).toString(),
);

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
        <div className="relative flex-1 min-w-full lg:min-w-[400px]">
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
                placeholder="Search description, SKU or part number..."
                className="w-full h-12 pl-12 pr-12 rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-[#A80000]/10 focus:border-[#A80000] bg-white outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
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
    ({
        label,
        filterKey,
        options = [],
        currentValue,
        onFilter,
        isDisabled,
        icon: Icon,
    }) => {
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    disabled={isDisabled}
                    className={cn(
                        "bg-white px-4 h-12 rounded-2xl shadow-sm flex items-center gap-3 min-w-[130px] justify-between border border-slate-200 hover:border-[#A80000]/30 hover:bg-slate-50/50 outline-none focus:outline-none focus:ring-0 group select-none transition-all",
                        isDisabled &&
                            "opacity-50 cursor-not-allowed bg-slate-50 grayscale",
                    )}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {Icon && (
                            <Icon
                                size={14}
                                className={cn(
                                    "shrink-0",
                                    currentValue
                                        ? "text-[#A80000]"
                                        : "text-slate-400",
                                )}
                            />
                        )}
                        <span
                            className={cn(
                                "text-[11px] font-bold truncate max-w-[90px] tracking-wide uppercase",
                                currentValue
                                    ? "text-[#A80000]"
                                    : "text-slate-500 group-hover:text-slate-700",
                            )}
                        >
                            {currentValue || label}
                        </span>
                    </div>
                    <ChevronDown
                        size={14}
                        className="text-slate-400 flex-shrink-0 group-hover:text-[#A80000] transition-colors"
                    />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className="min-w-[180px] bg-white border border-slate-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-[100] p-1.5 outline-none focus:outline-none"
                    align="start"
                >
                    <DropdownMenuItem
                        className="font-bold text-[#A80000] focus:bg-red-50 focus:outline-none cursor-pointer rounded-xl py-2 px-3 text-xs uppercase"
                        onClick={() => onFilter(filterKey, "")}
                    >
                        All {label}s
                    </DropdownMenuItem>
                    {options.map((opt) => (
                        <DropdownMenuItem
                            key={opt}
                            onClick={() => onFilter(filterKey, opt)}
                            className="focus:bg-slate-50 focus:outline-none cursor-pointer rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 uppercase"
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
        onToggleFavorite,
        onQuantityChange,
        onAddToCart,
        onImageClick,
    }) => {
        const firstImage = product.files?.[0] || null;

        return (
            <tr className="transition-all group odd:bg-white even:bg-slate-50/30 h-[100px] border-b border-slate-100/60 hover:bg-white">
                <td className="py-3 pl-4">
                    <div className="flex gap-4 items-center text-center">
                        {/* Shop View Tag */}
                        <div className="flex flex-col gap-1 w-[80px] shrink-0">
                            <span
                                className={cn(
                                    "text-[8px] font-black py-0.5 px-2 rounded-full uppercase tracking-widest text-white shadow-sm",
                                    product.shop_view?.name?.includes("OEM")
                                        ? "bg-[#2563EB]"
                                        : "bg-[#0891B2]",
                                )}
                            >
                                {product.shop_view?.name || "STOCK"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {product.sorting?.name || "N/A"}
                            </span>
                        </div>

                        {/* Image Container */}
                        <div
                            onClick={() => onImageClick(product)}
                            className="w-24 h-20 rounded-2xl overflow-hidden bg-white border border-slate-100/80 flex items-center justify-center shrink-0 shadow-sm relative group-hover:border-[#A80000]/40 cursor-pointer transition-all active:scale-95"
                        >
                            {firstImage ? (
                                <img
                                    src={`/${firstImage.file_path}`}
                                    alt={product.description}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-1"
                                />
                            ) : (
                                <ImageOff className="w-6 h-6 text-slate-200" />
                            )}
                        </div>

                        {/* Favorite Star */}
                        <button
                            onClick={() => onToggleFavorite(product.id)}
                            className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all shrink-0 hover:scale-110 active:scale-95",
                                product.is_favorite
                                    ? "bg-amber-50 shadow-sm"
                                    : "bg-slate-50 hover:bg-amber-50",
                            )}
                        >
                            <Star
                                size={18}
                                className={cn(
                                    "transition-all",
                                    product.is_favorite
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300 group-hover:text-slate-400",
                                )}
                            />
                        </button>
                    </div>
                </td>
                <td className="px-6 py-3">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-[#A80000] bg-red-50 px-1.5 py-0.5 rounded uppercase">
                                {product.part_type?.name}
                            </span>
                            <h4 className="font-bold text-slate-800 text-[14px] line-clamp-1 leading-tight tracking-tight">
                                {product.description}
                            </h4>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <div className="inline-flex items-center h-5 bg-slate-50 border border-slate-200/60 rounded px-2 gap-2 group-hover:border-[#A80000]/30 transition-colors">
                                <span className="text-[9px] font-black text-[#A80000] whitespace-nowrap tracking-tighter">
                                    {product.fitments?.[0]
                                        ? `${product.fitments[0].year_from} — ${product.fitments[0].year_to}`
                                        : "N/A YEAR"}
                                </span>
                                <div className="w-px h-2.5 bg-slate-200" />
                                <span className="text-[9px] font-black text-slate-500 uppercase truncate max-w-[200px]">
                                    {product.fitments?.[0]
                                        ? `${product.fitments[0].make} ${product.fitments[0].model}`
                                        : "Universal Fit"}
                                </span>
                            </div>
                        </div>
                    </div>
                </td>

                <td className="px-2 py-3 text-[12px] font-mono font-bold text-slate-400 text-center group-hover:text-slate-900 transition-colors whitespace-nowrap">
                    {product.sku || <span className="text-slate-200">—</span>}
                </td>
                <td className="px-2 py-3 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                        <span
                            className={cn(
                                "text-[12px] font-bold tracking-tighter",
                                product.applied_discount > 0
                                    ? "text-slate-400 line-through text-[10px]"
                                    : "text-slate-500",
                            )}
                        >
                            ${product.list_price || "0.00"}
                        </span>
                        {product.applied_discount > 0 && (
                            <span
                                className={cn(
                                    "text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5",
                                    product.discount_type === "specific"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-700",
                                )}
                            >
                                {product.applied_discount}% OFF
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-2 py-3 text-center text-[16px] font-black tracking-tight whitespace-nowrap text-slate-900">
                    ${product.your_price || product.list_price || "0.00"}
                </td>
                <td className="px-6 py-3">
                    <div className="flex items-center gap-3 justify-end">
                        <div className="flex items-center bg-slate-100/80 border border-slate-200/60 rounded-xl p-1 shadow-inner">
                            <button
                                onClick={() => onQuantityChange(product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm text-slate-400 hover:text-red-500 transition-all active:scale-90 disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-[14px] font-black text-slate-700">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onQuantityChange(product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-sm text-slate-400 hover:text-[#A80000] transition-all active:scale-90"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => onAddToCart(product.id)}
                            className={cn(
                                "h-11 px-5 rounded-xl text-white shadow-lg transition-all active:scale-90 flex items-center justify-center gap-2 font-bold text-sm",
                                product.in_cart
                                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                    : "bg-[#A80000] hover:bg-[#8B0000] shadow-[#A80000]/20",
                            )}
                        >
                            <ShoppingCart
                                size={18}
                                className={
                                    product.in_cart ? "fill-white" : "fill-none"
                                }
                            />
                            {product.in_cart ? "In Cart" : "Buy"}
                        </button>
                    </div>
                </td>
            </tr>
        );
    },
);

export default function Index() {
    const { products, filterOptions, filters } = usePage().props;

    // Memoize the models list based on selected make from static constants
    const staticModels = useMemo(() => {
        if (!filters.make || !MODELS[filters.make]) return [];
        return MODELS[filters.make];
    }, [filters.make]);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState(null);
    const [quantities, setQuantities] = useState(() =>
        Object.fromEntries(products.map((p) => [p.id, 1])),
    );

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = useCallback((product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const isSearchActive = useMemo(() => {
        return !!(
            filters.search ||
            filters.category ||
            filters.shop_view ||
            filters.sorting ||
            (filters.year_from && filters.make && filters.model)
        );
    }, [filters]);

    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setIsLoading(true);
                setLoadingType("search");
                router.get(
                    route("parts.index"),
                    { ...filters, search: value },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
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
            setIsLoading(true);
            setLoadingType("filter");
            router.get(
                route("parts.index"),
                { ...filters, [key]: value },
                {
                    preserveState: true,
                    preserveScroll: true,
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
            {
                product_id: productId,
                quantity: quantities[productId] || 1,
            },
            {
                preserveScroll: true,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
            },
        );
    };

    return (
        <>
            <Head title="Shop Parts" />
            <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
                <div className="max-w-9xl mx-auto">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Shop Parts
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
                            Independent Tiered Inventory Catalog
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col xl:flex-row gap-4 mb-8">
                        <SearchInput
                            initialValue={filters.search}
                            onSearch={debouncedSearch}
                            isLoading={isLoading && loadingType === "search"}
                        />
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <FilterDropdown
                                    label="Part Type"
                                    filterKey="category"
                                    icon={Tag}
                                    options={filterOptions?.part_types}
                                    currentValue={filters.category}
                                    onFilter={applyFilter}
                                />
                                <FilterDropdown
                                    label="Shop View"
                                    filterKey="shop_view"
                                    icon={Tag}
                                    options={filterOptions?.shop_views}
                                    currentValue={filters.shop_view}
                                    onFilter={applyFilter}
                                />
                                <FilterDropdown
                                    label="Sorting"
                                    filterKey="sorting"
                                    icon={Tag}
                                    options={filterOptions?.sortings}
                                    currentValue={filters.sorting}
                                    onFilter={applyFilter}
                                />
                                <FilterDropdown
                                    label="Year"
                                    filterKey="year_from"
                                    options={YEARS}
                                    currentValue={filters.year_from}
                                    onFilter={applyFilter}
                                />
                                <FilterDropdown
                                    label="Make"
                                    filterKey="make"
                                    options={MAKES}
                                    currentValue={filters.make}
                                    onFilter={applyFilter}
                                    isDisabled={!filters.year_from}
                                />
                                <FilterDropdown
                                    label="Model"
                                    filterKey="model"
                                    options={staticModels}
                                    currentValue={filters.model}
                                    onFilter={applyFilter}
                                    isDisabled={!filters.make}
                                />
                            </div>
                            {isSearchActive && (
                                <button
                                    onClick={clearAllFilters}
                                    className="h-12 px-4 rounded-2xl bg-white border border-slate-200 text-[11px] font-black text-[#A80000] hover:bg-red-50 transition-all shadow-sm flex items-center gap-2 uppercase"
                                >
                                    <XCircle size={14} /> Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden min-h-[500px] relative">
                        {isLoading && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#A80000]/10 overflow-hidden z-20">
                                <div className="h-full bg-[#A80000] animate-infinite-loading w-1/3 rounded-full" />
                            </div>
                        )}

                        <div className="overflow-x-auto overflow-y-visible">
                            <table className="w-full text-left min-w-[1100px] border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 text-[10px] md:text-[11px] font-black tracking-widest text-slate-400 border-b border-slate-100 uppercase">
                                        <th className="px-6 py-5 w-[260px]">
                                            Specifications
                                        </th>
                                        <th className="px-6 py-5">
                                            Item Description & Fitment
                                        </th>
                                        <th className="px-4 py-5 text-center w-[120px]">
                                            SKU
                                        </th>
                                        <th className="px-4 py-5 text-center w-[120px]">
                                            List Price
                                        </th>
                                        <th className="px-4 py-5 text-center w-[140px]">
                                            Your Price
                                        </th>
                                        <th className="px-6 py-5 w-[200px] text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={cn(
                                        "divide-y divide-slate-50 transition-all duration-300",
                                        isLoading &&
                                            "opacity-40 grayscale-[0.5]",
                                    )}
                                >
                                    {!isSearchActive ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="py-32 px-6 text-center"
                                            >
                                                <div className="max-w-md mx-auto space-y-4">
                                                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#A80000] mx-auto animate-pulse">
                                                        <Info size={40} />
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                                        Begin Your Search
                                                    </h3>
                                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                                        Select a category or
                                                        enter vehicle details
                                                        above to browse our
                                                        independent tiered
                                                        inventory system.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : products.length > 0 ? (
                                        products.map((product) => (
                                            <ProductRow
                                                key={product.id}
                                                product={product}
                                                quantity={
                                                    quantities[product.id] || 1
                                                }
                                                onToggleFavorite={
                                                    handleToggleFavorite
                                                }
                                                onQuantityChange={
                                                    handleQuantityChange
                                                }
                                                onAddToCart={handleAddToCart}
                                                onImageClick={handleOpenModal}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="py-32 px-6 text-center"
                                            >
                                                <div className="max-w-md mx-auto space-y-4">
                                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                                                        <Search size={40} />
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                                        No Results Found
                                                    </h3>
                                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                                        We couldn't find any
                                                        products matching your
                                                        current filters. Try
                                                        broadening your search
                                                        or clearing filters.
                                                    </p>
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

            <ProductDetailsModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onToggleFavorite={handleToggleFavorite}
            />
        </>
    );
}

Index.layout = (page) => <UserLayout children={page} />;
