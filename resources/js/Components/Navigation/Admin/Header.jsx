import React, { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Search, Bell, ChevronDown, Menu, User, LogOut } from "lucide-react";

const Header = ({ onMenuClick }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // Close dropdown on outside click
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
        <header className="h-20 lg:h-24 bg-white flex items-center justify-between px-4 md:px-8 lg:px-10 border-b border-gray-100 sticky top-0 z-30">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-gray-100 shrink-0"
                >
                    <Menu size={24} />
                </button>

                <div className="truncate">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 truncate">
                        Welcome, Bay Mechanic
                    </h1>
                    <p className="hidden sm:block text-xs md:text-sm text-slate-400 mt-0.5 md:mt-1 truncate">
                        Tracking auto parts orders today.
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                {/* Search Bar - Hidden on Mobile/Tablets, visible on XL screens */}
                <div className="relative hidden xl:block">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search parts..."
                        className="w-[300px] 2xl:w-[450px] pl-11 pr-4 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                </div>

                {/* Notification Bell */}
                <button className="relative p-2.5 md:p-3 rounded-full bg-gray-50 text-slate-600 hover:bg-gray-100 transition shrink-0">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div ref={dropdownRef} className="relative shrink-0">
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 p-1 md:px-3 md:py-1.5 rounded-full bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition"
                    >
                        <img
                            src="https://i.pravatar.cc/100?u=jane"
                            alt="User"
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
                        />

                        {/* Text hidden on mobile */}
                        <div className="leading-tight hidden md:block">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[100px]">
                                Jane Morgan
                            </p>
                            <p className="text-[11px] text-slate-500 truncate max-w-[120px]">
                                Admin
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`hidden sm:block text-slate-400 transition-transform duration-300 ${
                                open ? "rotate-180" : ""
                            }`}
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Mobile User Info inside dropdown */}
                            <div className="md:hidden px-5 py-3 bg-gray-50 border-b border-gray-100">
                                <p className="text-sm font-bold text-slate-900">
                                    Jane Morgan
                                </p>
                                <p className="text-xs text-slate-500">
                                    janemorgan@gmail.com
                                </p>
                            </div>

                            <button className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-slate-700 hover:bg-gray-50 transition">
                                <User size={18} className="text-slate-400" />
                                <span>My Profile</span>
                            </button>

                            <div className="h-px bg-gray-100" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                                <LogOut size={18} />
                                <span className="font-semibold">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
