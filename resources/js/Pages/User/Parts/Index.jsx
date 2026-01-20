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
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Skeleton } from "@/Components/ui/skeleton";
import { debounce } from "lodash";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const SearchInput = memo(({ initialValue, onSearch }) => {
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
        <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-3 text-red-500 w-5 h-5 pointer-events-none" />
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                placeholder="Search description or SKU"
                className="w-full pl-12 pr-12 py-3 rounded-full border-none shadow-sm focus:ring-2 focus:ring-orange-400 bg-white outline-none transition-all"
            />
            {localValue && (
                <button
                    onClick={() => {
                        setLocalValue("");
                        onSearch("");
                    }}
                    className="absolute right-4 top-3 text-gray-400 hover:text-red-500"
                >
                    <XCircle className="w-5 h-5" />
                </button>
            )}
        </div>
    );
});

const FilterDropdown = memo(
    ({ label, filterKey, options, currentValue, onFilter }) => {
        return (
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="bg-white px-5 py-3 rounded-full shadow-sm flex items-center gap-3 min-w-[140px] justify-between border-none hover:bg-gray-50 outline-none transition-all active:scale-95 focus:ring-0">
                    <span className="text-sm font-semibold truncate max-w-[100px]">
                        {currentValue || label}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className="min-w-max w-[var(--radix-dropdown-menu-trigger-width)] bg-white border rounded-xl shadow-lg max-h-80 overflow-y-auto z-[100]"
                    align="start"
                >
                    <DropdownMenuItem
                        className="font-bold text-red-500 focus:bg-red-50 cursor-pointer"
                        onClick={() => onFilter(filterKey, "")}
                    >
                        All {label}s
                    </DropdownMenuItem>
                    {options.map((opt) => (
                        <DropdownMenuItem
                            key={opt}
                            onClick={() => onFilter(filterKey, opt)}
                            className="focus:bg-gray-50 cursor-pointer"
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
    }) => {
        const firstImage = product.files?.[0] || null;

        // Dynamic Badge Styling based on Category Name
        const categoryName = product.sub_category?.name?.toUpperCase() || "";
        const isOEM = categoryName.includes("OEM");
        const isAftermarket = categoryName.includes("AFTERMARKET");

        const badgeColors = isOEM
            ? "bg-[#EEF2FF] text-[#6366F1]" // Indigo/Purple for OEM
            : isAftermarket
              ? "bg-[#E0F7FA] text-[#006064]" // Cyan/Dark Green for Aftermarket
              : "bg-slate-100 text-slate-600"; // Default

        return (
            <tr
                className={cn(
                    styles.rowHover,
                    styles.accent,
                    "transition-all group odd:bg-white even:bg-slate-50 h-[80px]",
                )}
            >
                <td className="py-2">
                    <div className="flex gap-3 items-center ms-3">
                        {/* Separate Badge - "Pill" Design */}
                        <div
                            className={cn(
                                "h-14 w-7 flex items-center justify-center rounded-full shrink-0 transition-colors",
                                badgeColors,
                            )}
                        >
                            <span className="text-[8px] font-black [writing-mode:vertical-lr] rotate-180 tracking-tighter">
                                {product.sub_category?.name || "PART"}
                            </span>
                        </div>

                        {/* Product Image Container */}
                        <div className="w-24 h-14 rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                            {firstImage ? (
                                <img
                                    src={`/${firstImage.file_path}`}
                                    alt={product.description}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <ImageOff className="w-5 h-5 text-slate-300" />
                            )}
                        </div>

                        {/* Favorite Star */}
                        <div
                            onClick={() => onToggleFavorite(product.id)}
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors shrink-0 ms-1",
                                product.is_favorite
                                    ? "bg-orange-100"
                                    : "bg-gray-50 hover:bg-orange-50",
                            )}
                        >
                            <Star
                                className={cn(
                                    "w-4 h-4 transition-all",
                                    product.is_favorite
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300",
                                )}
                            />
                        </div>
                    </div>
                </td>
                <td className="px-6 py-2">
                    <h4 className="font-bold text-slate-800 text-[13px] line-clamp-1">
                        {product.description}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">
                        {product.fitments?.[0]
                            ? `${product.fitments[0].year_from}-${product.fitments[0].year_to} ${product.fitments[0].make} ${product.fitments[0].model}`
                            : "General Fitment"}
                    </p>
                </td>
                <td className="px-2 py-2 text-sm font-semibold text-center">
                    {product.location_id || "—"}
                </td>
                <td className="px-2 py-2 text-sm font-semibold text-center">
                    {product.sku || "—"}
                </td>
                <td className="px-2 py-2 text-center font-bold text-gray-400 text-xs">
                    ${product.buy_price || "0.00"}
                </td>
                <td className="px-2 py-2 text-center font-bold text-slate-900">
                    ${product.list_price || "0.00"}
                </td>
                <td className="px-6 py-2">
                    <div className="flex items-center gap-2 justify-end">
                        <div className="flex items-center bg-gray-50 border rounded-lg p-0.5">
                            <button
                                onClick={() => onQuantityChange(product.id, -1)}
                                className="w-7 h-7 flex items-center justify-center bg-white rounded border shadow-sm text-gray-400 hover:text-red-500"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-[12px] font-black">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onQuantityChange(product.id, 1)}
                                className="w-7 h-7 flex items-center justify-center bg-white rounded border shadow-sm text-gray-400 hover:text-emerald-600"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <button
                            onClick={() => onAddToCart(product.id)}
                            className={cn(
                                "p-2.5 rounded-xl text-white shadow-sm transition-all active:scale-90",
                                product.in_cart
                                    ? "bg-emerald-500 hover:bg-[#229A16]"
                                    : "bg-amber-400 hover:bg-emerald-500",
                            )}
                        >
                            <ShoppingCart className="w-4 h-4 fill-currentColor" />
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
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [quantities, setQuantities] = useState(() =>
        Object.fromEntries(products.map((p) => [p.id, 1])),
    );

    useEffect(() => {
        let timer;
        if (isLoading) {
            setShowSkeleton(true);
        } else {
            timer = setTimeout(() => setShowSkeleton(false), 800);
        }
        return () => clearTimeout(timer);
    }, [isLoading]);

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(
            ([key, value]) =>
                value !== null && value !== "" && value !== undefined,
        );
    }, [filters]);

    const debouncedSearch = useMemo(
        () =>
            debounce((value) => {
                setIsLoading(true);
                router.get(
                    route("parts.index"),
                    { ...filters, search: value },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                        onFinish: () => setIsLoading(false),
                    },
                );
            }, 500),
        [filters],
    );

    const applyFilter = useCallback(
        (key, value) => {
            if (filters[key] === value) return;
            setIsLoading(true);
            router.get(
                route("parts.index"),
                { ...filters, [key]: value },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsLoading(false),
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
            { preserveScroll: true },
        );
    };

    const handleAddToCart = (productId) => {
        router.post(
            route("parts.to-cart"),
            { product_id: productId, quantity: quantities[productId] || 1 },
            { preserveScroll: true },
        );
    };

    const getSubCategoryStyles = (subCatName) => {
        const name = subCatName?.toUpperCase() || "";
        if (name.includes("OEM"))
            return {
                rowHover: "hover:bg-indigo-50/30",
                accent: "border-l-4 border-l-indigo-400",
            };
        if (name.includes("AFTERMARKET"))
            return {
                rowHover: "hover:bg-cyan-50/30",
                accent: "border-l-4 border-l-cyan-400",
            };
        return {
            rowHover: "hover:bg-slate-50",
            accent: "border-l-4 border-l-slate-200",
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
            {
                label: "Location",
                key: "location",
                options: filterOptions?.locations || [],
            },
        ],
        [categories, filterOptions],
    );

    return (
        <UserLayout user={auth.user}>
            <Head title="Parts Dashboard" />
            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen font-sans">
                {/* Filter Bar */}
                <div className="flex flex-wrap gap-3 mb-8 items-center">
                    <SearchInput
                        initialValue={filters.search}
                        onSearch={debouncedSearch}
                    />
                    {filterConfigs.map((f) => (
                        <FilterDropdown
                            key={f.key}
                            label={f.label}
                            filterKey={f.key}
                            options={f.options}
                            currentValue={filters[f.key]}
                            onFilter={applyFilter}
                        />
                    ))}
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm border border-red-100 transition-all active:scale-95"
                        >
                            <XCircle className="w-4 h-4" /> Clear
                        </button>
                    )}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto h-auto transition-all duration-300">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-[#FFF8F8] text-[11px] uppercase tracking-wider text-gray-500 border-b">
                                    <th className="px-6 py-4 font-bold w-[240px]">
                                        Image
                                    </th>
                                    <th className="px-6 py-4 font-bold">
                                        Description & Fitment
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center w-[120px]">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center w-[120px]">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center w-[100px]">
                                        List Price
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center w-[100px]">
                                        Your Price
                                    </th>
                                    <th className="px-6 py-4 w-[150px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {showSkeleton ? (
                                    Array.from({
                                        length: Math.max(products.length, 5),
                                    }).map((_, index) => (
                                        <tr
                                            key={index}
                                            className="odd:bg-white even:bg-slate-50 h-[80px]"
                                        >
                                            <td className="py-2 px-6">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="w-6 h-14 rounded-full" />
                                                    <Skeleton className="w-24 h-14 rounded-2xl" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <Skeleton className="h-4 w-3/4 rounded mb-2" />
                                                <Skeleton className="h-3 w-1/2 rounded" />
                                            </td>
                                            <td className="px-6 py-2">
                                                <Skeleton className="h-4 w-10 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-2">
                                                <Skeleton className="h-4 w-12 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-2">
                                                <Skeleton className="h-4 w-12 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-2">
                                                <Skeleton className="h-4 w-12 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-2">
                                                <Skeleton className="w-24 h-9 rounded ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            quantity={
                                                quantities[product.id] || 1
                                            }
                                            styles={getSubCategoryStyles(
                                                product.sub_category?.name,
                                            )}
                                            onToggleFavorite={
                                                handleToggleFavorite
                                            }
                                            onQuantityChange={
                                                handleQuantityChange
                                            }
                                            onAddToCart={handleAddToCart}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-32 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Search className="w-12 h-12 text-gray-200" />
                                                <p className="text-gray-400 font-medium">
                                                    No products found.
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
        </UserLayout>
    );
}
