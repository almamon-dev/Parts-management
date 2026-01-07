import * as React from "react";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    LucideKeyRound,
    LucideEye,
    LucideEyeOff,
    LucideArrowRight,
} from "lucide-react";
import { Input } from "@/Components/ui/Input"; // Ensure this path is correct

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            token: token,
            email: email,
            password: "",
            password_confirmation: "",
        });

    // Unified handler to update data and clear field-specific errors
    const handleChange = (field, value) => {
        setData(field, value);
        if (errors[field]) {
            clearErrors(field);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("password.update"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div
            className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
            style={{ backgroundImage: "url('/img/otp-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <Head title="Reset Password" />

            <div className="relative z-10 w-full max-w-[550px] mx-4 text-white bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[40px] p-8 md:p-12 text-center overflow-hidden">
                {/* Background Patterns */}
                <img
                    src="/img/10.png"
                    className="absolute top-[16px] left-[22px] w-[200px] opacity-40 pointer-events-none"
                    alt=""
                />
                <img
                    src="/img/11.png"
                    className="absolute top-[16px] right-[22px] w-[200px] opacity-40 pointer-events-none"
                    alt=""
                />

                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        Setup New Password
                    </h2>
                    <p className="text-gray-300 opacity-90 mb-10 text-lg">
                        Set a strong password to secure your account.
                    </p>

                    <form onSubmit={submit} className="space-y-6">
                        {/* New Password Input */}
                        <div className="relative group">
                            <Input
                                label="New Password*"
                                icon={LucideKeyRound}
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                error={errors.password}
                                placeholder="************"
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[48px] text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <LucideEyeOff size={20} />
                                ) : (
                                    <LucideEye size={20} />
                                )}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative group">
                            <Input
                                label="Confirm New Password*"
                                icon={LucideKeyRound}
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                error={
                                    errors.password_confirmation || errors.email
                                } // Shows email errors here if they exist
                                placeholder="************"
                                onChange={(e) =>
                                    handleChange(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-[48px] text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <LucideEyeOff size={20} />
                                ) : (
                                    <LucideEye size={20} />
                                )}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                className="group w-full h-[60px] bg-[#AD0100] hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all shadow-xl disabled:opacity-50"
                                disabled={processing}
                            >
                                <span className="text-xl font-bold mr-3">
                                    {processing
                                        ? "Updating..."
                                        : "Reset Password"}
                                </span>
                                {!processing && (
                                    <div className="bg-white/20 rounded-full p-1.5 group-hover:bg-white/30 transition-colors">
                                        <LucideArrowRight size={20} />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
