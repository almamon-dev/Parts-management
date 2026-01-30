import React, { useState, useRef, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Search, Bell, ChevronDown, Menu, User, LogOut } from "lucide-react";

const Header = ({ onMenuClick }) => {
    const { auth } = usePage().props;
    const user = auth.user;
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
                        Welcome, {user.first_name} {user.last_name}
                    </h1>
                    <p className="hidden sm:block text-xs md:text-sm text-slate-400 mt-0.5 md:mt-1 truncate">
                        Tracking auto parts orders today.
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                {/* Notification Bell */}
                {/* <button className="relative p-2.5 md:p-3 rounded-full bg-gray-50 text-slate-600 hover:bg-gray-100 transition shrink-0">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF9F43] border-2 border-white rounded-full" />
                </button> */}

                {/* Profile Dropdown */}
                <div ref={dropdownRef} className="relative shrink-0">
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 p-1 md:px-3 md:py-1.5 rounded-full bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition"
                    >
                        {user.profile_photo ? (
                            <img
                                src={`/${user.profile_photo}`}
                                alt="User"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
                            />
                        ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FF9F43]/10 flex items-center justify-center text-[#FF9F43]">
                                <User size={20} />
                            </div>
                        )}

                        {/* Text hidden on mobile */}
                        <div className="leading-tight hidden md:block">
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[100px]">
                                {user.first_name} {user.last_name}
                            </p>
                            <p className="text-[11px] text-[#FF9F43] font-bold uppercase tracking-wider truncate max-w-[120px]">
                                {user.user_type || 'Admin'}
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
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {user.email}
                                </p>
                            </div>

                            <Link 
                                href="/profile-settings"
                                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                onClick={() => setOpen(false)}
                            >
                                <User size={18} className="text-slate-400" />
                                <span>My Profile</span>
                            </Link>

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
