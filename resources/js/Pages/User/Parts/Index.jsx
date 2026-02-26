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

import { YEARS } from "@/Constants/years";
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
                placeholder="Search description or SKU..."
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

const ProductCard = memo(
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
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group relative animate-in fade-in duration-500">
                <div className="flex gap-4">
                    {/* Image & Tags */}
                    <div className="relative shrink-0">
                        <div
                            onClick={() => onImageClick(product)}
                            className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                            {firstImage ? (
                                <img
                                    src={`/${firstImage.file_path}`}
                                    alt={product.description}
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <ImageOff className="w-8 h-8 text-slate-200" />
                            )}
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <button
                                onClick={() => onToggleFavorite(product.id)}
                                className={cn(
                                    "w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90",
                                    product.is_favorite
                                        ? "bg-amber-50"
                                        : "bg-white",
                                )}
                            >
                                <Star
                                    size={14}
                                    className={cn(
                                        product.is_favorite
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-slate-300",
                                    )}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span
                                className={cn(
                                    "text-[7px] font-black py-0.5 px-2 rounded-full uppercase tracking-widest text-white",
                                    product.shop_view?.name?.includes("OEM")
                                        ? "bg-[#2563EB]"
                                        : "bg-[#0891B2]",
                                )}
                            >
                                {product.shop_view?.name || "STOCK"}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight tracking-tight mb-2 line-clamp-2 uppercase">
                            {product.description}
                        </h4>
                        {/* Fitments */}
                        {product.fitments?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {product.fitments
                                    .slice(0, 2)
                                    .map((fit, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter"
                                        >
                                            {String(fit.year_from) ===
                                            String(fit.year_to)
                                                ? fit.year_from
                                                : `${fit.year_from}-${fit.year_to}`}{" "}
                                            {fit.make} {fit.model}
                                        </span>
                                    ))}
                                {product.fitments.length > 2 && (
                                    <span className="text-[9px] font-black text-slate-400 self-center">
                                        +{product.fitments.length - 2}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                            SKU:{" "}
                            <span className="text-slate-600">
                                {product.sku || "N/A"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prices & Actions */}
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                            List/Your
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                                ${product.list_price}
                            </span>
                            <span className="text-sm font-black text-slate-900 tracking-tight">
                                ${product.your_price || product.list_price}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1">
                            <button
                                onClick={() => onQuantityChange(product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400 disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-700">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onQuantityChange(product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-100 shadow-sm text-slate-400"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                        <button
                            onClick={() => onAddToCart(product.id)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-white shadow-xl flex items-center justify-center gap-2 font-bold text-xs uppercase transition-all active:scale-95 whitespace-nowrap min-w-[100px]",
                                product.in_cart
                                    ? "bg-emerald-500"
                                    : "bg-[#A80000]",
                            )}
                        >
                            <ShoppingCart size={14} />
                            {product.in_cart ? "In Cart" : "Buy Now"}
                        </button>
                    </div>
                </div>
            </div>
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
            <tr className="transition-all group odd:bg-white even:bg-slate-50/30 border-b border-slate-100/60 hover:bg-white">
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
                        <h4 className="font-bold text-slate-800 text-[14px] leading-tight tracking-tight whitespace-normal uppercase mb-1">
                            {product.description}
                        </h4>
                        {product.fitments?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {product.fitments
                                    .slice(0, 3)
                                    .map((fit, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200/60 uppercase tracking-tighter shadow-sm"
                                        >
                                            <span className="underline decoration-slate-300">
                                                {String(fit.year_from) ===
                                                String(fit.year_to)
                                                    ? fit.year_from
                                                    : `${fit.year_from}-${fit.year_to}`}
                                            </span>
                                            <span className="mx-1"></span>
                                            <span className="underline decoration-slate-300">
                                                {fit.make}
                                            </span>
                                            <span className="mx-1"></span>
                                            <span className="underline decoration-slate-300">
                                                {fit.model}
                                            </span>
                                        </span>
                                    ))}
                                {product.fitments.length > 3 && (
                                    <span className="text-[10px] font-black text-slate-400 self-center">
                                        +{product.fitments.length - 3} MORE
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </td>

                <td className="px-2 py-3 text-[12px] font-mono font-bold text-slate-400 text-center group-hover:text-slate-900 transition-colors whitespace-nowrap">
                    {product.sku || <span className="text-slate-200">—</span>}
                </td>
                <td className="px-2 py-3 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                        <span className="text-[16px] font-bold tracking-tighter text-slate-900">
                            ${product.list_price || "0.00"}
                        </span>
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
                                "h-11 px-5 rounded-xl text-white shadow-lg transition-all active:scale-90 flex items-center justify-center gap-2 font-bold text-sm whitespace-nowrap min-w-[120px]",
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
                            {product.in_cart ? "In Cart" : "Buy Now"}
                        </button>
                    </div>
                </td>
            </tr>
        );
    },
);

const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="max-w-md mx-auto space-y-4 py-20 px-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[#A80000] mx-auto opacity-80 backdrop-blur-sm">
            <Icon size={36} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {title}
        </h3>
        <p className="text-slate-400 text-base font-medium leading-relaxed">
            {message}
        </p>
    </div>
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

    // Sync selected productive with updated products list to ensure favorite status is reflected
    useEffect(() => {
        if (selectedProduct && products) {
            const updated = products.find((p) => p.id === selectedProduct.id);
            if (updated) {
                setSelectedProduct(updated);
            }
        }
    }, [products, selectedProduct?.id]);

    const isSearchActive = useMemo(() => {
        return !!(
            filters.search ||
            (filters.year_from && filters.make && filters.model) ||
            filters.category
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

            let newParams = { ...filters, [key]: value };

            // Requirement: whenever customer chooses a new Year, Make or Model, the screen should reset
            if (["year_from", "make", "model"].includes(key)) {
                // If we're setting a vehicle param, clear the other non-vehicle filters
                newParams = {
                    year_from: newParams.year_from,
                    make: newParams.make,
                    model: newParams.model,
                };

                // Specific reset logic for vehicle hierarchy
                if (key === "year_from") {
                    delete newParams.make;
                    delete newParams.model;
                } else if (key === "make") {
                    delete newParams.model;
                }
            }

            router.get(route("parts.index"), newParams, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setIsLoading(false);
                    setLoadingType(null);
                },
            });
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
                    <div className="mb-6 md:mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Shop Parts
                        </h1>
                        <p className="text-slate-500 mt-2 md:mt-3 text-sm md:text-lg font-medium max-w-2xl mx-auto md:mx-0">
                            Browse and order thousands of high-quality auto
                            parts for your vehicle.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="sticky top-0 z-40 -mx-4 px-4 py-4 mb-8 bg-[#F8FAFC]/80 backdrop-blur-xl xl:static xl:bg-transparent xl:backdrop-blur-none xl:p-0 xl:mb-12">
                        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 md:gap-6">
                            <div className="w-full xl:w-auto">
                                <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                                    <div className="grid grid-cols-2 md:contents gap-2 w-full">
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
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:contents gap-2 w-full">
                                        <FilterDropdown
                                            label="Model"
                                            filterKey="model"
                                            options={staticModels}
                                            currentValue={filters.model}
                                            onFilter={applyFilter}
                                            isDisabled={!filters.make}
                                        />
                                        <FilterDropdown
                                            label="Category"
                                            filterKey="category"
                                            options={filterOptions?.part_types}
                                            currentValue={filters.category}
                                            onFilter={applyFilter}
                                            isDisabled={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full xl:max-w-md shrink-0">
                                <SearchInput
                                    initialValue={filters.search}
                                    onSearch={debouncedSearch}
                                    isLoading={
                                        isLoading && loadingType === "search"
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Results View */}
                    <div
                        className={cn(
                            "relative bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden",
                            !isSearchActive &&
                                "bg-slate-50/20 shadow-none border-dashed border-slate-200",
                        )}
                    >
                        {isLoading && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#A80000]/10 overflow-hidden z-20">
                                <div className="h-full bg-[#A80000] animate-infinite-loading w-1/3 rounded-full" />
                            </div>
                        )}

                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden xl:block overflow-x-auto">
                            <table className="w-full text-left min-w-[1240px] border-collapse bg-white">
                                <thead>
                                    <tr className="bg-white text-[11px] font-bold tracking-tight text-slate-400 border-b border-slate-50 uppercase leading-none">
                                        <th className="px-8 py-6 w-[280px]">
                                            Item View
                                        </th>
                                        <th className="px-8 py-6">
                                            Product Description
                                        </th>
                                        <th className="px-4 py-6 text-center w-[120px]">
                                            SKU
                                        </th>
                                        <th className="px-4 py-6 text-center w-[120px]">
                                            List Price
                                        </th>
                                        <th className="px-4 py-6 text-center w-[120px]">
                                            Your Price
                                        </th>
                                        <th className="px-8 py-6 w-[250px] text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={cn(
                                        "divide-y divide-slate-50/50",
                                        isLoading && "opacity-40",
                                    )}
                                >
                                    {!isSearchActive ? (
                                        <tr>
                                            <td colSpan="6">
                                                <EmptyState
                                                    icon={Info}
                                                    title="Search for Parts"
                                                    message={
                                                        <>
                                                            Please enter a
                                                            search term or
                                                            select{" "}
                                                            <strong>
                                                                Vehicle (Year,
                                                                Make, Model)
                                                            </strong>{" "}
                                                            or a{" "}
                                                            <strong>
                                                                Category
                                                            </strong>{" "}
                                                            to view specific
                                                            products.
                                                        </>
                                                    }
                                                />
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
                                            <td colSpan="6">
                                                <EmptyState
                                                    icon={Search}
                                                    title="No Results Found"
                                                    message="We couldn't find any products matching your current filters."
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="xl:hidden p-4">
                            {!isSearchActive ? (
                                <EmptyState
                                    icon={Info}
                                    title="Search for Parts"
                                    message={
                                        <>
                                            Please enter a search term or select{" "}
                                            <strong>
                                                Vehicle (Year, Make, Model)
                                            </strong>{" "}
                                            or a <strong>Category</strong> to
                                            view products.
                                        </>
                                    }
                                />
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {products.map((product) => (
                                        <ProductCard
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
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Search}
                                    title="No Results Found"
                                    message="Try broadening your search."
                                />
                            )}
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
