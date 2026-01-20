import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Settings,
    Heart,
    Bookmark,
    ClipboardCheck,
    History,
    RotateCcw,
    BookOpen,
    Headset,
    FileText,
    ShieldCheck,
    LogOut,
} from "lucide-react";

const MENU = [
    {
        title: "MAIN",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { label: "Shop Parts", icon: Settings, path: "/parts" },
        ],
    },
    {
        title: "SHOPPING",
        items: [
            { label: "Favourites", icon: Heart, path: "/favourites" },
            { label: "Saved Quotes", icon: Bookmark, path: "/quotes" },
        ],
    },
    {
        title: "ORDERS",
        items: [
            {
                label: "Active Orders",
                icon: ClipboardCheck,
                path: "/orders/active",
            },
            { label: "Order History", icon: History, path: "/orders/history" },
            { label: "Returns", icon: RotateCcw, path: "/orders/return" },
        ],
    },
    {
        title: "SUPPORT",
        items: [
            { label: "Blog", icon: BookOpen, path: "/blogs" },
            { label: "Contact Us", icon: Headset, path: "/contact" },
        ],
    },
    {
        title: "LEGAL",
        items: [
            { label: "Terms & Service", icon: FileText, path: "/terms" },
            { label: "Privacy Policy", icon: ShieldCheck, path: "/privacy" },
        ],
    },
];

export default function Sidebar({ isCollapsed }) {
    const { url } = usePage();

    return (
        <aside
            className={`flex flex-col pt-4 h-full bg-white border-r transition-all duration-300 ${
                isCollapsed ? "w-[80px]" : "w-[280px]"
            }`}
        >
            {/* Logo Section - Reduced padding */}
            <div
                className={`flex items-center py-5 ${
                    isCollapsed ? "justify-center" : "pl-8 pr-4"
                }`}
            >
                <img
                    src="img/logo.png"
                    alt="Logo"
                    className={`transition-all duration-300 ${
                        isCollapsed ? "h-6" : "h-9"
                    }`}
                />
            </div>

            {/* Navigation - Reduced space-y from 5 to 3 */}
            <nav className="flex-1 pl-4 pr-3 mt-6 space-y-3 overflow-y-auto">
                {MENU.map((group) => (
                    <div key={group.title}>
                        {!isCollapsed && (
                            /* Group Title - Reduced margin bottom */
                            <p className="pl-2 mb-1.5 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                {group.title}
                            </p>
                        )}

                        {/* Items Container - Reduced space-y from 1.5 to 1 */}
                        <div className="space-y-0.5">
                            {group.items.map(({ label, icon: Icon, path }) => {
                                const active = url.startsWith(path);

                                return (
                                    <Link
                                        key={label}
                                        href={path}
                                        className={`
                                            group flex items-center transition-all duration-200
                                            ${
                                                isCollapsed
                                                    ? "justify-center px-2"
                                                    : "gap-3 pl-6 pr-4"
                                            }
                                            py-2.5
                                            rounded-[12px]
                                            ${
                                                active
                                                    ? "bg-[#fceceb] text-[#a80000] font-semibold border-l-[4px] border-[#a80000]"
                                                    : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        <Icon
                                            size={18}
                                            className="text-current transition-transform duration-200 group-hover:scale-105"
                                        />

                                        {!isCollapsed && (
                                            <span className="text-[14px] tracking-tight">
                                                {label}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Logout - Reduced padding and margin */}
                <button className="group flex items-center gap-3 pl-6 pr-4 py-2.5 mt-2 w-full text-red-600 font-medium hover:bg-red-50 rounded-[12px] transition-all duration-200">
                    <LogOut
                        size={18}
                        className="transition-transform duration-200"
                    />
                    {!isCollapsed && (
                        <span className="text-[14px]">Log Out</span>
                    )}
                </button>
            </nav>
        </aside>
    );
}
