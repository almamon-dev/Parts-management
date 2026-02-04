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

/**
 * Optimized Favorite Card Component
 */
const FavoriteCard = memo(({ fav, quantity, onQuantityChange, onAddToCart, onDelete }) => {
    const product = fav.product;
    const firstImage = product.files?.[0];

    return (
        <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
            {/* Image Container - Reduced Height */}
            <div className="relative h-[180px] w-full overflow-hidden bg-slate-50/50">
                <div className="absolute top-2.5 left-2.5 z-10">
                    <div className="bg-white/90 backdrop-blur-sm shadow-sm text-slate-900 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-100 flex items-center gap-1.5">
                        <span className="text-[#AD0100]">{product.partType?.name || "Premium"}</span>
                        {product.shopView && (
                            <>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-slate-500">{product.shopView?.name}</span>
                            </>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={() => onDelete(fav.id)}
                    className="absolute top-2.5 right-2.5 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-red-500 hover:bg-red-50 hover:text-[#AD0100] transition-all active:scale-90 border border-slate-100"
                >
                    <Trash2 size={16} strokeWidth={2.5} />
                </button>

                <div className="w-full h-full flex items-center justify-center p-4">
                    {firstImage ? (
                        <img
                            src={`/${firstImage.file_path}`}
                            alt={product.description}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-200">
                            <ImageOff size={32} strokeWidth={1.5} />
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-50">No Preview</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Container - Compact Padding */}
            <div className="p-4 flex-1 flex flex-col">  
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#AD0100] uppercase tracking-tighter bg-red-50 px-2 py-0.5 rounded">SKU</span>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight line-clamp-1">
                            {product.sku || "N/A"}
                        </h3>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 tracking-tight mb-2 line-clamp-1">
                        {product.fitments?.[0]
                            ? `${product.fitments[0].year_from}-${product.fitments[0].year_to} ${product.fitments[0].make} ${product.fitments[0].model}`
                            : "General Fitment"}
                    </p>
                    <p className="text-slate-400 text-[12px] leading-tight line-clamp-2 font-medium">
                        {product.description}
                    </p>
                </div>

                {/* Footer Section - High Density */}
                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between gap-3">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter leading-none mb-1">MSRP</span>
                            <span className="text-[14px] font-bold text-slate-300 line-through tracking-tight leading-none">
                                ${product.list_price || "0.00"}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[10px] font-black text-[#AD0100] uppercase tracking-tighter leading-none">Dealer</span>
                                {product.applied_discount > 0 && (
                                    <span className={cn(
                                        "text-[8px] font-black px-1.5 py-0.5 rounded-full",
                                        product.discount_type === 'specific' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {product.applied_discount}% OFF
                                    </span>
                                )}
                            </div>
                            <span className={cn("text-[18px] font-black tracking-tighter leading-none", product.applied_discount > 0 ? "text-emerald-600" : "text-[#AD0100]")}>
                                ${product.your_price || product.list_price || "0.00"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg h-9 overflow-hidden shadow-sm">
                            <button
                                onClick={() => onQuantityChange(product.id, -1)}
                                className="w-8 h-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors border-r border-slate-100"
                                disabled={quantity <= 1}
                            >
                                <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-[12px] font-black text-slate-800">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onQuantityChange(product.id, 1)}
                                className="w-8 h-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors border-l border-slate-100"
                            >
                                <Plus size={12} />
                            </button>
                        </div>

                        <button
                            onClick={() => onAddToCart(product.id, quantity)}
                            className="w-9 h-9 bg-[#AD0100] hover:bg-red-800 text-white rounded-lg flex items-center justify-center shadow-md shadow-red-100 transition-all active:scale-95 group/btn"
                        >
                            <ShoppingCart size={18} className="transition-transform group-hover/btn:scale-110" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * Detailed Skeleton Card to match the new design
 */
const SkeletonCard = () => (
    <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[380px] p-0 animate-pulse">
        <div className="h-[180px] bg-slate-100 w-full" />
        <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-50 rounded w-1/2" />
            </div>
            <div className="space-y-2 mt-1">
                <div className="h-2 bg-slate-50 rounded-full w-full" />
                <div className="h-2 bg-slate-50 rounded-full w-2/3" />
            </div>
            <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-3">
                    <div className="h-8 bg-slate-50 rounded w-12" />
                    <div className="h-8 bg-slate-100 rounded w-16" />
                </div>
                <div className="h-8 w-16 bg-slate-50 rounded-lg" />
            </div>
        </div>
    </div>
);

export default function Index() {
    const { auth, favourites } = usePage().props;
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
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    }, []);

    const handleAddToCart = (productId, qty) => {
        router.post(route("parts.to-cart"), {
            product_id: productId,
            quantity: qty
        }, { preserveScroll: true });
    };

    const handleDelete = (favId) => {
        Swal.fire({
            title: "Remove from Favorites?",
            text: "This item will be removed from your saved list.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, remove it!",
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "rounded-full px-6 py-2 font-bold",
                cancelButton: "rounded-full px-6 py-2 font-bold",
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
                <div className="max-w-9xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            My Favorites
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">Manage your saved parts and add them to cart easily.</p>
                    </div>

                {!isLoading && favourites.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-white rounded-md border border-slate-100 p-10 shadow-sm">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <HeartOff className="w-10 h-10 text-[#AD0100] opacity-50" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">
                            Favorites List Empty
                        </h2>
                        <p className="text-slate-500 text-sm max-w-xs mb-8 font-medium">
                            Explore our premium parts inventory and save your favorites here.
                        </p>
                        <Link
                            href={route("parts.index")}
                            className="inline-flex items-center gap-2 bg-[#AD0100] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-red-100 transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {isLoading
                            ? (favourites.data?.length > 0 ? favourites.data : Array(8).fill(0)).map((_, i) => (
                                <SkeletonCard key={i} />
                              ))
                            : favourites.data.map((fav) => (
                                <FavoriteCard 
                                    key={fav.id} 
                                    fav={fav} 
                                    quantity={quantities[fav.product.id] || 1}
                                    onQuantityChange={handleQuantityChange}
                                    onAddToCart={handleAddToCart}
                                    onDelete={handleDelete}
                                />
                              ))
                        }
                    </div>
                )}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <UserLayout children={page} />;

