import React, { useState, useEffect } from "react";
import Header from "../Components/Navigation/User/Header";
import Sidebar from "../Components/Navigation/User/Sidebar";
import CartDrawer from "../Components/ui/user/CartDrawer";
import { usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function UserLayout({ children }) {
    const { url } = usePage();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Close mobile menu on page change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [url.split('?')[0]]);

    return (
        <div className="flex h-screen bg-[#F9F9F9] font-sans overflow-hidden">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[55] lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Section - Synchronized with Sidebar.jsx width (280px) */}
            <aside
                className={`fixed inset-y-0 left-0 z-[60] transition-all duration-300 ease-in-out flex flex-col w-[280px] bg-white border-r border-slate-100
                    ${
                        isMobileOpen
                            ? "translate-x-0 shadow-2xl"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Mobile Close Button - Refined positioning */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute right-4 top-6 p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-xl transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Sidebar Navigation Items */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <Sidebar isCollapsed={false} />
                </div>
            </aside>

            {/* Main Content Area - Matching sidebar width padding */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px] overflow-hidden">
                <div className="sticky top-0 z-[50] flex items-center bg-white w-full shrink-0 border-b border-slate-100">
                    <div className="flex-1">
                        {/* Unified onMenuClick handler */}
                        <Header 
                            onMenuClick={() => setIsMobileOpen(true)} 
                            onCartClick={() => setIsCartOpen(true)}
                        />
                    </div>
                </div>

                <main className="flex-1 p-0 overflow-y-auto custom-scrollbar">
                    <motion.div
                        key={url.split('?')[0]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 0.3, 
                            ease: [0.22, 1, 0.36, 1] 
                        }}
                        className="w-full min-w-0"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>

            {/* Global Shopping Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}
