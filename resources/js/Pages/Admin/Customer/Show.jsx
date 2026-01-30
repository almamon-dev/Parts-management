import React, { useState, useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import { 
    Users, 
    ChevronLeft, 
    Building2, 
    Mail, 
    Phone, 
    MapPin, 
    Percent, 
    Search, 
    Trash2, 
    Package,
    Plus,
    Calendar,
    ArrowRight
} from "lucide-react";

export default function Show({ customer, categories = [], filterOptions = { years: [], makes: [], models: [] } }) {
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountType, setDiscountType] = useState("global");
    const [discountRate, setDiscountRate] = useState(customer.discount_rate || "");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Advanced Filters State
    const [filters, setFilters] = useState({
        category: "",
        year_from: "",
        make: "",
        model: ""
    });
    const [activeFilterOptions, setActiveFilterOptions] = useState(filterOptions);
    const [isSearching, setIsSearching] = useState(false);

    // Initial fetch when modal opens or tab changes to specific
    useEffect(() => {
        if (showDiscountModal && discountType === "specific") {
            performSearch(searchQuery, filters);
        }
    }, [showDiscountModal, discountType]);

    const performSearch = async (query, currentFilters) => {
        setIsSearching(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (currentFilters.category) params.append('category', currentFilters.category);
            if (currentFilters.year_from) params.append('year_from', currentFilters.year_from);
            if (currentFilters.make) params.append('make', currentFilters.make);
            if (currentFilters.model) params.append('model', currentFilters.model);

            const baseUrl = route('admin.customers.search-products');
            const response = await fetch(`${baseUrl}?${params.toString()}`);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            setSearchResults(data.products || []);
            setActiveFilterOptions(prev => ({
                ...prev,
                makes: data.filterOptions?.makes || prev.makes,
                models: data.filterOptions?.models || prev.models,
            }));
        } catch (error) {
            console.error("Error searching products:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useMemo(
        () => debounce((query) => performSearch(query, filters), 300),
        [filters]
    );

    const handleFilterChange = (key, value) => {
        const nextFilters = { ...filters, [key]: value };
        
        // Reset dependent filters
        if (key === 'year_from') {
            nextFilters.make = "";
            nextFilters.model = "";
        } else if (key === 'make') {
            nextFilters.model = "";
        }

        setFilters(nextFilters);
        performSearch(searchQuery, nextFilters);
    };

    const addProduct = (product) => {
        if (!selectedProducts.find(p => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, { ...product, discount_rate: "" }]);
        }
    };

    const addAllSelected = () => {
        const newProducts = searchResults.filter(
            res => !selectedProducts.find(p => p.id === res.id)
        ).map(p => ({ ...p, discount_rate: "" }));
        
        setSelectedProducts([...selectedProducts, ...newProducts]);
    };

    const removeProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const updateProductDiscountRate = (productId, rate) => {
        setSelectedProducts(selectedProducts.map(p => 
            p.id === productId ? { ...p, discount_rate: rate } : p
        ));
    };

    const saveDiscount = (e) => {
        e.preventDefault();
        router.patch(
            route("admin.customers.update-discount", customer.id),
            { 
                type: discountType,
                discount_rate: discountRate,
                products: selectedProducts
            },
            {
                onSuccess: () => {
                    setShowDiscountModal(false);
                    setSelectedProducts([]);
                },
            }
        );
    };

    const removeSpecificDiscount = (productId) => {
        if (confirm("Are you sure you want to remove this product discount?")) {
            router.delete(route('admin.customers.remove-product-discount', [customer.id, productId]));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Customer: ${customer.name}`} />

            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
                {/* Header/Back Link */}
                <Link 
                    href={route('admin.customers.index')}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#FF9F43] transition-colors mb-6 group"
                >
                    <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Customers List
                </Link>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="relative h-32 bg-gradient-to-r from-[#FF9F43] to-[#FF9F43]/80">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center">
                                <Users size={40} className="text-[#FF9F43]" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{customer.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF9F43]/10 text-[#FF9F43]">
                                    B2B Partner
                                </span>
                                <span className="text-slate-400 text-sm">• Registered {new Date(customer.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDiscountModal(true)}
                                className="inline-flex items-center px-5 py-2.5 bg-[#FF9F43] text-white text-sm font-bold rounded-xl hover:bg-[#e68a30] transition-all shadow-lg shadow-[#FF9F43]/20"
                            >
                                <Percent size={18} className="mr-2" />
                                Set Discount
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Company</p>
                                <p className="text-sm font-semibold text-slate-900">{customer.company_name || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</p>
                                <p className="text-sm font-semibold text-slate-900">{customer.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</p>
                                <p className="text-sm font-semibold text-slate-900">{customer.phone_number || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Address</p>
                                <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{customer.address || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Global Discount */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Percent size={20} className="text-[#FF9F43]" />
                                Global Discount
                            </h2>
                            <div className="bg-[#FF9F43]/5 rounded-2xl p-6 border border-[#FF9F43]/10 text-center">
                                <div className="text-4xl font-black text-[#FF9F43] mb-1">
                                    {customer.discount_rate}%
                                </div>
                                <p className="text-slate-500 text-xs font-medium">Applied to all products</p>
                                <button
                                    onClick={() => {
                                        setDiscountType("global");
                                        setShowDiscountModal(true);
                                    }}
                                    className="mt-4 text-[13px] font-bold text-[#FF9F43] hover:text-[#e68a30] transition-colors flex items-center justify-center gap-1 mx-auto"
                                >
                                    Change Rate <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Purchase Summary</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-medium text-slate-600">Total Purchases</span>
                                    <span className="text-lg font-bold text-slate-900">${parseFloat(customer.total_purchases).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <span className="text-sm font-medium text-slate-600">Total Returns</span>
                                    <span className="text-lg font-bold text-slate-900">${parseFloat(customer.total_returns).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Specific Product Discounts */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Package size={20} className="text-[#FF9F43]" />
                                    Specific Product Discounts
                                </h2>
                                <button
                                    onClick={() => {
                                        setDiscountType("specific");
                                        setShowDiscountModal(true);
                                    }}
                                    className="inline-flex items-center px-3 py-1.5 bg-[#FF9F43]/10 text-[#FF9F43] text-xs font-bold rounded-lg hover:bg-[#FF9F43] hover:text-white transition-all"
                                >
                                    <Plus size={14} className="mr-1" />
                                    Add Specific
                                </button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {customer.product_discounts && customer.product_discounts.length > 0 ? (
                                    customer.product_discounts.map((discount) => (
                                        <div key={discount.id} className="p-4 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">{discount.product.description}</h3>
                                                    <p className="text-[11px] text-slate-500 font-medium">SKU: {discount.product.sku} | List Price: ${discount.product.list_price}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-[13px] font-black">
                                                        {discount.discount_rate}% OFF
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-bold">DISCOUNT RATE</p>
                                                </div>
                                                <button
                                                    onClick={() => removeSpecificDiscount(discount.product_id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-16 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package size={32} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-slate-900 font-bold">No specific discounts</h3>
                                        <p className="text-slate-500 text-sm mt-1">This user currently only has a global discount rate.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discount Modal */}
            {showDiscountModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-[2px]">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all border border-slate-100 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                            <h3 className="text-base font-bold text-slate-900">
                                Manage Discounts
                            </h3>
                            <button 
                                onClick={() => setShowDiscountModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[85vh]">
                            {/* Custom Tab Component */}
                            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
                                <button
                                    onClick={() => setDiscountType("global")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-bold transition-all ${
                                        discountType === "global"
                                            ? "bg-white text-[#FF9F43] shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 font-semibold"
                                    }`}
                                >
                                    <Percent size={14} /> Global
                                </button>
                                <button
                                    onClick={() => setDiscountType("specific")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[13px] font-bold transition-all ${
                                        discountType === "specific"
                                            ? "bg-white text-[#FF9F43] shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 font-semibold"
                                    }`}
                                >
                                    <Package size={14} /> Specific
                                </button>
                            </div>

                            <form onSubmit={saveDiscount} className="space-y-4">
                                {discountType === "global" ? (
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                        <label className="block text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
                                            Global Discount Rate
                                        </label>
                                        <div className="relative max-w-[140px] mx-auto">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={discountRate}
                                                onChange={(e) => setDiscountRate(e.target.value)}
                                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-2xl font-bold text-center text-[#FF9F43] focus:ring-2 focus:ring-[#FF9F43]/20 focus:border-[#FF9F43] outline-none transition-all"
                                                required={discountType === "global"}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">%</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Minimal Filters */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                            {['category', 'year_from', 'make', 'model'].map((key) => (
                                                <div key={key}>
                                                    <select 
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                                                        value={filters[key] || ""}
                                                        onChange={(e) => handleFilterChange(key, e.target.value)}
                                                        disabled={
                                                            (key === 'make' && !filters.year_from) || 
                                                            (key === 'model' && !filters.make)
                                                        }
                                                    >
                                                        <option value="">
                                                            {key === 'category' ? 'All Categories' : 
                                                             key === 'year_from' ? 'All Years' :
                                                             key === 'make' ? 'All Makes' : 'All Models'}
                                                        </option>
                                                        {(key === 'category' ? categories : 
                                                          key === 'year_from' ? filterOptions.years :
                                                          key === 'make' ? activeFilterOptions.makes : activeFilterOptions.models)?.map(opt => (
                                                            <option key={typeof opt === 'object' ? opt.id : opt} value={typeof opt === 'object' ? opt.name : opt}>
                                                                {typeof opt === 'object' ? opt.name : opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Search & Actions */}
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        debouncedSearch(e.target.value);
                                                    }}
                                                    placeholder="Search SKU or Name..."
                                                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-slate-200 rounded-lg text-xs font-medium outline-none focus:bg-white focus:border-[#FF9F43] transition-all"
                                                />
                                            </div>
                                            {searchResults.length > 0 && (
                                                <button 
                                                    type="button"
                                                    onClick={addAllSelected}
                                                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5"
                                                >
                                                    <Plus size={12} /> Add All
                                                </button>
                                            )}
                                        </div>

                                        {/* Results Table - More Compact */}
                                        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-100 bg-white shadow-sm">
                                            {isSearching ? (
                                                <div className="p-4 text-center">
                                                    <div className="w-4 h-4 border-2 border-[#FF9F43] border-t-transparent rounded-full animate-spin mx-auto" />
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <table className="w-full text-left text-[11px]">
                                                    <tbody className="divide-y divide-slate-50">
                                                        {searchResults.map(product => (
                                                            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-3 py-2 max-w-[200px] truncate">
                                                                    <span className="font-bold text-slate-700">{product.description}</span>
                                                                </td>
                                                                <td className="px-3 py-2 text-slate-400 font-mono">{product.sku}</td>
                                                                <td className="px-3 py-2 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addProduct(product)}
                                                                        className={`p-1.5 rounded-md transition-all ${
                                                                            selectedProducts.find(p => p.id === product.id)
                                                                            ? "text-green-500"
                                                                            : "text-slate-300 hover:text-[#FF9F43]"
                                                                        }`}
                                                                    >
                                                                        <Plus size={16} className={selectedProducts.find(p => p.id === product.id) ? "hidden" : "block"} />
                                                                        <svg className={selectedProducts.find(p => p.id === product.id) ? "block w-4 h-4" : "hidden"} viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (searchQuery || filters.category || filters.year_from || filters.make || filters.model) ? (
                                                <div className="p-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                                                    No results match your criteria
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-slate-300 text-[10px] font-bold italic">
                                                    Select a filter or search to find products
                                                </div>
                                            )}
                                        </div>

                                        {/* Selected Items List - Tightened */}
                                        <div className="space-y-2 pt-2 border-t border-slate-50">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                                    Selection ({selectedProducts.length})
                                                </h4>
                                                {selectedProducts.length > 0 && (
                                                    <button 
                                                        type="button"
                                                        onClick={() => setSelectedProducts([])}
                                                        className="text-[10px] font-bold text-red-400 hover:text-red-500"
                                                    >
                                                        Clear
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-40 overflow-y-auto space-y-1">
                                                {selectedProducts.map(product => (
                                                    <div key={product.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group">
                                                        <div className="flex-1 min-w-0 pr-3">
                                                            <p className="text-[11px] font-bold text-slate-700 truncate">{product.description}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold">{product.sku}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative w-16">
                                                                <input
                                                                    type="number"
                                                                    value={product.discount_rate}
                                                                    onChange={(e) => updateProductDiscountRate(product.id, e.target.value)}
                                                                    className="w-full pl-2 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-bold outline-none focus:border-[#FF9F43]"
                                                                    placeholder="Rate"
                                                                    required
                                                                />
                                                                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold">%</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeProduct(product.id)}
                                                                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-500 rounded-md"
                                                            >
                                                                <Plus size={14} className="rotate-45" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowDiscountModal(false)}
                                        className="flex-1 py-2.5 px-4 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 px-4 bg-[#FF9F43] text-white rounded-lg text-xs font-black hover:bg-[#e68a30] transition-all shadow-md shadow-[#FF9F43]/20"
                                    >
                                        Apply Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
