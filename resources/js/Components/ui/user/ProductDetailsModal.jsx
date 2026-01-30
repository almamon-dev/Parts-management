import React, { useState } from "react";
import { 
    X, 
    ShoppingCart, 
    Minus, 
    Plus, 
    Heart, 
    ImageOff,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

export default function ProductDetailsModal({ product, isOpen, onClose, onToggleFavorite }) {
    if (!isOpen || !product) return null;

    const [activeTab, setActiveTab] = useState("description"); // description, fitments, oem
    const [selectedImage, setSelectedImage] = useState(product.files?.[0]?.file_path || null);
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);

    const handleAddToCart = () => {
        setProcessing(true);
        router.post(route("parts.to-cart"), {
            product_id: product.id,
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Added to cart!");
                onClose();
            },
            onFinish: () => setProcessing(false)
        });
    };

    const tabs = [
        { id: "description", label: "DESCRIPTION" },
        { id: "fitments", label: "FITMENTS" },
        { id: "oem", label: "OEM/ PARTSLINK" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose} 
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-3xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:max-h-[90vh] animate-in zoom-in-95 duration-300 scale-100 font-sans">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute right-5 top-5 w-8 h-8 bg-slate-100/50 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-20 group border border-slate-200"
                >
                    <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="mb-6">
                        <span className="text-[10px] font-black text-[#A80000] uppercase tracking-[0.2em] mb-1 block">Product Details</span>
                        <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase leading-none">{product.sku}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Gallery Section */}
                        <div className="lg:col-span-12 flex flex-col md:flex-row gap-5">
                            {/* Thumbnails */}
                            <div className="flex md:flex-col gap-2 shrink-0 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-[320px] custom-scrollbar pb-2 md:pb-0 scrollbar-hide">
                                {product.files?.map((file, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(file.file_path)}
                                        className={cn(
                                            "w-20 h-20 rounded-2xl border transition-all shrink-0 overflow-hidden bg-slate-50 p-1.5",
                                            selectedImage === file.file_path 
                                                ? "border-[#A80000] ring-4 ring-[#A80000]/5 bg-white shadow-sm" 
                                                : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        <img 
                                            src={`/${file.file_path}`} 
                                            alt={product.description} 
                                            className="w-full h-full object-contain" 
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 h-[280px] md:h-[350px] rounded-[32px] bg-slate-50 border border-slate-100 overflow-hidden relative group order-1 md:order-2">
                                {selectedImage ? (
                                    <img 
                                        src={`/${selectedImage}`} 
                                        alt={product.description} 
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-6" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <ImageOff size={48} className="opacity-20 stroke-[1.5]" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">No Image Available</span>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => onToggleFavorite(product.id)}
                                    className="absolute top-5 right-5 w-12 h-12 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all hover:scale-110 active:scale-90"
                                >
                                    <Heart size={20} className={cn("transition-colors", product.is_favorite && "fill-rose-500 text-rose-500")} />
                                </button>
                                </div>
                        </div>

                        {/* Tabs & Content */}
                        <div className="lg:col-span-12 space-y-6">
                            {/* Custom Nav Pills */}
                            <div className="flex p-1.5 bg-slate-100/80 rounded-full border border-slate-200/50 max-w-xl mx-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 uppercase",
                                            activeTab === tab.id 
                                                ? "bg-white text-[#A80000] shadow-sm ring-1 ring-slate-200/50" 
                                                : "text-slate-500 hover:text-slate-900"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[160px] pb-4">
                                {activeTab === "description" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Parts Description</h4>
                                        <p className="text-[15px] text-slate-800 leading-relaxed font-bold uppercase tracking-tight">
                                            {product.description}
                                        </p>
                                    </div>
                                )}

                                {activeTab === "fitments" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Fitment Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {product.fitments?.map((fit, idx) => (
                                                <div key={idx} className="flex items-center h-8 bg-slate-50 border border-slate-200 rounded-lg px-3 gap-3 hover:border-[#A80000]/30 transition-colors group">
                                                    <span className="text-[10px] font-black text-[#A80000] whitespace-nowrap tracking-tighter">
                                                        {fit.year_from} — {fit.year_to}
                                                    </span>
                                                    <div className="w-px h-3 bg-slate-200 group-hover:bg-[#A80000]/20" />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase truncate">
                                                        {fit.make} {fit.model}
                                                    </span>
                                                </div>
                                            ))}
                                            {(!product.fitments || product.fitments.length === 0) && (
                                                <div className="col-span-full py-8 text-center text-slate-400 font-medium italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">No fitment data available.</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "oem" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">OEM / Partslink Numbers</h4>
                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {product.parts_numbers?.map((pn, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-[#A80000]/30 transition-all shadow-sm">
                                                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">{pn.part_number}</span>
                                                    <CheckCircle2 size={14} className="text-[#A80000] opacity-30 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            ))}
                                            {(!product.parts_numbers || product.parts_numbers.length === 0) && (
                                                <div className="col-span-full py-8 text-center text-slate-400 font-medium italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">No OEM codes available.</div>
                                            )}
                                         </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-white p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100">
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-[#A80000] uppercase tracking-widest">Your Price</span>
                                {product.applied_discount > 0 && (
                                    <span className={cn(
                                        "text-[9px] font-black px-2 py-0.5 rounded-full",
                                        product.discount_type === 'specific' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {product.applied_discount}% OFF
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={cn("text-3xl font-black tracking-tighter leading-none", product.applied_discount > 0 ? "text-emerald-600" : "text-slate-950")}>
                                    ${product.your_price || product.list_price || '0.00'}
                                </span>
                                {product.applied_discount > 0 && (
                                    <span className="text-lg font-bold text-slate-400 line-through tracking-tight text-opacity-50">${product.list_price}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center bg-slate-100/80 rounded-2xl border border-slate-200/50 p-1 h-14">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-full flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-500 hover:text-red-500 transition-all active:scale-90 border border-slate-100"
                            >
                                <Minus size={16} />
                            </button>
                            <input 
                                type="number" 
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-14 text-center font-black text-slate-900 border-none focus:ring-0 text-[16px] bg-transparent p-0"
                            />
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-12 h-full flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-500 hover:text-[#A80000] transition-all active:scale-90 border border-slate-100"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <button 
                            disabled={processing}
                            onClick={handleAddToCart}
                            className="flex-1 sm:flex-none h-14 pl-8 pr-6 bg-[#A80000] text-white rounded-[20px] font-black text-[12px] uppercase tracking-widest flex items-center justify-between gap-8 hover:bg-[#8B0000] transition-all active:scale-95 shadow-2xl shadow-[#A80000]/20 group disabled:opacity-50"
                        >
                            <span className="whitespace-nowrap">Add to Cart</span>
                            <ShoppingCart size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
