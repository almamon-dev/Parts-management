import React, { useState } from "react";
import Header from "../Components/Navigation/Admin/Header";
import Sidebar from "../Components/Navigation/Admin/Sidebar";
import { ChevronLeft } from "lucide-react";

export default function AdminLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // sdiebar width control logic
    const showFullSidebar = !isCollapsed || isHovered;

    return (
        <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans selection:bg-[#FF9F43]/20">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden transition-all duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                onMouseEnter={() => isCollapsed && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`fixed inset-y-0 left-0 z-[60] bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col
                    ${
                        isMobileOpen
                            ? "translate-x-0 w-64 shadow-2xl"
                            : "-translate-x-full lg:translate-x-0"
                    }
                    ${showFullSidebar ? "lg:w-64" : "lg:w-[72px]"}`}
            >
                {/* Collapse Toggle Button - Desktop Only */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-8 z-[70] w-6 h-6 bg-white text-slate-400 border border-slate-200 rounded-full items-center justify-center shadow-sm hover:text-[#FF9F43] hover:border-[#FF9F43] hover:scale-110 transition-all duration-300 group"
                >
                    <ChevronLeft
                        size={12}
                        className={`${
                            isCollapsed ? "rotate-180" : ""
                        } transition-transform duration-500 ease-out group-hover:stroke-2`}
                    />
                </button>

                <Sidebar
                    isCollapsed={!showFullSidebar}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />
            </aside>

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                    showFullSidebar ? "lg:pl-64" : "lg:pl-[72px]"
                }`}
            >
                {/* Header: Navigation Bar */}
                <div className="sticky top-0 z-[50]">
                    <Header onMenuClick={() => setIsMobileOpen(true)} />
                </div>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
