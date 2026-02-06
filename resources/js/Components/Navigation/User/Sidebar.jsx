import React, { useMemo, memo } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    LayoutDashboard,
    Search,
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
import { motion, AnimatePresence } from "framer-motion";

const MENU = [
    {
        title: "MAIN",
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                path: route("dashboard"),
            },
            { label: "Shop Parts", icon: Search, path: route("parts.index") },
        ],
    },
    {
        title: "SHOPPING",
        items: [
            {
                label: "Favourites",
                icon: Heart,
                path: route("favourites.index"),
            },
            {
                label: "Saved Quotes",
                icon: Bookmark,
                path: route("quotes.index"),
            },
        ],
    },
    {
        title: "ORDERS",
        items: [
            {
                label: "Active Orders",
                icon: ClipboardCheck,
                path: route("orders.active"),
            },
            {
                label: "Order History",
                icon: History,
                path: route("orders.history"),
            },
            {
                label: "Return History",
                icon: RotateCcw,
                path: route("orders.returns.index"),
            },
        ],
    },
    {
        title: "SUPPORT",
        items: [
            { label: "Blog", icon: BookOpen, path: "/blogs" },
            {
                label: "Contact Us",
                icon: Headset,
                path: route("contact.index"),
            },
            {
                label: "Profile Settings",
                icon: Settings,
                path: route("settings.index"),
            },
        ],
    },

    {
        title: "LEGAL",
        items: [
            {
                label: "Terms & Service",
                icon: FileText,
                path: route("terms.index"),
            },
            {
                label: "Privacy Policy",
                icon: ShieldCheck,
                path: route("privacy.index"),
            },
            {
                label: "Return Policy",
                icon: RotateCcw,
                path: route("return-policy.index"),
            },
        ],
    },
];

const SidebarItem = memo(
    ({ label, icon: Icon, path, currentPath, isCollapsed }) => {
        const isActive = useMemo(() => {
            try {
                const targetPath = path.startsWith("http")
                    ? new URL(path).pathname
                    : path;
                return currentPath === targetPath;
            } catch (e) {
                return currentPath === path;
            }
        }, [path, currentPath]);

        return (
            <Link
                href={path}
                className={`
                group flex items-center transition-all duration-200 relative
                ${isCollapsed ? "justify-center px-1" : "gap-2.5 pl-4 pr-4"}
                py-2
                rounded-[16px]
                ${
                    isActive
                        ? "bg-[#AD0100]/10 text-[#AD0100] font-bold border-l-[4px] border-[#AD0100]"
                        : "text-slate-600 hover:text-[#AD0100] hover:bg-slate-50 border-l-[4px] border-transparent"
                }
            `}
            >
                <Icon
                    className={`${isActive ? "text-[#AD0100]" : "text-slate-400"} w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110`}
                    strokeWidth={isActive ? 2.5 : 2}
                />

                {!isCollapsed && (
                    <span className="text-[14px] tracking-tight">{label}</span>
                )}
            </Link>
        );
    },
);

function Sidebar({ isCollapsed }) {
    const { url } = usePage();
    const currentPath = useMemo(() => url.split("?")[0], [url]);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="flex flex-col h-full bg-white pl-4 font-sans">
            {/* Logo Section */}
            <div
                className={`flex items-center py-2 lg:py-6 ${
                    isCollapsed ? "justify-center" : "pl-6 pr-4"
                }`}
            >
                <img
                    src="/img/logo.png"
                    alt="Logo"
                    className={`transition-all duration-300 ${
                        isCollapsed ? "h-5 lg:h-6" : "h-7 lg:h-9"
                    }`}
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 pr-4 mt-2 space-y-2 overflow-y-auto custom-scrollbar pb-10">
                {MENU.map((group) => (
                    <div key={group.title} className="space-y-0.5">
                        {!isCollapsed && (
                            <p className="pl-4 mb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] opacity-80 mt-4 first:mt-0">
                                {group.title}
                            </p>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <SidebarItem
                                    key={item.label}
                                    {...item}
                                    currentPath={currentPath}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout */}
                <div className="pt-2 border-t border-slate-50 mt-4">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2.5 pl-4 pr-4 py-2 w-full text-red-500 font-bold hover:bg-red-50 rounded-[16px] transition-all duration-300"
                    >
                        <LogOut className="w-[18px] h-[18px] transition-transform duration-200" />
                        {!isCollapsed && (
                            <span className="text-[14px] tracking-tight">
                                Log Out
                            </span>
                        )}
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default memo(Sidebar);
