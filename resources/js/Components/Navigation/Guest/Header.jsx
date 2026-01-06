import React, { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = ["Home", "Listings", "Pages", "Blog", "Dashboard"];

    return (
        <header className="bg-[#0f0f0f] text-white border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="bg-white p-1.5 rounded-lg">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </div>
                        <h1 className="text-xl font-black tracking-tighter flex items-center">
                            <span className="text-orange-500">DREAMS</span>
                            <span className="text-white ml-1">RENT</span>
                        </h1>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className={`text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                                    link === "Home"
                                        ? "text-orange-500"
                                        : "text-gray-300 hover:text-orange-500"
                                }`}
                            >
                                {link}
                                <svg
                                    className="w-3 h-3 mt-0.5 opacity-70"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </a>
                        ))}
                    </nav>

                    {/* Auth Buttons + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            <button className="text-gray-200 px-4 py-2 text-sm font-semibold hover:text-orange-500">
                                Sign In
                            </button>
                            <button className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-600 transition-all">
                                Sign Up
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                        >
                            <svg
                                className="h-7 w-7"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div
                className={`lg:hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 pt-2 pb-6 space-y-1 bg-[#141414] border-t border-gray-800">
                    {navLinks.map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-orange-500 border-b border-gray-800/50"
                        >
                            {link}
                        </a>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        <button className="w-full bg-gray-800 text-white px-5 py-3 rounded-lg font-bold">
                            Sign In
                        </button>
                        <button className="w-full bg-orange-500 text-white px-5 py-3 rounded-lg font-bold">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
