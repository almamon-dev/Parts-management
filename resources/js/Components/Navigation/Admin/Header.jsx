import React from "react";
import { Menu, Search, Bell, PlusCircle, Monitor } from "lucide-react";

const Header = ({ onMenuButtonClick }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuButtonClick}
                    className="p-2 text-gray-600 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="relative w-64 hidden md:block">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <button className="bg-orange-500 text-white p-2 md:px-4 md:py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                    <PlusCircle size={18} />
                    <span className="hidden sm:inline">Add New</span>
                </button>
                <button className="bg-[#1B2838] text-white p-2 md:px-4 md:py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Monitor size={18} />
                    <span className="hidden sm:inline">POS</span>
                </button>
                <div className="ml-2 border-l pl-3 border-gray-200">
                    <img
                        src="https://ui-avatars.com/api/?name=Admin"
                        alt="User"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-lg"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
