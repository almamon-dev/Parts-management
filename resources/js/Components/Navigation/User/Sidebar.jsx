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
                isCollapsed ? "w-[112px]" : "w-[320px]"
            }`}
        >
            {/* Logo */}
            <div
                className={`flex items-center py-8 ${
                    isCollapsed ? "justify-center" : "pl-10 pr-6"
                }`}
            >
                <img
                    src="img/logo.png"
                    alt="Logo"
                    className={`transition-all duration-300 ${
                        isCollapsed ? "h-7" : "h-11"
                    }`}
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 pl-6 pr-4 space-y-5 overflow-y-auto">
                {MENU.map((group) => (
                    <div key={group.title}>
                        {!isCollapsed && (
                            <p className="pl-2 mb-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                                {group.title}
                            </p>
                        )}

                        <div className="space-y-1.5">
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
                                            ? "justify-center px-5"
                                            : "gap-3 pl-8 pr-5"
                                    }
                                    py-3.5
                                    rounded-[18px]
                                    ${
                                        active
                                            ? "bg-[#fceceb] text-[#a80000] font-semibold border-l-[6px] border-[#a80000] shadow-sm"
                                            : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                                    }
                                    hover:scale-[1.02]
                                `}
                                    >
                                        <Icon
                                            size={20}
                                            className="text-current transition-transform duration-200 group-hover:scale-110"
                                        />

                                        {!isCollapsed && (
                                            <span className="text-[15px] tracking-wide">
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
                <button className="group flex items-center gap-3 pl-8 pr-5 py-3.5 mt-4 w-full text-red-600 font-semibold hover:bg-red-50 rounded-[20px] transition-all duration-200 hover:scale-[1.02]">
                    <LogOut
                        size={20}
                        className="transition-transform duration-200 group-hover:scale-110"
                    />
                    {!isCollapsed && (
                        <span className="text-[15px]">Log Out</span>
                    )}
                </button>
            </nav>
        </aside>
    );
}
