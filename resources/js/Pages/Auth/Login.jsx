import { useState, useRef } from "react";
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

export default function Login({ isAdmin = false }) {
    // Refs for input handling
    const passwordInput = useRef(null);

    // Toggle password visibility state
    const [showPassword, setShowPassword] = useState(false);

    // Inertia form state & helpers
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        setError,
    } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // LIVE VALIDATION HANDLER
    const handleChange = (field, value) => {
        setData(field, value);
        if (errors[field]) {
            clearErrors(field);
        }
    };

    // Form submit handler
    const submit = (e) => {
        e.preventDefault();

        // Frontend Validation
        clearErrors();

        if (!data.email.trim()) {
            setError("email", "Username or email is required.");
            return;
        }

        // AUTO-FOCUS PASSWORD LOGIC
        // If email is provided but password is empty, focus password field instead of submitting
        if (!data.password) {
            passwordInput.current?.focus();
            return;
        }

        if (data.password.length < 6) {
            setError("password", "Password must be at least 6 characters.");
            return;
        }

        // Send login request
        post(route(isAdmin ? "admin.login" : "login"), {
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
            <Head title={isAdmin ? "Admin Log in" : "Log in"} />

            {/* Glassmorphism login card */}
            <div className="relative z-10 w-full max-w-[600px] mx-4 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[40px] p-8 md:p-12 flex flex-col justify-center text-white overflow-hidden">
                {/* Decorative Hexagon Patterns */}
                <img
                    src="/img/10.png"
                    className="absolute top-5 left-5 w-[200px] opacity-20 pointer-events-none"
                    alt=""
                />
                <img
                    src="/img/11.png"
                    className="absolute top-5 right-5 w-[200px] opacity-20 pointer-events-none"
                    alt=""
                />
                {/* Header section */}
                <div className="text-center mb-8">
                    <img
                        src="/img/logo.png"
                        className="h-14 mx-auto mb-5"
                        alt="Logo"
                    />
                    <h2 className="text-3xl font-bold mb-3">
                        {isAdmin
                            ? "Admin Login"
                            : "Welcome Back to Parts Panel"}
                    </h2>
                    <p className="text-base text-gray-200 max-w-[450px] mx-auto opacity-90">
                        {isAdmin
                            ? "Access the administrative dashboard to manage the marketplace."
                            : "Log in to access your personalized B2B car parts marketplace."}
                    </p>
                </div>

                {/* Login form */}
                <form onSubmit={submit} className="space-y-5">
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
                            ref={passwordInput}
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
                            className="absolute right-5 top-[50px] text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <LucideEye size={18} />
                            ) : (
                                <LucideEyeOff size={18} />
                            )}
                        </button>
                    </div>

                    {/* Forgot password link */}
                    <div className="flex justify-end !mt-2">
                        <Link
                            href={route("password.request")}
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit button & register link */}
                    <div className="flex flex-col items-center pt-4">
                        <button
                            type="submit"
                            disabled={processing || !data.email.trim()}
                            className="group w-full max-w-[240px] h-[56px] bg-[#AD0100] hover:bg-red-700 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#AD0100]"
                        >
                            <span className="text-xl font-bold mr-3">
                                Login
                            </span>
                            <span className="bg-white/20 p-2.5 rounded-full group-hover:bg-white/30 transition-colors">
                                <LucideMoveRight size={20} />
                            </span>
                        </button>

                        {/* Sign up link - Only show for normal users */}
                        {!isAdmin && (
                            <p className="mt-8">
                                <span className="text-gray-300">
                                    Didn't have an account?{" "}
                                </span>
                                <Link
                                    href={route("register")}
                                    className="text-white font-bold hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        )}
                        <div className="flex items-center mt-3 gap-2.5 text-[#00338d] font-semibold">
                            {/* Icon with a slight rotation to match the image */}
                            <Phone
                                size={20}
                                className="-rotate-12 stroke-[2.5px]"
                            />

                            <span className="text-lg">
                                Contact us +000 222 3334
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
