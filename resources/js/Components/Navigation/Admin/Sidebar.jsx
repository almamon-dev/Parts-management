import React, { useState, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Package,
    History,
    Tags,
    ChevronRight,
    ChevronDown,
    X,
} from "lucide-react";

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const [isScrollingVisible, setIsScrollingVisible] = useState(false);
    const [openMenus, setOpenMenus] = useState({ products: false });
    const scrollTimeoutRef = useRef(null);
    const { url } = usePage();

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <nav
                className={`
                    fixed inset-y-0 left-0 z-[70] flex flex-col bg-white border-r border-gray-100 transition-all duration-300 transform
                    ${
                        isMobileOpen
                            ? "translate-x-0 w-[280px]"
                            : "-translate-x-full lg:translate-x-0"
                    }
                    lg:relative
                    ${isCollapsed ? "lg:w-20" : "lg:w-[260px]"}
                    overflow-y-auto overflow-x-hidden p-3 space-y-6 custom-sidebar-scrollbar
                `}
            >
                {/* Main Section */}
                <section>
                    {(!isCollapsed || isMobileOpen) && (
                        <p className="text-[11px] font-bold text-[#1B2838] uppercase tracking-wider mb-3 px-3">
                            Main
                        </p>
                    )}
                    <div className="space-y-1">
                        <SidebarItem
                            icon={<LayoutDashboard size={19} />}
                            label="Dashboard"
                            path="/dashboard"
                            active={url === "/dashboard"}
                            isCollapsed={isCollapsed && !isMobileOpen}
                        />
                    </div>
                </section>

                {/* Inventory Section */}
                <section className="border-gray-100">
                    <SidebarItem
                        icon={<Tags size={19} />}
                        label="Category"
                        path="/categories"
                        active={url.startsWith("/categories")}
                        isCollapsed={isCollapsed && !isMobileOpen}
                    />
                </section>
            </nav>
        </>
    );
};

const SidebarItem = ({
    icon,
    label,
    path,
    active,
    isCollapsed,
    hasChild,
    isOpen,
    onClick,
}) => {
    const content = (
        <div className="flex items-center gap-3">
            <span
                className={`shrink-0 ${
                    active
                        ? "text-[#F97316]"
                        : "text-[#55606C] group-hover:text-[#F97316]"
                }`}
            >
                {icon}
            </span>
            {!isCollapsed && (
                <span className="text-[14px] font-medium whitespace-nowrap">
                    {label}
                </span>
            )}
        </div>
    );

    const classes = `flex items-center ${
        isCollapsed ? "justify-center" : "justify-between"
    } p-2.5 rounded-lg cursor-pointer transition-all group ${
        active
            ? "bg-[#FFF7ED] text-[#F97316]"
            : "text-[#55606C] hover:bg-[#F8F9FA] hover:text-[#F97316]"
    }`;

    if (hasChild && !isCollapsed) {
        return (
            <div onClick={onClick} className={classes}>
                {content}
                {isOpen ? (
                    <ChevronDown size={14} />
                ) : (
                    <ChevronRight size={14} />
                )}
            </div>
        );
    }
    return (
        <Link href={path} className={classes}>
            {content}
        </Link>
    );
};

const SubItem = ({ label, path, active }) => (
    <Link
        href={path}
        className={`block p-2 text-[13px] rounded-md transition-all ${
            active
                ? "text-[#F97316] font-semibold"
                : "text-[#55606C] hover:text-[#F97316] hover:bg-gray-50"
        }`}
    >
        • {label}
    </Link>
);

export default Sidebar;
