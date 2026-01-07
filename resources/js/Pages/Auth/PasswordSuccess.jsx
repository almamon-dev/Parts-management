import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import { LucideMoveRight } from "lucide-react";

export default function PasswordSuccess() {
    return (
        <div
            className="min-h-screen py-10 flex items-center justify-center bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: "url('/img/otp-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <Head title="Success" />

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-[712px] min-h-[600px] md:min-h-[733px] mx-4 text-center text-white bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[60px] p-8 md:p-[64px] flex flex-col justify-center items-center overflow-hidden">
                {/* Honeycomb / Decorative Patterns from Image */}
                <img
                    src="/img/10.png"
                    className="absolute top-0 left-0 w-[250px] opacity-30 pointer-events-none"
                    alt=""
                />
                <img
                    src="/img/11.png"
                    className="absolute top-0 right-0 w-[250px] opacity-30 pointer-events-none"
                    alt=""
                />

                <div className="relative w-full flex flex-col items-center">
                    {/* 3D Success Icon Container */}
                    <div className="relative mb-12">
                        <img
                            src="/img/success.png" // Use the 3D green checkmark image
                            alt="Success"
                            className="h-40 w-40 md:h-52 md:w-52 object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-[#FFF] font-[Figtree] text-[32px]">
                            Password Changed Successfully
                        </h2>
                        <div className="px-6 py-2 rounded-lg">
                            <p className="leading-[27px]">
                                You're all set! Your password has been updated
                                welcome back securely.
                            </p>
                        </div>
                    </div>

                    {/* Red Action Button */}
                    <Link
                        href={route("dashboard")} // Updated to Go to Dashboard
                        className="group flex items-center justify-between bg-[#B20000] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 w-full max-w-[380px] text-xl shadow-lg"
                    >
                        <span className="flex-1 text-center">
                            Go to Dashboard
                        </span>
                        <div className="bg-white/20 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                            <LucideMoveRight className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
