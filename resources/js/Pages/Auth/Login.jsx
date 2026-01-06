import * as React from "react";
import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    LucideUser,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideMoveRight,
} from "lucide-react";

import PrimaryButton from "@/Components/PrimaryButton";

// --- Reusable Input Component within the file (অথবা আলাদা ফাইল থেকে ইমপোর্ট করতে পারেন) ---
const InputField = ({
    label,
    type,
    icon: Icon,
    value,
    onChange,
    error,
    placeholder,
    id,
    children,
}) => (
    <div className="w-full">
        {label && (
            <label
                htmlFor={id}
                className="text-lg font-semibold mb-2 block ml-1 text-gray-100"
            >
                {label}
            </label>
        )}
        <div className="relative">
            {Icon && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                    <Icon size={20} />
                </span>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`block w-full bg-black/40 border ${
                    error ? "border-red-500" : "border-white/20"
                } text-white rounded-[12px] focus:ring-2 focus:ring-red-600 focus:border-transparent h-[64px] ${
                    Icon ? "pl-14" : "pl-5"
                } pr-14 text-lg transition-all outline-none`}
            />
            {children}
        </div>
        {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
    </div>
);

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
            style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <Head title="Log in" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[712px] min-h-[733px] mx-4 text-center text-white bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[48px] p-8 md:p-[64px] flex flex-col justify-center overflow-hidden">
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

                <div className="relative w-full">
                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-10">
                        <img
                            src="img/logo.png"
                            alt="Parts Panel"
                            className="h-16 mb-6 object-contain"
                        />
                        <h2 className="text-4xl font-bold tracking-tight mb-4">
                            Welcome Back to Parts Panel
                        </h2>
                        <p className="text-[18px] text-gray-200 opacity-90 leading-relaxed max-w-[500px] mx-auto">
                            Log in to access your personalized B2B car parts
                            marketplace.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="text-left space-y-6 w-full"
                    >
                        {/* Email Field */}
                        <InputField
                            label="Username/ Email"
                            id="email"
                            type="email"
                            icon={LucideUser}
                            placeholder="johndoe_123"
                            value={data.email}
                            error={errors.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        {/* Password Field */}
                        <InputField
                            label="Password*"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            icon={LucideLock}
                            placeholder="********"
                            value={data.password}
                            error={errors.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        >
                            {/* Toggle Password Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <LucideEye size={20} />
                                ) : (
                                    <LucideEyeOff size={20} />
                                )}
                            </button>
                        </InputField>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end mt-2">
                            <Link
                                href={route("password.request")}
                                className="text-[16px] text-gray-300 hover:text-white transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <div className="flex flex-col items-center pt-6">
                            <PrimaryButton
                                className="group w-[240px] h-[64px] bg-[#AD0100] hover:bg-red-700 text-white rounded-[100px] flex items-center justify-center transition-all shadow-xl border-none"
                                disabled={processing}
                            >
                                <span className="text-[22px] font-bold mr-3">
                                    Login
                                </span>
                                <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                                    <LucideMoveRight size={24} />
                                </div>
                            </PrimaryButton>

                            <p className="mt-10">
                                <span className="text-gray-200">
                                    Didn't have an account?{" "}
                                </span>
                                <Link
                                    href={route("register")}
                                    className="text-white font-bold hover:underline underline-offset-4"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
