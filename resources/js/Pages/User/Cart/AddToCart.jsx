import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {
    Trash2,
    Plus,
    Minus,
    ArrowUpRight,
    ShoppingBag,
    ImageOff,
    ChevronLeft,
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function AddToCart() {
    const { auth, cartItems, subtotal, total } = usePage().props;

    // Logic to update quantity via router.patch
    const handleUpdateQuantity = (id, currentQty, delta) => {
        const newQuantity = currentQty + delta;
        if (newQuantity >= 1) {
            router.patch(
                route("cart.update", id),
                {
                    quantity: newQuantity,
                },
                { preserveScroll: true }
            );
        }
    };

    // Logic to remove via router.delete
    const handleRemove = (id) => {
        if (confirm("Are you sure you want to remove this item?")) {
            router.delete(route("cart.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="Shopping Cart" />

            <div className="bg-[#FBFBFC] min-h-screen pb-20">
                <div className="max-w-8xl mx-auto px-4 md:px-8">
                    {/* Header Section */}
                    <div className="flex items-center gap-4 pt-8 mb-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Your Shopping Cart
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* --- LEFT: Item List (8 Columns) --- */}
                        <div className="lg:col-span-8 space-y-4">
                            {cartItems && cartItems.length > 0 ? (
                                cartItems.map((item) => {
                                    // Extract the first image from the item's images array
                                    const firstImage =
                                        item.product?.images?.[0];

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow group"
                                        >
                                            {/* Product Image Wrapper */}
                                            {/* Product Image */}
                                            <div className="relative w-32 h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            e.target.onerror =
                                                                null;
                                                            e.target.src =
                                                                "/placeholder.png";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                                        <ImageOff size={32} />
                                                        <span className="text-[10px] mt-1">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 w-full">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                                                            {item.sku ||
                                                                "PRODUCT-SKU"}
                                                        </span>
                                                        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleRemove(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-center mt-6">
                                                    {/* Modern Quantity Selector */}
                                                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity,
                                                                    -1
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-30"
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-10 text-center font-bold text-slate-800">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity,
                                                                    1
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-400 mb-0.5">
                                                            Subtotal
                                                        </p>
                                                        <div className="text-xl font-bold text-slate-900">
                                                            $
                                                            {(
                                                                item.buy_price *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
                                    <ShoppingBag
                                        size={48}
                                        className="mx-auto text-slate-200 mb-4"
                                    />
                                    <p className="text-slate-500 mb-6">
                                        Your cart is currently empty.
                                    </p>
                                    <Link
                                        href={route("products.index")}
                                        className="text-red-600 font-bold hover:underline"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* --- RIGHT: Sticky Summary (4 Columns) --- */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8">
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">
                                    Order Summary
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span>
                                            $
                                            {parseFloat(
                                                subtotal || 0
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-xs">
                                            Calculated at checkout
                                        </span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-4" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-900 font-bold text-lg">
                                            Total Amount
                                        </span>
                                        <span className="text-3xl font-black text-red-600 leading-none">
                                            $
                                            {parseFloat(
                                                total || 0
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        disabled={
                                            !cartItems || cartItems.length === 0
                                        }
                                        className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-100 text-lg disabled:bg-slate-300 disabled:shadow-none"
                                    >
                                        Proceed to Checkout{" "}
                                        <ArrowUpRight size={20} />
                                    </button>
                                    <button className="w-full border border-slate-200 flex items-center justify-center gap-2 text-slate-600 bg-slate-50 py-4 rounded-2xl font-semibold hover:bg-slate-100 transition-all text-sm">
                                        Save for later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
