import React, { useState, useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Skeleton } from "@/Components/ui/Skeleton";
import {
    ShoppingCart,
    Plus,
    Minus,
    ImageOff,
    HeartOff,
    ArrowLeft,
} from "lucide-react";
import ConfirmDelete from "@/Components/ui/ConfirmDelete";

// --- Skeleton Card Component (Single Item) ---
const ProductCardSkeleton = () => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col p-4">
        {/* Image Skeleton */}
        <Skeleton className="h-56 w-full rounded-2xl mb-4" />

        {/* SKU & Brand Skeleton */}
        <div className="flex-grow space-y-3 mb-4">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>

        {/* Price & Actions Skeleton */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
            <div className="flex gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
        </div>
    </div>
);

export default function Index() {
    const { auth, favourites } = usePage().props;
    const [isLoading, setIsLoading] = useState(true);

    // Initial Loading Animation
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Local state for quantities
    const [quantities, setQuantities] = useState(
        Object.fromEntries(favourites.data.map((fav) => [fav.product.id, 1]))
    );

    const updateQuantity = (id, delta) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta),
        }));
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="My Favourites" />
            <div className="p-6 bg-[#F8F9FB] min-h-screen">
                {/* Check if there is data OR if it's loading */}
                {!isLoading && favourites.data.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                            <HeartOff className="w-12 h-12 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            Your favorites list is empty
                        </h2>
                        <p className="text-slate-500 max-w-sm mb-8">
                            Looks like you haven't added any parts to your
                            favorites yet.
                        </p>
                        <Link
                            href={route("parts.index")}
                            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    /* GRID SECTION (Loading or Data) */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {isLoading
                            ? /* SKELETON LOOP */
                              /* favourites.data.length thakle toto goli dekhabe, na thakle default 4 ti */
                              (favourites.data.length > 0
                                  ? favourites.data
                                  : Array(4).fill(0)
                              ).map((_, i) => <ProductCardSkeleton key={i} />)
                            : /* REAL DATA LOOP */
                              favourites.data.map((fav) => {
                                  const product = fav.product;
                                  const firstImage = product.files?.[0];

                                  return (
                                      <div
                                          key={fav.id}
                                          className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col p-4 hover:shadow-md transition-all duration-300"
                                      >
                                          {/* Image Container */}
                                          <div className="relative rounded-2xl overflow-hidden h-56 bg-gray-100 mb-4">
                                              <div className="absolute top-3 right-3 z-20">
                                                  <ConfirmDelete
                                                      id={fav.id}
                                                      routeName="favourites.destroy"
                                                  />
                                              </div>
                                              {firstImage ? (
                                                  <img
                                                      src={`/${firstImage.file_path}`}
                                                      className="w-full h-full object-cover"
                                                      alt={product.title}
                                                  />
                                              ) : (
                                                  <div className="w-full h-full flex items-center justify-center">
                                                      <ImageOff className="w-12 h-12 text-gray-300" />
                                                  </div>
                                              )}
                                          </div>

                                          {/* Content Info */}
                                          <div className="flex-grow space-y-1 mb-4">
                                              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                                  {product.sku || "Product SKU"}
                                              </h3>
                                              <p className="text-slate-500 text-xs font-bold uppercase">
                                                  {product.fitments?.[0]
                                                      ?.make || "Parts Maker"}
                                              </p>
                                          </div>

                                          {/* Footer: Price & Cart Actions */}
                                          <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                                              <div className="flex gap-4">
                                                  <div>
                                                      <span className="block text-[10px] text-slate-400 uppercase font-bold">
                                                          List
                                                      </span>
                                                      <span className="text-sm font-semibold text-slate-400 line-through">
                                                          $
                                                          {product.list_price ||
                                                              "0.00"}
                                                      </span>
                                                  </div>
                                                  <div>
                                                      <span className="block text-[10px] text-slate-400 uppercase font-bold">
                                                          Your Price
                                                      </span>
                                                      <span className="text-xl font-black text-red-700">
                                                          $
                                                          {product.buy_price ||
                                                              "0.00"}
                                                      </span>
                                                  </div>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                  <div className="flex items-center border border-gray-200 rounded-lg h-10 bg-white overflow-hidden shadow-sm">
                                                      <button
                                                          onClick={() =>
                                                              updateQuantity(
                                                                  product.id,
                                                                  -1
                                                              )
                                                          }
                                                          className="px-2 h-full hover:bg-gray-50 transition-colors"
                                                      >
                                                          <Minus className="w-4 h-4 text-gray-400" />
                                                      </button>
                                                      <div className="w-8 text-center font-bold text-sm border-x border-gray-50">
                                                          {quantities[
                                                              product.id
                                                          ] || 1}
                                                      </div>
                                                      <button
                                                          onClick={() =>
                                                              updateQuantity(
                                                                  product.id,
                                                                  1
                                                              )
                                                          }
                                                          className="px-2 h-full hover:bg-gray-50 transition-colors"
                                                      >
                                                          <Plus className="w-4 h-4 text-gray-400" />
                                                      </button>
                                                  </div>
                                                  <button className="bg-[#F1B229] hover:bg-[#D9A024] text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95">
                                                      <ShoppingCart className="w-5 h-5" />
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
