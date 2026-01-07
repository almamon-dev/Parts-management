import React, { useState } from "react";
import Header from "../Components/Navigation/User/Header";
import Sidebar from "../Components/Navigation/User/Sidebar";
import { Menu, X } from "lucide-react";

export default function UserLayout({ children }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F9F9F9] overflow-hidden font-sans">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[55] lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Section - Fixed Width */}
            <aside
                className={`fixed inset-y-0 left-0 z-[60] transition-all duration-300 ease-in-out flex flex-col w-64
                    ${
                        isMobileOpen
                            ? "translate-x-0 shadow-2xl"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute right-4 top-5 p-1 text-gray-500 hover:text-orange-500"
                >
                    <X size={20} />
                </button>

                {/* Sidebar Navigation Items */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {/* Passed isCollapsed={false} since we no longer collapse */}
                    <Sidebar isCollapsed={false} />
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                <div className="flex items-center bg-white border-b border-gray-100 lg:border-none w-full shrink-0">
                    {/* Mobile Hamburger Menu */}
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-4 lg:hidden text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1">
                        <Header />
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F9F9F9]">
                    <div className="w-full mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}
