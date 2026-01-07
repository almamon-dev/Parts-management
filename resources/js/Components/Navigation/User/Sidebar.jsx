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
            { label: "Parts", icon: Settings, path: "/parts" },
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
            { label: "Returns", icon: RotateCcw, path: "/returns" },
        ],
    },
    {
        title: "SUPPORT",
        items: [
            { label: "Blog", icon: BookOpen, path: "/blog" },
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
            className={`flex flex-col h-full bg-white border-r transition-all duration-300 ${
                isCollapsed ? "w-[100px]" : "w-[300px]"
            }`}
        >
            {/* Logo */}
            <div
                className={`flex items-center py-10 ${
                    isCollapsed ? "justify-center" : "px-10"
                }`}
            >
                <img
                    src="img/logo.png"
                    alt="Logo"
                    className={`transition-all ${isCollapsed ? "h-8" : "h-12"}`}
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
                {MENU.map((group) => (
                    <div key={group.title}>
                        {!isCollapsed && (
                            <p className="px-4 mb-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                {group.title}
                            </p>
                        )}

                        <div className="space-y-1">
                            {group.items.map(({ label, icon: Icon, path }) => {
                                const active = url.startsWith(path);

                                return (
                                    <Link
                                        key={label}
                                        href={path}
                                        className={`group relative flex items-center py-4 rounded-[22px] transition-all ${
                                            isCollapsed
                                                ? "justify-center"
                                                : "gap-4 px-6"
                                        } ${
                                            active
                                                ? "bg-red-50 text-red-600 font-bold"
                                                : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {/* Active Indicator */}
                                        {active && (
                                            <span className="absolute left-0 top-1/2 h-[60%] w-[6px] -translate-y-1/2 rounded-r-full bg-red-600" />
                                        )}

                                        {/* Icon inherits text color */}
                                        <Icon
                                            size={22}
                                            className="text-current"
                                        />

                                        {!isCollapsed && (
                                            <span className="text-[16px]">
                                                {label}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Logout */}
                <button className="flex items-center gap-4 px-6 py-4 mt-4 w-full text-red-600 font-bold hover:bg-red-50 rounded-[22px] transition-all">
                    <LogOut size={22} className="text-current" />
                    {!isCollapsed && <span>Log Out</span>}
                </button>
            </nav>
        </aside>
    );
}
