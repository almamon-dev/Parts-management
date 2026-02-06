import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import {
    Plus,
    Minus,
    ShoppingBag,
    ImageOff,
    ChevronLeft,
    Eye,
    Bookmark,
} from "lucide-react";
import ConfirmDelete from "@/Components/ui/ConfirmDelete";
import ConfirmCheckout from "@/Components/ui/ConfirmCheckout";
import ProductDetailsModal from "@/Components/ui/user/ProductDetailsModal";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export default function AddToCart() {
    const { auth, cart } = usePage().props;
    const {
        items: cartItems,
        subtotal,
        total,
    } = cart || { items: [], subtotal: 0, total: 0 };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = useCallback((itemProduct) => {
        setSelectedProduct(itemProduct);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleToggleFavorite = (productId) => {
        router.post(
            route("parts.favourite"),
            { product_id: productId },
            { preserveScroll: true },
        );
    };

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

    const handleSaveQuote = () => {
        router.post(
            route("quotes.store-from-cart"),
            {},
            {
                onSuccess: () => toast.success("Cart saved as a quote!"),
            },
        );
    };

    return (
        <>
            <Head title="Shopping Cart" />

            <div className="bg-[#FBFBFC] min-h-screen pb-10 text-sm p-4 md:p-8">
                <div className="max-w-9xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center gap-3 mb-8">
                        <Link
                            href={route("parts.index")}
                            className="p-1.5 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Your Shopping Cart
                        </h1>
                    </div>

                    {cartItems && cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* --- LEFT: Item List (8 Columns) --- */}
                            <div className="lg:col-span-8 space-y-3">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-slate-100 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-4 hover:shadow-sm transition-shadow group relative"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-full sm:w-24 h-40 sm:h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-2">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    className="w-full h-full object-contain sm:object-cover group-hover:scale-110 transition-transform duration-300"
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
                                        <div className="flex-1 w-full flex flex-col">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest">
                                                        {item.sku ||
                                                            "PRODUCT-SKU"}
                                                    </span>
                                                    <h3 className="font-bold text-base text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-1  lg:not-italic">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="absolute top-3 right-3 sm:static flex flex-col gap-2 items-end">
                                                    <ConfirmDelete
                                                        id={item.id}
                                                        routeName="carts.destroy"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleOpenModal(
                                                                item.product,
                                                            )
                                                        }
                                                        className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                                                    >
                                                        <Eye size={12} /> View
                                                        Details
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4 sm:mt-2">
                                                <div className="flex items-center gap-3">
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

                                                    {/* Mobile Details button */}
                                                    <button
                                                        onClick={() =>
                                                            handleOpenModal(
                                                                item.product,
                                                            )
                                                        }
                                                        className="sm:hidden flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                                                    >
                                                        <Eye size={12} />{" "}
                                                        Details
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider lg:capitalize lg:tracking-normal">
                                                        Subtotal
                                                    </p>
                                                    <div className="text-lg font-bold text-slate-900 leading-none lg:text-xl">
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
                                        <span className="text-base uppercase tracking-tight lg:capitalize">
                                            Add Another Item
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* --- RIGHT: Sticky Summary (4 Columns) --- */}
                            <div className="lg:col-span-4 lg:sticky lg:top-8 mt-4 lg:mt-0">
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:p-6 lg:rounded-2xl">
                                    <h3 className="text-lg font-bold text-slate-900 mb-5 lg:mb-5">
                                        Order Summary
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-slate-500 font-medium text-sm">
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
                                            <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded-full lg:bg-transparent lg:px-0 lg:py-0">
                                                Calculated at checkout
                                            </span>
                                        </div>
                                        <hr className="border-slate-100 my-2" />
                                        <div className="flex justify-between items-end pt-1">
                                            <span className="text-slate-900 font-bold text-base">
                                                Total Amount
                                            </span>
                                            <span className="text-2xl font-black text-red-600 leading-none lg:text-2xl">
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
                                        <Link
                                            href={route("checkout.index")}
                                            className="group w-full flex items-center justify-between gap-3 px-5 py-3 bg-red-700 text-white rounded-full font-bold hover:bg-red-800 shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="flex-1 text-center whitespace-nowrap">
                                                Proceed to Checkout
                                            </span>
                                            <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
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
                                        </Link>

                                        <button
                                            onClick={handleSaveQuote}
                                            className="group w-full flex items-center justify-between gap-3 px-5 py-3 border-2 border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 hover:border-red-500 hover:text-red-500 transition-all active:scale-[0.98] lg:border-red-500 lg:text-red-600 lg:hover:bg-red-50"
                                        >
                                            <span className="flex-1 text-center whitespace-nowrap uppercase tracking-widest text-[11px] lg:capitalize lg:tracking-normal lg:text-sm">
                                                Save Quote
                                            </span>
                                            <span className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full lg:bg-red-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                                <Bookmark
                                                    size={14}
                                                    className="lg:size-16-none"
                                                />
                                            </span>
                                        </button>
                                    </div>
                                </div>
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

AddToCart.layout = (page) => <UserLayout children={page} />;
