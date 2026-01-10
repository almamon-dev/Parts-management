import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
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

// --- Utility for tailwind class merging ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function Index() {
    const { auth, products, categories, filters, filterOptions } =
        usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [isLoading, setIsLoading] = useState(false);

    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (key === "page") return false;
        return value !== null && value !== "" && value !== undefined;
    });

    const handleAddToCart = (productId) => {
        const qty = quantities[productId] || 1;

        router.post(
            route("parts.to-cart"),
            {
                product_id: productId,
                quantity: qty,
            },
            {
                preserveScroll: true,
                onSuccess: () => {},
                onError: (errors) => {},
            }
        );
    };

    // Initial quantities load hobar somoy protiti product-er default 1 set kora
    const [quantities, setQuantities] = useState(
        Object.fromEntries(products.data.map((p) => [p.id, 1]))
    );

    // Quantity change korar function
    const handleQuantityChange = (id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta), // Minimum 1 thakbe
        }));
    };

    const applyFilter = (key, value) => {
        if (filters[key] === value) return;

        setIsLoading(true);
        const startTime = Date.now();

        router.get(
            route("parts.index"),
            { ...filters, [key]: value, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => {
                    const duration = Date.now() - startTime;
                    const minWait = 800;
                    setTimeout(
                        () => setIsLoading(false),
                        Math.max(0, minWait - duration)
                    );
                },
            }
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || "")) {
                applyFilter("search", search);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [search]);

    const clearAllFilters = () => {
        setIsLoading(true);
        setSearch("");
        router.get(
            route("parts.index"),
            {},
            {
                preserveState: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const getSubCategoryStyles = (subCatName) => {
        const name = subCatName?.toUpperCase() || "";
        if (name.includes("ENGINE"))
            return {
                badge: "bg-red-100 text-red-700 border-red-200",
                rowHover: "hover:bg-red-50/30",
            };
        if (name.includes("BRAKE"))
            return {
                badge: "bg-orange-100 text-orange-700 border-orange-200",
                rowHover: "hover:bg-orange-50/30",
            };
        if (name.includes("BODY"))
            return {
                badge: "bg-blue-100 text-blue-700 border-blue-200",
                rowHover: "hover:bg-blue-50/30",
            };
        return {
            badge: "bg-slate-100 text-slate-700 border-slate-200",
            rowHover: "hover:bg-slate-50/50",
        };
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="Parts Dashboard" />
            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen font-sans text-[#4B5563]">
                {/* --- Header Filter Bar --- */}
                <div className="flex flex-wrap gap-3 mb-8 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-3 text-red-500 w-5 h-5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by category, description or SKU"
                            className="w-full pl-12 pr-12 py-3 rounded-full border-none shadow-sm focus:ring-1 focus:ring-orange-400 outline-none bg-white transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    applyFilter("search", "");
                                }}
                                className="absolute right-4 top-3 text-gray-400 hover:text-red-500"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {[
                        {
                            label: "Category",
                            key: "category",
                            options: categories.map((c) => c.name),
                        },
                        {
                            label: "Year",
                            key: "year_from",
                            options: filterOptions.years,
                        },
                        {
                            label: "Make",
                            key: "make",
                            options: filterOptions.makes,
                        },
                        {
                            label: "Model",
                            key: "model",
                            options: filterOptions.models,
                        },
                        {
                            label: "Location",
                            key: "location",
                            options: filterOptions.locations,
                        },
                    ].map((f) => (
                        <DropdownMenu key={f.key}>
                            <DropdownMenuTrigger className="bg-white px-5 py-3 rounded-full shadow-sm flex items-center gap-3 min-w-[120px] justify-between border-none outline-none hover:bg-gray-50 transition-all">
                                <span className="text-sm font-semibold truncate">
                                    {filters[f.key] || f.label}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white border rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                                <DropdownMenuItem
                                    className="font-bold text-red-500"
                                    onClick={() => applyFilter(f.key, "")}
                                >
                                    All {f.label}s
                                </DropdownMenuItem>
                                {f.options.map((opt) => (
                                    <DropdownMenuItem
                                        key={opt}
                                        onClick={() => applyFilter(f.key, opt)}
                                    >
                                        {opt}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ))}

                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-all border border-red-100 shadow-sm active:scale-95"
                        >
                            <XCircle className="w-4 h-4" /> Clear
                        </button>
                    )}
                </div>

                {/* --- Parts Table Section --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto transition-all duration-300">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FFF8F8] text-[11px] uppercase tracking-wider text-gray-500 border-b">
                                    <th className="px-6 py-4 font-bold">
                                        Image
                                    </th>
                                    <th className="px-6 py-4 font-bold">
                                        Description & Fitment
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center">
                                        List Price
                                    </th>
                                    <th className="px-6 py-4 font-bold text-center">
                                        Your Price
                                    </th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    /* DYNAMIC SKELETON ROWS */
                                    (products.data.length > 0
                                        ? products.data
                                        : Array(6).fill(0)
                                    ).map((_, index) => (
                                        <tr
                                            key={index}
                                            className="animate-pulse border-b border-gray-50"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4 ms-3">
                                                    <Skeleton className="w-4 h-14 rounded" />
                                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                                    <Skeleton className="w-8 h-8 rounded-full" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-56 rounded" />
                                                    <Skeleton className="h-3 w-32 rounded" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Skeleton className="h-4 w-10 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Skeleton className="h-4 w-20 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Skeleton className="h-4 w-16 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Skeleton className="h-4 w-16 mx-auto rounded" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Skeleton className="w-20 h-8 rounded" />
                                                    <Skeleton className="w-9 h-9 rounded" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : products.data.length > 0 ? (
                                    products.data.map((product) => {
                                        const styles = getSubCategoryStyles(
                                            product.sub_category?.name
                                        );
                                        const firstImage =
                                            product.files?.[0] || null;

                                        return (
                                            <tr
                                                key={product.id}
                                                className={cn(
                                                    styles.rowHover,
                                                    "transition-all group"
                                                )}
                                            >
                                                <td className="py-2">
                                                    <div className="flex gap-4 items-center ms-3">
                                                        <div className="relative w-4 h-16 flex items-center justify-center overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "absolute inset-0 flex items-center justify-center border-r rounded-l-md",
                                                                    styles.badge
                                                                )}
                                                            >
                                                                <span className="text-[7px] font-black [writing-mode:vertical-lr] rotate-180 uppercase tracking-tighter">
                                                                    {product
                                                                        .sub_category
                                                                        ?.name ||
                                                                        "PART"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border flex items-center justify-center shrink-0">
                                                            {firstImage ? (
                                                                <img
                                                                    src={`/${firstImage.file_path}`}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                                />
                                                            ) : (
                                                                <ImageOff className="w-5 h-5 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <div
                                                            onClick={() =>
                                                                router.post(
                                                                    route(
                                                                        "parts.favourite"
                                                                    ),
                                                                    {
                                                                        product_id:
                                                                            product.id,
                                                                    },
                                                                    {
                                                                        preserveScroll: true,
                                                                    }
                                                                )
                                                            }
                                                            className={cn(
                                                                "flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors",
                                                                product.is_favorite
                                                                    ? "bg-orange-100"
                                                                    : "bg-gray-50 hover:bg-orange-50"
                                                            )}
                                                        >
                                                            <Star
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    product.is_favorite
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-gray-300"
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
                                                <td className="px-2 py-2 text-xs font-mono text-center">
                                                    {product.sku}
                                                </td>
                                                <td className="px-2 py-2 text-center font-bold text-gray-400 text-xs">
                                                    $
                                                    {product.buy_price ||
                                                        "0.00"}
                                                </td>
                                                <td className="px-2 py-2 text-center font-bold text-slate-900">
                                                    $
                                                    {product.list_price ||
                                                        "0.00"}
                                                </td>
                                                <td className="px-6 py-2">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-lg p-0.5 shadow-sm group-hover:border-orange-200 transition-all duration-300">
                                                            <button
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        product.id,
                                                                        -1
                                                                    )
                                                                }
                                                                className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-transparent shadow-sm text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all active:scale-90"
                                                                title="Decrease quantity"
                                                            >
                                                                <Minus className="w-3 h-3 stroke-[3px]" />
                                                            </button>

                                                            <span className="w-8 text-center text-[12px] font-black text-slate-700 tabular-nums">
                                                                {quantities[
                                                                    product.id
                                                                ] || 1}
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        product.id,
                                                                        1
                                                                    )
                                                                }
                                                                className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-transparent shadow-sm text-gray-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all active:scale-90"
                                                                title="Increase quantity"
                                                            >
                                                                <Plus className="w-3 h-3 stroke-[3px]" />
                                                            </button>
                                                        </div>

                                                        {/* Updated Add to Cart Button */}
                                                        <button
                                                            onClick={() =>
                                                                handleAddToCart(
                                                                    product.id
                                                                )
                                                            }
                                                            className="bg-amber-400 p-2.5 rounded-xl text-white hover:bg-amber-500 shadow-sm active:scale-90 transition-all group/cart"
                                                        >
                                                            <ShoppingCart
                                                                className="w-4 h-4 group-hover/cart:rotate-[-12deg] transition-transform"
                                                                fill="currentColor"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-32 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Search className="w-12 h-12 text-gray-200" />
                                                <p className="text-gray-400 font-medium">
                                                    No products match your
                                                    search results.
                                                </p>
                                                <button
                                                    onClick={clearAllFilters}
                                                    className="text-red-500 text-sm font-bold hover:underline"
                                                >
                                                    Reset Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Only show pagination when not loading and data exists */}
                    {!isLoading && products.data.length > 0 && (
                        <div>
                            <Pagination meta={products} />
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
