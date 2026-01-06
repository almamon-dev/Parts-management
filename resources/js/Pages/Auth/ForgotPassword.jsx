import * as React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { LucideMail, LucideMoveRight, LucideArrowLeft } from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";

// রিইউজেবল ইনপুট কম্পোনেন্ট (লগইন পেজের মতো)
const InputField = ({
    label,
    type,
    icon: Icon,
    value,
    onChange,
    error,
    placeholder,
    id,
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
                } pr-5 text-lg transition-all outline-none`}
            />
        </div>
        {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
    </div>
);

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
            style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            <Head title="Forgot Password" />

            {/* Forgot Password Card */}
            <div className="relative z-10 w-full max-w-[712px] min-h-[600px] mx-4 text-center text-white bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[48px] p-8 md:p-[64px] flex flex-col justify-center overflow-hidden">
                {/* Patterns */}
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

                {/* Back Button */}
                <Link
                    href={route("login")}
                    className="absolute top-8 left-8 flex items-center text-gray-300 hover:text-white transition-colors group"
                >
                    <LucideArrowLeft
                        size={20}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />
                    <span>Back</span>
                </Link>

                <div className="relative w-full">
                    {/* Header Section */}
                    <div className="flex flex-col items-center mb-10">
                        <img
                            src="img/logo.png"
                            alt="Parts Panel"
                            className="h-16 mb-6 object-contain"
                        />
                        <h2 className="text-4xl font-bold tracking-tight mb-4">
                            Reset Your Password
                        </h2>
                        <p className="text-[18px] text-gray-200 opacity-90 leading-relaxed max-w-[500px] mx-auto">
                            Enter your email address and we'll send you a link
                            to reset your password.
                        </p>
                    </div>

                    {/* Laravel Status Message (Success) */}
                    {status && (
                        <div className="mb-6 font-medium text-sm text-green-400 bg-green-900/30 p-4 rounded-lg border border-green-500/50">
                            {status}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="text-left space-y-8 w-full"
                    >
                        {/* Email Field */}
                        <InputField
                            label="Email Address"
                            id="email"
                            type="email"
                            icon={LucideMail}
                            placeholder="Enter your registered email"
                            value={data.email}
                            error={errors.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        {/* Submit Button */}
                        <div className="flex flex-col items-center pt-4">
                            <PrimaryButton
                                className="group w-[300px] h-[64px] bg-[#AD0100] hover:bg-red-700 text-white rounded-[100px] flex items-center justify-center transition-all shadow-xl border-none"
                                disabled={processing}
                            >
                                <span className="text-[20px] font-bold mr-3">
                                    Send OTP
                                </span>
                                <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                                    <LucideMoveRight size={24} />
                                </div>
                            </PrimaryButton>

                            <p className="mt-10 text-[16px]">
                                <span className="text-gray-200">
                                    Remember your password?{" "}
                                </span>
                                <Link
                                    href={route("login")}
                                    className="text-white font-bold hover:underline underline-offset-4"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
