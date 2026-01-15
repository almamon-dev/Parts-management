import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";

import {
    LucideUser,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideMoveRight,
    Phone,
} from "lucide-react";

// Reusable Input component
import { Input } from "@/Components/ui/Input";

export default function Login() {
    // Toggle password visibility state
    const [showPassword, setShowPassword] = useState(false);

    // Inertia form state & helpers
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            email: "",
            password: "",
            remember: false,
        });

    // LIVE VALIDATION HANDLER
    // Updates field value and clears error when user types
    const handleChange = (field, value) => {
        setData(field, value);

        if (errors[field]) {
            clearErrors(field);
        }
    };

    // Form submit handler
    const submit = (e) => {
        e.preventDefault();

        // Send login request
        post(route("login"), {
            // Clear password field after submit
            onFinish: () => reset("password"),
        });
    };

    return (
        // Full screen background container
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans"
            style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Page title */}
            <Head title="Log in" />

            {/* Glassmorphism login card */}
            <div className="relative z-10 w-full max-w-[712px] min-h-[733px] mx-4 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[48px] p-8 md:p-[64px] flex flex-col justify-center text-white overflow-hidden">
                {/* Decorative background images */}
                <img
                    src="/img/10.png"
                    className="absolute top-4 left-6 w-[200px] opacity-40"
                    alt=""
                />
                <img
                    src="/img/11.png"
                    className="absolute top-4 right-6 w-[200px] opacity-40"
                    alt=""
                />

                {/* Header section */}
                <div className="text-center mb-10">
                    <img
                        src="/img/logo.png"
                        className="h-16 mx-auto mb-6"
                        alt="Logo"
                    />
                    <h2 className="text-4xl font-bold mb-4">
                        Welcome Back to Parts Panel
                    </h2>
                    <p className="text-lg text-gray-200 max-w-[500px] mx-auto">
                        Log in to access your personalized B2B car parts
                        marketplace.
                    </p>
                </div>

                {/* Login form */}
                <form onSubmit={submit} className="space-y-6">
                    {/* Email / Username input */}
                    <Input
                        label="Username / Email"
                        icon={LucideUser}
                        value={data.email}
                        error={errors.email}
                        placeholder="johndoe_123"
                        onChange={(e) => handleChange("email", e.target.value)}
                    />

                    {/* Password input with visibility toggle */}
                    <div className="relative">
                        <Input
                            label="Password*"
                            type={showPassword ? "text" : "password"}
                            icon={LucideLock}
                            value={data.password}
                            error={errors.password}
                            placeholder="********"
                            onChange={(e) =>
                                handleChange("password", e.target.value)
                            }
                            className="pr-14"
                        />

                        {/* Show / Hide password button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-[52px] text-gray-400 hover:text-white"
                        >
                            {showPassword ? (
                                <LucideEye size={20} />
                            ) : (
                                <LucideEyeOff size={20} />
                            )}
                        </button>
                    </div>

                    {/* Forgot password link */}
                    <div className="flex justify-end">
                        <Link
                            href={route("password.request")}
                            className="text-gray-300 hover:text-white"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit button & register link */}
                    <div className="flex flex-col items-center pt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="group w-[240px] h-[64px] bg-[#AD0100] hover:bg-red-700 rounded-full flex items-center justify-center shadow-xl transition"
                        >
                            <span className="text-[22px] font-bold mr-3">
                                Login
                            </span>
                            <span className="bg-white/20 p-3 rounded-full group-hover:bg-white/30">
                                <LucideMoveRight size={24} />
                            </span>
                        </button>

                        {/* Sign up link */}
                        <p className="mt-10">
                            <span className="text-gray-200">
                                Didn't have an account?{" "}
                            </span>
                            <Link
                                href={route("register")}
                                className="text-white font-bold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                        <div className="flex items-center mt-4 gap-3 text-[#00338d] font-semibold">
                            {/* Icon with a slight rotation to match the image */}
                            <Phone
                                size={24}
                                className="-rotate-12 stroke-[2.5px]"
                            />

                            <span className="text-xl">
                                Contact us +000 222 3334
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
