import React, { useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    X,
    Plus,
    Minus,
    Trash2,
    ShoppingBag,
    ArrowUpRight,
    Bookmark,
    Eye,
    ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart } = usePage().props;
    const cartItems = cart?.items || [];
    const cartSubtotal = cart?.subtotal || 0;

    // Refresh cart items when open
    useEffect(() => {
        if (isOpen) {
            router.reload({ only: ["cart"] });
        }
    }, [isOpen]);

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

    const handleRemoveItem = (id) => {
        router.delete(route("carts.destroy", id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => toast.success("Item removed from cart"),
        });
    };

    const handleCheckout = () => {
        router.post(
            route("checkout.process"),
            {
                cartItems: cartItems,
            },
            {
                onSuccess: () => {
                    toast.success("Order processed successfully!");
                    onClose();
                },
                onError: () => toast.error("Unable to process checkout"),
            },
        );
    };

    const handleSaveQuote = () => {
        router.post(
            route("quotes.store-from-cart"),
            {},
            {
                onSuccess: () => {
                    toast.success("Cart saved as a quote!");
                    onClose();
                },
            },
        );
    };

    // Helper to format price safely
    const formatPrice = (price) => {
        const num = parseFloat(price);
        return isNaN(num)
            ? "0.00"
            : num.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                        }}
                        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[101] flex flex-col"
                    >
                        {/* Header matching image */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                            <h2 className="text-[20px] font-bold text-[#1E293B] tracking-tight">
                                Shopping Cart
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-slate-400 transition-colors border border-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-4">
                            {cartItems && cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-gray-100 rounded-[20px] p-4 flex gap-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.06)] transition-all relative group"
                                    >
                                        {/* Product Image */}
                                        <div className="w-[85px] h-[85px] bg-[#F8F9FA] rounded-[15px] overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <ShoppingBag
                                                    className="text-gray-300"
                                                    size={24}
                                                />
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0 pr-6">
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-[15px] font-bold text-[#1E293B] uppercase tracking-tight line-clamp-1">
                                                            {item.sku || "N/A"}
                                                        </h4>
                                                        <p className="text-[13px] font-semibold text-[#64748B] line-clamp-1 mt-0.5">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                    {/* Delete Button on top right of item area */}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item.id,
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] rounded-full transition-all border border-[#FEE2E2] shrink-0"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[11px] text-[#94A3B8] font-medium leading-tight mt-1 line-clamp-2">
                                                    {item.description ||
                                                        "2016 -2019 CHEVROLET SILVERADO 1500\nFront Grille, MADE OF PLASTIC, ACDELCO - BRAKES"}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Selector matching image */}
                                                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden h-8">
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.id,
                                                                item.quantity,
                                                                -1,
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity <= 1
                                                        }
                                                        className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-gray-50 disabled:opacity-30 border-r border-gray-100"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-10 text-center text-[13px] font-bold text-[#1E293B] leading-none">
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
                                                        className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-gray-50 border-l border-gray-100"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                <div className="text-[15px] font-bold text-[#1E293B]">
                                                    $
                                                    {formatPrice(
                                                        item.buy_price *
                                                            item.quantity,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag
                                            size={32}
                                            className="text-slate-200"
                                        />
                                    </div>
                                    <p className="text-[#64748B] font-bold text-sm">
                                        Your cart is empty
                                    </p>
                                    <p className="text-[#94A3B8] text-xs mt-1">
                                        Looks like you haven't added anything to
                                        your cart yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary matching image */}
                        <div className="px-6 py-6 bg-white border-t border-gray-50">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-[14px] font-semibold text-[#64748B]">
                                    <span>Subtotal</span>
                                    <span className="text-[#1E293B] font-bold">
                                        ${formatPrice(cartSubtotal)}
                                    </span>
                                </div>
                                <div className="h-px bg-gray-50" />
                                <div className="flex justify-between items-center">
                                    <span className="text-[18px] font-bold text-[#1E293B]">
                                        Total
                                    </span>
                                    <span className="text-[20px] font-black text-[#C52020]">
                                        ${formatPrice(cartSubtotal)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleSaveQuote}
                                    disabled={!cartItems?.length}
                                    className="group h-[46px] px-2 border border-[#DEE2E6] hover:border-[#CED4DA] text-[#1E293B] rounded-[24px] flex items-center justify-center font-bold transition-all hover:bg-[#F8F9FA] disabled:opacity-30"
                                >
                                    <span className="mr-1.5 text-[#C52020] text-[11px] uppercase tracking-tight whitespace-nowrap">
                                        Save Quote
                                    </span>
                                    <div className="w-6 h-6 bg-[#FEF2F2] rounded-full flex items-center justify-center text-[#C52020] group-hover:bg-[#FEE2E2] transition-colors shrink-0">
                                        <ArrowUpRight
                                            size={12}
                                            strokeWidth={3}
                                        />
                                    </div>
                                </button>

                                <Link
                                    href={route("checkout.index")}
                                    onClick={onClose}
                                    className={`group h-[46px] px-2 bg-[#C52020] hover:bg-[#A51A1A] text-white rounded-[24px] flex items-center justify-center font-bold shadow-lg shadow-red-900/10 transition-all ${!cartItems?.length ? "opacity-50 pointer-events-none" : ""}`}
                                >
                                    <span className="mr-1.5 text-[11px] uppercase tracking-tight whitespace-nowrap">
                                        Checkout
                                    </span>
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-white/30 transition-colors shrink-0">
                                        <ArrowUpRight
                                            size={12}
                                            strokeWidth={3}
                                        />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
