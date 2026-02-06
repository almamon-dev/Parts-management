import React, { useState, useEffect, useCallback, memo } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import { Skeleton } from "@/Components/ui/Skeleton";
import {
    ShoppingCart,
    Plus,
    Minus,
    ImageOff,
    HeartOff,
    ArrowLeft,
    Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const FavoriteCard = memo(
    ({ fav, quantity, onQuantityChange, onAddToCart, onDelete }) => {
        const product = fav.product;
        const firstImage = product.files?.[0];

        return (
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 group relative">
                {/* Remove Button - Top Right */}
                <button
                    onClick={() => onDelete(fav.id)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-slate-100"
                    title="Remove item"
                >
                    <Trash2 size={16} />
                </button>

                {/* Image Container */}
                <div className="relative h-[220px] w-full overflow-hidden bg-slate-50/50 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center p-6">
                        {firstImage ? (
                            <img
                                src={`/${firstImage.file_path}`}
                                alt={product.description}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-200">
                                <ImageOff size={48} strokeWidth={1} />
                                <span className="text-[10px] font-black  tracking-widest opacity-50">
                                    No Preview
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-[#AD0100]  tracking-tighter bg-red-50 px-2.5 py-1 rounded">
                                SKU: {product.sku || "N/A"}
                            </span>
                            {product.part_type && (
                                <span className="text-[10px] font-bold text-slate-400  tracking-tight">
                                    {product.part_type.name}
                                </span>
                            )}
                        </div>

                        {/* Fitment Details */}
                        <p className="text-[11px] font-bold text-slate-500 tracking-tight mb-3 ">
                            {product.fitments?.[0]
                                ? `${product.fitments[0].year_from}-${product.fitments[0].year_to} ${product.fitments[0].make} ${product.fitments[0].model}`
                                : "General Fitment"}
                        </p>

                        {/* FULL DESCRIPTION - No line clamping used here to satisfy user requirement */}
                        <h3 className="text-[15px] font-bold text-slate-900 tracking-tight leading-snug  mb-4">
                            {product.description}
                        </h3>
                    </div>

                    {/* Pricing & Actions Section */}
                    <div className="mt-auto space-y-5">
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400  tracking-widest leading-none">
                                    List Price
                                </span>
                                <span className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">
                                    ${product.list_price || "0.00"}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-right">
                                <span className="text-[10px] font-black text-[#AD0100]  tracking-widest leading-none">
                                    Your Price
                                </span>
                                <span className="text-[17px] font-black text-[#AD0100] tracking-tight leading-none">
                                    $
                                    {product.your_price ||
                                        product.list_price ||
                                        "0.00"}
                                </span>
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl h-11 overflow-hidden shadow-sm">
                                <button
                                    onClick={() =>
                                        onQuantityChange(product.id, -1)
                                    }
                                    className="w-10 h-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="flex-1 text-center text-sm font-black text-slate-800">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        onQuantityChange(product.id, 1)
                                    }
                                    className="w-10 h-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={() =>
                                    onAddToCart(product.id, quantity)
                                }
                                className="h-11 px-6 bg-[#A80000] hover:bg-[#8B0000] text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/10 transition-all active:scale-95 whitespace-nowrap min-w-[120px]"
                            >
                                <ShoppingCart size={18} />
                                <span className="font-bold text-xs ">
                                    Buy Now
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

/**
 * Skeleton Loader Card
 */
const SkeletonCard = () => (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[450px] p-0 animate-pulse">
        <div className="h-[220px] bg-slate-100 w-full" />
        <div className="p-5 flex-1 flex flex-col gap-4">
            <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-50 rounded w-1/2" />
                <div className="h-10 bg-slate-50 rounded w-full mt-2" />
            </div>
            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-2 bg-slate-50 rounded w-10" />
                    <div className="h-4 bg-slate-100 rounded w-16" />
                </div>
                <div className="space-y-2 text-right">
                    <div className="h-2 bg-slate-50 rounded w-10 ml-auto" />
                    <div className="h-4 bg-slate-100 rounded w-16 ml-auto" />
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <div className="h-11 bg-slate-50 rounded-xl flex-1" />
                <div className="h-11 bg-slate-100 rounded-xl w-32" />
            </div>
        </div>
    </div>
);

export default function Index() {
    const { favourites } = usePage().props;
    const [isLoading, setIsLoading] = useState(favourites.data?.length > 0);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        if (favourites.data?.length === 0) {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [favourites.data?.length]);

    const handleQuantityChange = useCallback((id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta),
        }));
    }, []);

    const handleAddToCart = (productId, qty) => {
        router.post(
            route("parts.to-cart"),
            {
                product_id: productId,
                quantity: qty,
            },
            { preserveScroll: true },
        );
    };

    const handleDelete = (favId) => {
        Swal.fire({
            title: "Remove from Favorites?",
            text: "This item will be removed from your saved list.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#A80000",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, remove it!",
            customClass: {
                popup: "rounded-[24px]",
                confirmButton: "rounded-full px-8 py-3 font-bold",
                cancelButton: "rounded-full px-8 py-3 font-bold",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("favourites.destroy", favId), {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <>
            <Head title="My Favorites" />
            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-[1600px] mx-auto">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            My Favorites
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm md:text-lg font-medium max-w-2xl mx-auto md:mx-0">
                            Manage your saved parts and add them to cart easily.
                        </p>
                    </div>

                    {!isLoading && favourites.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-white rounded-[32px] border border-dashed border-slate-200 p-12">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
                                <HeartOff className="w-12 h-12 text-[#AD0100] opacity-30" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-3">
                                Favorites List Empty
                            </h2>
                            <p className="text-slate-500 text-lg max-w-sm mb-10 font-medium leading-relaxed">
                                Explore our premium parts inventory and save
                                your favorites here.
                            </p>
                            <Link
                                href={route("parts.index")}
                                className="inline-flex items-center gap-3 bg-[#AD0100] text-white px-10 py-4 rounded-full font-black text-xs  tracking-widest shadow-xl shadow-red-900/10 transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Return to Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {isLoading
                                ? Array(8)
                                      .fill(0)
                                      .map((_, i) => <SkeletonCard key={i} />)
                                : favourites.data.map((fav) => (
                                      <FavoriteCard
                                          key={fav.id}
                                          fav={fav}
                                          quantity={
                                              quantities[fav.product.id] || 1
                                          }
                                          onQuantityChange={
                                              handleQuantityChange
                                          }
                                          onAddToCart={handleAddToCart}
                                          onDelete={handleDelete}
                                      />
                                  ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <UserLayout children={page} />;
