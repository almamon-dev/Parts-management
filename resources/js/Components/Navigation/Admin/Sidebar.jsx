import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ShoppingCart,
    RefreshCw,
    Users,
    Tag,
    FileText,
    ChevronRight,
    Settings,
    PlusCircle,
    List,
    UserCircle,
    Mail,
    CreditCard,
    Headset,
    Image as ImageIcon,
    X,
    Globe,
} from "lucide-react";

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { url } = usePage();
    const { settings } = usePage().props;

    const [openMenus, setOpenMenus] = useState({
        leads: false,
        products: false,
        blogs: false,
        settings: false,
    });

    const toggleMenu = (key) => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const checkActive = (item) => {
        try {
            // Priority 1: Use Ziggy's route().current() if available
            if (
                item.activeIdentifier &&
                window.route &&
                window.route().current
            ) {
                return window.route().current(item.activeIdentifier);
            }

            // Priority 2: Fallback to URL matching
            if (item.children) {
                return item.children.some((child) =>
                    url.startsWith(
                        new URL(child.path, window.location.origin).pathname,
                    ),
                );
            }

            // Exact match for dashboard, prefix for others
            const currentPath = url.split("?")[0];
            const itemPath = new URL(item.path, window.location.origin)
                .pathname;

            if (item.label === "Dashboard") {
                return currentPath === itemPath;
            }
            return (
                currentPath === itemPath ||
                (itemPath !== "/" && currentPath.startsWith(itemPath + "/"))
            );
        } catch (e) {
            return false;
        }
    };

    const menuItems = [
        {
            label: "Dashboard",
            path: route("dashboard"),
            icon: <LayoutDashboard size={18} />,
            activeIdentifier: "dashboard",
        },
        {
            label: "Orders",
            path: route("admin.orders.index"),
            icon: <ShoppingCart size={18} />,
            activeIdentifier: "admin.orders.*",
        },
        {
            label: "Categories",
            path: route("admin.categories.index"),
            icon: <List size={18} />,
            activeIdentifier: "admin.categories.*",
        },
        {
            label: "Returns",
            path: route("admin.returns.index"),
            icon: <RefreshCw size={18} />,
            activeIdentifier: "admin.returns.*",
        },
        {
            label: "Leads",
            path: route("admin.leads.index"),
            icon: <Users size={18} />,
            key: "leads",
            activeIdentifier: "admin.leads.*",
            children: [
                {
                    label: "All Leads",
                    path: route("admin.leads.index"),
                    icon: <List size={14} />,
                },
                {
                    label: "Add Lead",
                    path: route("admin.leads.create"),
                    icon: <PlusCircle size={14} />,
                },
            ],
        },
        {
            label: "Customers - B2B",
            path: route("admin.customers.index"),
            icon: <Users size={18} />,
            activeIdentifier: "admin.customers.*",
        },
        {
            label: "Products",
            path: route("admin.products.index"),
            icon: <Tag size={18} />,
            key: "products",
            activeIdentifier: "admin.products.*",
            children: [
                {
                    label: "All Products",
                    path: route("admin.products.index"),
                    icon: <List size={14} />,
                },
                {
                    label: "Add Product",
                    path: route("admin.products.create"),
                    icon: <PlusCircle size={14} />,
                },
            ],
        },
        {
            label: "Blogs",
            path: route("admin.blogs.index"),
            icon: <FileText size={18} />,
            key: "blogs",
            activeIdentifier: "admin.blogs.*",
            children: [
                {
                    label: "All Blogs",
                    path: route("admin.blogs.index"),
                    icon: <List size={14} />,
                },
                {
                    label: "Add Blog",
                    path: route("admin.blogs.create"),
                    icon: <PlusCircle size={14} />,
                },
            ],
        },
        {
            label: "Support Tickets",
            path: route("admin.support.index"),
            icon: <Headset size={18} />,
            activeIdentifier: "admin.support.*",
        },
        {
            label: "Announcements",
            path: route("admin.announcements.index"),
            icon: <ImageIcon size={18} />,
            activeIdentifier: "admin.announcements.*",
        },
        {
            label: "Settings",
            path: route("admin.settings.index"),
            icon: <Settings size={18} />,
            key: "settings",
            activeIdentifier: "admin.settings.*",
            children: [
                {
                    label: "Profile Settings",
                    path: route("admin.settings.profile"),
                    icon: <UserCircle size={14} />,
                },
                {
                    label: "Site Configuration",
                    path: route("admin.settings.index"),
                    icon: <Globe size={14} />,
                },
                {
                    label: "Email Settings",
                    path: route("admin.settings.email"),
                    icon: <Mail size={14} />,
                },
                {
                    label: "Payment Settings",
                    path: route("admin.settings.payment"),
                    icon: <CreditCard size={14} />,
                },
            ],
        },
    ];

    // Auto-open menus based on active state
    useEffect(() => {
        menuItems.forEach((item) => {
            if (item.key && checkActive(item)) {
                setOpenMenus((prev) => ({ ...prev, [item.key]: true }));
            }
        });
    }, [url]);

    return (
        <div className="flex flex-col h-full bg-[#fcfcfc] border-r border-gray-100">
            {/* Logo Section */}
            <div
                className={`flex items-center h-20 shrink-0 ${
                    isCollapsed ? "justify-center" : "px-6"
                }`}
            >
                <img
                    src={
                        settings?.site_logo
                            ? `/${settings.site_logo}`
                            : "/img/logo.png"
                    }
                    alt="Logo"
                    className={`object-contain ${
                        isCollapsed ? "h-8 w-8" : "h-9"
                    }`}
                />
                {isMobileOpen && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden ml-auto p-2 text-gray-400"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-sidebar-scrollbar">
                {!isCollapsed && (
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">
                        Main Menu
                    </p>
                )}

                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = checkActive(item);

                        // Child active highlights
                        const isChildActive = (childPath) => {
                            try {
                                return (
                                    url ===
                                    new URL(childPath, window.location.origin)
                                        .pathname
                                );
                            } catch (e) {
                                return false;
                            }
                        };

                        return item.children ? (
                            <SidebarItem
                                key={item.key}
                                icon={item.icon}
                                label={item.label}
                                isCollapsed={isCollapsed}
                                hasChild
                                active={isActive}
                                isOpen={openMenus[item.key]}
                                onClick={() => toggleMenu(item.key)}
                            >
                                {!isCollapsed && (
                                    <div className="mt-1 space-y-1 ml-4 pl-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.path}
                                                className={`flex items-center gap-3 py-2 px-3 rounded-md text-sm transition-all ${
                                                    isChildActive(child.path)
                                                        ? "text-[#FF9F43] font-bold bg-[#FF9F43]/10"
                                                        : "text-slate-500 hover:text-[#FF9F43] hover:bg-gray-50"
                                                }`}
                                            >
                                                <span
                                                    className={`${
                                                        isChildActive(
                                                            child.path,
                                                        )
                                                            ? "text-[#FF9F43]"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {child.icon}
                                                </span>
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </SidebarItem>
                        ) : (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                path={item.path}
                                active={isActive}
                                isCollapsed={isCollapsed}
                            />
                        );
                    })}
                </div>
            </nav>
        </div>
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
    children,
}) => {
    const itemContent = (
        <div
            onClick={hasChild ? onClick : undefined}
            className={`flex items-center group cursor-pointer py-2.5 rounded-lg transition-all duration-200 ${
                isCollapsed ? "justify-center px-0" : "px-3"
            } ${
                active
                    ? "bg-[#FF9F43]/10 text-[#FF9F43] font-semibold"
                    : "text-slate-600 hover:bg-gray-50 hover:text-[#FF9F43]"
            }`}
        >
            <div
                className={`shrink-0 transition-colors ${
                    active ? "text-[#FF9F43]" : "group-hover:text-[#FF9F43]"
                }`}
            >
                {icon}
            </div>
            {!isCollapsed && (
                <span className="ml-3 text-[13.5px] font-medium">{label}</span>
            )}

            {hasChild && !isCollapsed && (
                <div className="ml-auto">
                    <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${
                            isOpen
                                ? "rotate-90 text-[#FF9F43]"
                                : "text-gray-400"
                        }`}
                    />
                </div>
            )}
        </div>
    );

    return (
        <div>
            {hasChild ? itemContent : <Link href={path}>{itemContent}</Link>}
            {isOpen && children}
        </div>
    );
};

export default Sidebar;
