import React, { useState, useEffect } from "react";
import {
    X,
    ShoppingCart,
    Minus,
    Plus,
    ChevronLeft,
    ChevronRight,
    Heart,
    ImageOff,
    CheckCircle2,
    Car,
    Hash,
    FileText,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

export default function ProductDetailsModal({
    product,
    isOpen,
    onClose,
    onToggleFavorite,
}) {
    const [activeTab, setActiveTab] = useState("description");
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        if (product?.files?.length > 0) {
            setSelectedImage(product.files[0].file_path);
        }
    }, [product]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        setProcessing(true);
        router.post(
            route("parts.to-cart"),
            {
                product_id: product.id,
                quantity: quantity,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Added to cart successfully!");
                    onClose();
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const handleNext = () => {
        const images = product.files || [];
        if (images.length <= 1) return;
        const currentIndex = images.findIndex(
            (f) => f.file_path === selectedImage,
        );
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex].file_path);
    };

    const handlePrev = () => {
        const images = product.files || [];
        if (images.length <= 1) return;
        const currentIndex = images.findIndex(
            (f) => f.file_path === selectedImage,
        );
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex].file_path);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) handleNext();
            else handlePrev();
        }
    };

    const tabs = [
        { id: "description", label: "Description", icon: FileText },
        { id: "fitments", label: "Fitments", icon: Car },
        { id: "oem", label: "OEM Numbers", icon: Hash },
    ];

    const formatPrice = (price) => {
        return parseFloat(price || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const discountPercentage =
        product.list_price && product.your_price
            ? Math.round((1 - product.your_price / product.list_price) * 100)
            : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 lg:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl max-h-[75vh] md:max-h-[70vh] rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 scale-100 font-sans mx-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 md:px-6 py-2.5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                SKU: {product.sku}
                            </span>
                            {product.part_type && (
                                <span className="text-[10px] font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">
                                    {product.part_type.name}
                                </span>
                            )}
                        </div>
                        <h2 className="text-base font-bold text-gray-900 truncate">
                            {product.description}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onToggleFavorite(product.id)}
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                product.is_favorite
                                    ? "text-red-500 hover:text-red-600 bg-red-50"
                                    : "text-gray-400 hover:text-gray-600 bg-gray-50",
                            )}
                        >
                            <Heart
                                size={20}
                                className={cn(
                                    product.is_favorite && "fill-current",
                                )}
                            />
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-5">
                        {/* Left Column - Images */}
                        <div className="space-y-3">
                            {/* Main Image */}
                            <div
                                className="relative h-[220px] md:h-[280px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center touch-pan-y group"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {selectedImage ? (
                                    <>
                                        <img
                                            src={`/${selectedImage}`}
                                            alt={product.description}
                                            className="w-full h-full object-contain p-6 transition-transform duration-300 hover:scale-105"
                                            loading="lazy"
                                        />
                                        {product.files?.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePrev();
                                                    }}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 border border-slate-200 text-slate-800 hover:bg-white transition-all z-50 shadow-md flex items-center justify-center cursor-pointer active:scale-90"
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNext();
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 border border-slate-200 text-slate-800 hover:bg-white transition-all z-50 shadow-md flex items-center justify-center cursor-pointer active:scale-90"
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <ImageOff size={48} />
                                        <span className="text-sm font-medium mt-2">
                                            No Image Available
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {product.files?.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {product.files?.map((file, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(file.file_path)
                                            }
                                            className={cn(
                                                "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 transition-all overflow-hidden cursor-pointer",
                                                selectedImage === file.file_path
                                                    ? "border-slate-900 shadow-sm scale-105"
                                                    : "border-slate-100 hover:border-slate-200",
                                            )}
                                        >
                                            <img
                                                src={`/${file.file_path}`}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-4">
                            {/* Price Section */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            List Price
                                        </span>
                                        <div className="text-xl md:text-2xl font-black text-slate-500">
                                            ${formatPrice(product.list_price)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-[#A80000] uppercase tracking-wider">
                                            Your Price
                                        </span>
                                        <div className="text-xl md:text-2xl font-black text-slate-900">
                                            $
                                            {formatPrice(
                                                product.your_price ||
                                                    product.list_price,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg transition-colors"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const value = parseInt(
                                                    e.target.value,
                                                );
                                                setQuantity(
                                                    value >= 1 ? value : 1,
                                                );
                                            }}
                                            className="w-12 text-center text-sm font-semibold text-gray-900 border-none focus:ring-0 bg-transparent"
                                            min="1"
                                        />
                                        <button
                                            onClick={() =>
                                                setQuantity(quantity + 1)
                                            }
                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        disabled={processing}
                                        onClick={handleAddToCart}
                                        className="flex-1 h-10 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={18} />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={cn(
                                                    "flex-1 md:flex-none px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2",
                                                    activeTab === tab.id
                                                        ? "border-red-500 text-red-600"
                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                )}
                                            >
                                                <Icon size={14} />
                                                <span className="hidden sm:inline">
                                                    {tab.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[150px]">
                                {activeTab === "description" && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="prose prose-sm max-w-none">
                                            <p className="text-gray-700 leading-relaxed text-xs tracking-tight">
                                                {product.description}
                                            </p>
                                            {product.specifications && (
                                                <div className="mt-4">
                                                    <h4 className="text-[10px] font-bold text-gray-400  tracking-widest mb-2">
                                                        Specifications
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {Object.entries(
                                                            product.specifications,
                                                        ).map(
                                                            ([key, value]) => (
                                                                <div
                                                                    key={key}
                                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
                                                                >
                                                                    <span className="text-[10px] text-gray-500">
                                                                        {key}
                                                                    </span>
                                                                    <span className="text-[10px] font-black text-gray-900 ">
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "fitments" && (
                                    <div className="animate-in fade-in duration-300">
                                        {product.fitments?.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {product.fitments.map(
                                                    (fit, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-sm hover:bg-gray-100 transition-colors cursor-default"
                                                        >
                                                            <div className="text-xs text-gray-900 text-center">
                                                                {fit.make}{" "}
                                                                {fit.model}
                                                            </div>
                                                            <div className="text-[10px] text-gray-500  mt-1">
                                                                {fit.year_from}
                                                                {fit.year_to !==
                                                                    fit.year_from &&
                                                                    ` - ${fit.year_to}`}
                                                            </div>
                                                            {fit.engine && (
                                                                <div className="text-[9px] text-red-600 font-black mt-1 px-1.5 py-0.5 bg-red-50 rounded">
                                                                    {fit.engine}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <Car
                                                    size={48}
                                                    className="mx-auto mb-3 opacity-30"
                                                />
                                                <p className="font-medium">
                                                    No fitment data available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "oem" && (
                                    <div className="animate-in fade-in duration-300">
                                        {product.parts_numbers?.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {product.parts_numbers.map(
                                                    (pn, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-center p-3 text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors cursor-default"
                                                        >
                                                            {pn.part_number}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">
                                                <Hash
                                                    size={48}
                                                    className="mx-auto mb-3 opacity-30"
                                                />
                                                <p className="font-medium">
                                                    No OEM numbers available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
