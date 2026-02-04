import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import {
    Search,
    ShoppingCart,
    Bell,
    ChevronDown,
    Menu,
    User,
    LogOut,
} from "lucide-react";

const Header = ({ onMenuClick, onCartClick }) => {
    const { props } = usePage();
    const cartCount = props.cart?.count || 0;
    const user = props.auth.user;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 md:h-24 bg-white flex items-center justify-between px-3 md:px-10 border-b border-gray-100 sticky top-0 z-[50]">
            <div className="flex items-center gap-2 md:gap-6 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-gray-100 transition-colors shrink-0"
                >
                    <Menu size={20} md:size={22} />
                </button>

                <div className="flex flex-col min-w-0">
                    <h1 className="text-base md:text-2xl font-bold text-slate-900 leading-tight truncate uppercase tracking-tight">
                        Inventory Catalog
                    </h1>
                    <p className="text-[10px] md:text-sm text-slate-400 mt-0.5 hidden sm:block leading-relaxed truncate font-medium">
                        Search and order premium auto parts online.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-6 shrink-0">
                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        onClick={onCartClick}
                        className="group relative p-2 md:p-3.5 rounded-full bg-[#F8F9FA] text-[#C52020] hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                    >
                        <ShoppingCart
                            size={18}
                            className="md:size-[22px] transition-transform group-hover:scale-110"
                        />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] md:h-[22px] md:min-w-[22px] items-center justify-center rounded-full bg-[#C52020] border-2 border-white text-[9px] md:text-[11px] font-extrabold text-white shadow-sm transform transition-transform group-hover:scale-110 group-active:scale-95 leading-none px-1">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* <button className="relative p-2 md:p-3.5 rounded-full bg-[#F8F9FA] text-slate-500 hover:bg-gray-100 transition-all duration-300">
                        <Bell size={18} className="md:size-[22px]" />
                        <span className="absolute top-2 md:top-2.5 right-2 md:right-2.5 w-2 md:w-2.5 h-2 md:h-2.5 bg-orange-400 border-2 border-white rounded-full" />
                    </button> */}
                </div>

                {/* Optimized User Profile Section matching Image */}
                {user ? (
                    <div ref={dropdownRef} className="relative">
                        <div
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 md:gap-4 p-1 md:p-1.5 pl-1 md:pl-2 pr-1 md:pr-6 rounded-full bg-[#f8f9fa] hover:bg-[#f1f3f5] cursor-pointer transition-all duration-300"
                        >
                            {/* Circular Avatar */}
                            <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0 border-2 border-white shadow-sm font-bold text-slate-500">
                                {user?.profile_photo ? (
                                    <img
                                        src={`/${user.profile_photo}`}
                                        className="w-full h-full object-cover"
                                        alt="Profile"
                                    />
                                ) : (
                                    <User size={16} md:size={20} />
                                )}
                            </div>

                            {/* Profile Info - Ultra Clean Typography */}
                            <div className="leading-tight hidden lg:block">
                                <p className="text-[14px] font-extrabold text-[#111827] tracking-tight truncate max-w-[100px]">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-[12px] text-[#718096] font-medium tracking-tight mt-0.5 truncate max-w-[100px]">
                                    {user?.email}
                                </p>
                            </div>

                            <ChevronDown
                                size={14}
                                strokeWidth={3}
                                className={`hidden md:block ml-0.5 text-[#64748B] transition-transform duration-300 ${
                                    open ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        {open && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-2">
                                {/* Mobile only info */}
                                <div className="px-5 py-4 border-b border-gray-50 lg:hidden">
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {user?.first_name} {user?.last_name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                        {user?.email}
                                    </p>
                                </div>

                                <Link
                                    href={route("settings.index")}
                                    onClick={() => setOpen(false)}
                                    className="w-full flex items-center gap-3 px-5 py-4 text-slate-700 hover:bg-gray-50 transition"
                                >
                                    <User
                                        size={18}
                                        className="text-slate-400"
                                    />
                                    <span className="font-semibold text-sm">
                                        My Profile
                                    </span>
                                </Link>

                                <div className="h-px bg-gray-100 mx-3" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition"
                                >
                                    <LogOut size={18} />
                                    <span className="font-semibold text-sm">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link
                            href={route("login")}
                            className="text-[11px] md:text-[13px] font-bold text-slate-600 hover:text-black uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route("register")}
                            className="text-[11px] md:text-[13px] font-bold bg-black text-white px-5 py-2.5 rounded-xl hover:bg-[#A80000] transition-all uppercase tracking-widest shadow-lg shadow-slate-200"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
