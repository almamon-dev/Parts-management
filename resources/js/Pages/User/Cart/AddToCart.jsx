import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { Plus, Minus, ShoppingBag, ImageOff, ChevronLeft } from "lucide-react";
import ConfirmDelete from "@/Components/ui/ConfirmDelete";
import ConfirmCheckout from "@/Components/ui/ConfirmCheckout";

export default function AddToCart() {
    const { auth, cartItems, subtotal, total } = usePage().props;

    const handleUpdateQuantity = (id, currentQty, delta) => {
        const newQuantity = currentQty + delta;
        if (newQuantity >= 1) {
            router.patch(
                route("carts.update", id),
                { quantity: newQuantity },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    };

    return (
        <UserLayout user={auth.user}>
            <Head title="Shopping Cart" />

            <div className="bg-[#FBFBFC] min-h-screen pb-10 text-sm">
                <div className="max-w-8xl mx-auto px-4 md:px-8">
                    {/* Header Section */}
                    <div className="flex items-center gap-3 pt-6 mb-4">
                        <Link
                            href={route("parts.index")}
                            className="p-1.5 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <h1 className="text-xl font-bold text-slate-900">
                            Your Shopping Cart
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* --- LEFT: Item List (8 Columns) --- */}
                        <div className="lg:col-span-8">
                            {cartItems && cartItems.length > 0 ? (
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white border border-slate-100 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-4 hover:shadow-sm transition-shadow group"
                                        >
                                            {/* Product Image */}
                                            <div className="relative w-24 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        alt={item.name}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                                        <ImageOff size={24} />
                                                        <span className="text-[9px] mt-1 font-medium">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 w-full">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest">
                                                            {item.sku ||
                                                                "PRODUCT-SKU"}
                                                        </span>
                                                        <h3 className="font-bold text-base text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <ConfirmDelete
                                                        id={item.id}
                                                        routeName="carts.destroy"
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity,
                                                                    -1,
                                                                )
                                                            }
                                                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-30"
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-slate-800 text-[13px]">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item.id,
                                                                    item.quantity,
                                                                    1,
                                                                )
                                                            }
                                                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            Subtotal
                                                        </p>
                                                        <div className="text-lg font-bold text-slate-900 leading-none">
                                                            $
                                                            {(
                                                                item.buy_price *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                undefined,
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* --- ADD ANOTHER ITEM BUTTON --- */}
                                    <div className="pt-2">
                                        <Link
                                            href={route("parts.index")}
                                            className="group w-full flex items-center justify-center gap-2 py-3 border-2 border-red-700 text-red-700 rounded-full font-bold hover:bg-red-50 transition-all active:scale-[0.98]"
                                        >
                                            <Plus
                                                size={20}
                                                strokeWidth={3}
                                                className="group-hover:rotate-90 transition-transform duration-300"
                                            />
                                            <span className="text-base">
                                                Add Another Item
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-16 text-center border border-dashed border-slate-200">
                                    <ShoppingBag
                                        size={40}
                                        className="mx-auto text-slate-200 mb-3"
                                    />
                                    <p className="text-slate-500 mb-4 font-medium">
                                        Your cart is currently empty.
                                    </p>
                                    <Link
                                        href={route("parts.index")}
                                        className="text-red-600 font-bold hover:underline text-sm"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* --- RIGHT: Sticky Summary (4 Columns) --- */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-5">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900 font-bold">
                                            $
                                            {parseFloat(
                                                subtotal || 0,
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px]">
                                            Calculated at checkout
                                        </span>
                                    </div>
                                    <div className="h-px bg-slate-100 my-2" />
                                    <div className="flex justify-between items-end pt-1">
                                        <span className="text-slate-900 font-bold">
                                            Total Amount
                                        </span>
                                        <span className="text-2xl font-black text-red-600 leading-none">
                                            $
                                            {parseFloat(
                                                total || 0,
                                            ).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons Stack */}
                                <div className="flex flex-col gap-3">
                                    <button className="group w-full flex items-center justify-between gap-3 px-5 py-3 border-2 border-red-500 text-red-600 rounded-full font-bold hover:bg-red-50 transition-all active:scale-[0.98]">
                                        <span className="flex-1 text-center whitespace-nowrap">
                                            Save Quote
                                        </span>
                                        <span className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line
                                                    x1="7"
                                                    y1="17"
                                                    x2="17"
                                                    y2="7"
                                                ></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </span>
                                    </button>

                                    <ConfirmCheckout
                                        variant="checkout"
                                        routeName="checkout.process"
                                        cartItems={cartItems}
                                        title="Confirm Your Order"
                                        text="Are you sure you want to proceed to checkout?"
                                        confirmButtonText="Yes, Checkout Now"
                                        buttonText="Proceed to Checkout"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
