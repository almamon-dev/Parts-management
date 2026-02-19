import * as React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
    LucideMoveLeft,
    LucideMoveRight,
    LucideRefreshCcw,
} from "lucide-react";

export default function VerifyOTP({
    email = "",
    is_password_reset = false,
    resend_interval = 120,
    otp_length = 6,
    errors = {},
}) {
    const [timer, setTimer] = useState(resend_interval);
    const [otpError, setOtpError] = useState("");
    const inputRefs = useRef([]);

    const { data, setData, post, processing } = useForm({
        otp: Array(otp_length).fill(""),
        email: email,
        is_password_reset: is_password_reset,
    });

    // Mask Email Logic: use***@gmail.com
    const maskedEmail = useMemo(() => {
        if (!email.includes("@")) return email;
        const [user, domain] = email.split("@");
        return `${user.substring(0, 3)}***@${domain}`;
    }, [email]);

    // Timer Logic
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(
                () => setTimer((prev) => prev - 1),
                1000,
            );
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Sync Server Errors
    useEffect(() => {
        if (errors.otp) {
            setOtpError(errors.otp);
            setData("otp", Array(otp_length).fill(""));
            inputRefs.current[0]?.focus();
        }
    }, [errors]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...data.otp];
        newOtp[index] = value.slice(-1);
        setData("otp", newOtp);
        setOtpError("");

        if (value && index < otp_length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !data.otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // PASTE HANDLER: Fill all fields when a code is pasted
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData("text")
            .slice(0, otp_length)
            .split("");

        if (pasteData.length > 0) {
            const newOtp = [...data.otp];
            pasteData.forEach((char, i) => {
                if (i < otp_length && /^\d$/.test(char)) {
                    newOtp[i] = char;
                }
            });
            setData("otp", newOtp);
            setOtpError("");

            // Focus the last filled input or the first empty one
            const nextIndex =
                pasteData.length < otp_length
                    ? pasteData.length
                    : otp_length - 1;
            inputRefs.current[nextIndex]?.focus();
        }
    };

    const submit = (e) => {
        e?.preventDefault();
        post(route("otp.verify"), {
            onSuccess: () => setOtpError(""),
        });
    };

    const handleResend = () => {
        post(route("otp.resend"), {
            onSuccess: () => {
                setTimer(resend_interval);
                setData("otp", Array(otp_length).fill(""));
                inputRefs.current[0]?.focus();
            },
        });
    };

    return (
        <div
            className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center relative font-sans"
            style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <Head title="Verify OTP" />

            <div className="relative z-10 w-full max-w-[580px] mx-4 text-white bg-[#1A1A1A]/40 backdrop-blur-[32px] border border-white/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[48px] p-10 md:p-[64px] text-center overflow-hidden">
                {/* Decorative Hexagon Patterns */}
                <img
                    src="/img/10.png"
                    className="absolute top-0 left-0 w-[240px] opacity-20 pointer-events-none"
                    alt=""
                />
                <img
                    src="/img/11.png"
                    className="absolute top-0 right-0 w-[240px] opacity-20 pointer-events-none"
                    alt=""
                />

                {/* Internal Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

                <Link
                    href={route("login")}
                    className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-white transition-colors group z-20"
                >
                    <LucideMoveLeft
                        size={20}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-base font-medium">Back</span>
                </Link>

                <div className="relative z-10 mt-6 flex flex-col items-center">
                    <img src="/img/logo.png" alt="Logo" className="h-16 mb-6" />
                    <h2 className="text-3xl font-bold tracking-tight">
                        Verify Identity
                    </h2>
                    <p className="mt-3 text-gray-300 max-w-[320px] mx-auto leading-relaxed">
                        Enter the {otp_length}-digit code sent to <br />
                        <span className="font-bold text-[#F2A922] block mt-1">
                            {maskedEmail}
                        </span>
                    </p>

                    <form onSubmit={submit} className="w-full mt-10 space-y-8">
                        <div className="flex justify-center gap-2 md:gap-3">
                            {data.otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) =>
                                        (inputRefs.current[index] = el)
                                    }
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(index, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`w-10 h-12 md:w-14 md:h-16 bg-black/40 border-2 rounded-xl text-center text-2xl font-bold focus:border-[#F2A922] focus:ring-1 focus:ring-[#F2A922]/20 outline-none transition-all ${
                                        otpError
                                            ? "border-red-500 shadow-lg shadow-red-500/10"
                                            : "border-white/10 hover:border-white/30"
                                    }`}
                                />
                            ))}
                        </div>

                        {otpError && (
                            <p className="text-red-400 font-medium animate-in fade-in slide-in-from-top-1">
                                {otpError}
                            </p>
                        )}

                        <div className="flex flex-col items-center space-y-6">
                            <button
                                type="submit"
                                className="group w-full max-w-[240px] h-[56px] bg-[#AD0100] hover:bg-red-700 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={
                                    processing || data.otp.some((d) => !d)
                                }
                            >
                                <span className="text-lg font-bold mr-3">
                                    {processing ? "Verifying..." : "Verify Now"}
                                </span>
                                {!processing && (
                                    <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                                        <LucideMoveRight size={18} />
                                    </div>
                                )}
                            </button>

                            <div className="h-10">
                                {timer > 0 ? (
                                    <p className="text-gray-400 text-sm">
                                        Resend code in{" "}
                                        <span className="text-[#F2A922] font-semibold">
                                            {Math.floor(timer / 60)}:
                                            {(timer % 60)
                                                .toString()
                                                .padStart(2, "0")}
                                        </span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="flex items-center text-[#F2A922] font-bold text-sm gap-2 hover:text-white transition-colors"
                                    >
                                        <LucideRefreshCcw size={16} /> Resend
                                        OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
