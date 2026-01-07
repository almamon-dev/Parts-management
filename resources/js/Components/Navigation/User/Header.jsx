import React from "react";
import { Search, ShoppingCart, Bell, ChevronDown, Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
    return (
        <header className="h-24 bg-white flex items-center justify-between px-10 border-b border-gray-100">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-6">
                {/* Mobile Menu */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-gray-100"
                >
                    <Menu size={24} />
                </button>

                {/* Welcome Text */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome back, Bay Mechanic Shop
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Here's what's happening with your auto parts orders
                        today.
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden xl:block">
                    <Search
                        size={20}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-red-700"
                    />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="w-[520px] pl-12 pr-4 py-3 rounded-full bg-gray-50 border border-gray-100 text-slate-500 focus:outline-none"
                    />
                </div>

                {/* Icons */}
                <div className="flex items-center gap-3">
                    {[{ Icon: ShoppingCart }, { Icon: Bell }].map(
                        ({ Icon }, index) => (
                            <button
                                key={index}
                                className="relative p-4 rounded-full bg-gray-50 text-red-700 hover:bg-gray-100 transition"
                            >
                                <Icon size={22} />
                                <span className="absolute top-3 right-3 w-3 h-3 bg-orange-400 border-2 border-white rounded-full" />
                            </button>
                        )
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 cursor-pointer">
                    <img
                        src="https://i.pravatar.cc/150?u=jane"
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    <div className="leading-tight">
                        <p className="text-base font-bold text-slate-900">
                            Jane Morgan
                        </p>
                        <p className="text-sm text-slate-500">
                            janemorgan@gmail.com
                        </p>
                    </div>

                    <ChevronDown size={20} className="ml-4 text-slate-800" />
                </div>
            </div>
        </header>
    );
};

export default Header;
