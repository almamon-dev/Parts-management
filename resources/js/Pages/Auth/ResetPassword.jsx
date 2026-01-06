import * as React from "react";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    LucideKeyRound,
    LucideEye,
    LucideEyeOff,
    LucideArrowRight,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Inertia useForm হুক
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        // এটি আপনার কন্ট্রোলারের resetPassword মেথডকে হিট করবে
        post(route("password.update"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div
            className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
            style={{ backgroundImage: "url('/img/otp-bg.jpg')" }} // আপনার প্রোজেক্টের ইমেজ পাথ অনুযায়ী
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <Head title="Reset Password" />

            <div className="relative z-10 w-full max-w-[550px] mx-4 text-white bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[40px] p-8 md:p-12 text-center overflow-hidden">
                {/* হেডার সেকশন */}
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Setup New Password
                </h2>
                <p className="text-gray-300 opacity-90 mb-10 text-lg leading-relaxed">
                    Set a strong password to secure your account and proceed to
                    dashboard.
                </p>

                <form onSubmit={submit} className="space-y-6 text-left">
                    {/* পাসওয়ার্ড ফিল্ড */}
                    <div className="space-y-2">
                        <label className="text-gray-200 text-sm ml-1 font-medium">
                            New Password*
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F2A922] transition-colors">
                                <LucideKeyRound size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full bg-black/40 border border-white/20 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-[#F2A922] focus:ring-1 focus:ring-[#F2A922] outline-none transition-all shadow-inner"
                                placeholder="************"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <LucideEyeOff size={20} />
                                ) : (
                                    <LucideEye size={20} />
                                )}
                            </button>
                        </div>
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* কনফার্ম পাসওয়ার্ড ফিল্ড */}
                    <div className="space-y-2">
                        <label className="text-gray-200 text-sm ml-1 font-medium">
                            Confirm New Password*
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F2A922] transition-colors">
                                <LucideKeyRound size={20} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className="w-full bg-black/40 border border-white/20 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-[#F2A922] focus:ring-1 focus:ring-[#F2A922] outline-none transition-all shadow-inner"
                                placeholder="************"
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <LucideEyeOff size={20} />
                                ) : (
                                    <LucideEye size={20} />
                                )}
                            </button>
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* সাবমিট বাটন */}
                    <div className="flex justify-center pt-6">
                        <PrimaryButton
                            className="group w-full md:w-[280px] h-[60px] bg-[#AD0100] hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all shadow-xl border-none disabled:opacity-70"
                            disabled={processing}
                        >
                            <span className="text-xl font-bold mr-3">
                                {processing ? "Updating..." : "Reset Password"}
                            </span>
                            {!processing && (
                                <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                                    <LucideArrowRight size={20} />
                                </div>
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
