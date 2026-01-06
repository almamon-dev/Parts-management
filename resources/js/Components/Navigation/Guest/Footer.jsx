import React from "react";

export default function Footer() {
    return (
        <footer className="bg-[#0b0b0b] text-gray-400 py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand & App Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-white font-bold text-xl">
                            DREAMS{" "}
                            <span className="text-gray-500 font-normal">
                                RENT
                            </span>
                        </span>
                    </div>
                    <p className="text-sm mb-6 leading-relaxed">
                        We offer a diverse fleet of vehicles to suit every need,
                        including compact cars, sedans, SUVs and luxury
                        vehicles.
                    </p>
                    <div className="flex gap-2">
                        <img
                            src="/apple-store.png"
                            alt="App Store"
                            className="h-10 cursor-pointer"
                        />
                        <img
                            src="/google-play.png"
                            alt="Play Store"
                            className="h-10 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>My account</li>
                        <li>Campaigns</li>
                        <li>Dreams rent Dealers</li>
                        <li>Deals and Incentive</li>
                    </ul>
                </div>

                {/* Pages */}
                <div>
                    <h4 className="text-white font-bold mb-4">Pages</h4>
                    <ul className="space-y-2 text-sm">
                        <li>About Us</li>
                        <li>Become a Partner</li>
                        <li>Faq's</li>
                        <li>Testimonials</li>
                    </ul>
                </div>

                {/* Useful Links */}
                <div>
                    <h4 className="text-white font-bold mb-4">Useful Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>My account</li>
                        <li>Campaigns</li>
                        <li>Financial Services</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs">
                    Copyright © 2025 Dreams Rent. All Rights Reserved.
                </p>
                <div className="flex gap-4">
                    <img src="/payments.png" alt="Payments" className="h-6" />
                </div>
                <div className="flex gap-4 text-xs">
                    <span>Privacy</span> / <span>Terms & Condition</span> /{" "}
                    <span>Refund Policy</span>
                </div>
            </div>
        </footer>
    );
}
