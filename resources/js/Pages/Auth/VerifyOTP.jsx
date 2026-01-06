import * as React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
    LucideMoveLeft,
    LucideMoveRight,
    LucideRefreshCcw,
} from "lucide-react";
import PrimaryButton from "@/Components/PrimaryButton";

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
                1000
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

    const submit = (e) => {
        e?.preventDefault();
        post(route("otp.verify"), {
            onSuccess: () => setOtpError(""),
        });
    };

    const handleResend = () => {
        post(route("otp.resend"), {
            onSuccess: () => setTimer(resend_interval),
        });
    };

    return (
        <div
            className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center relative font-sans"
            style={{ backgroundImage: "url('/img/otp-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <Head title="Verify OTP" />

            <div className="relative z-10 w-full max-w-[600px] mx-4 text-white bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[48px] p-10 text-center">
                <Link
                    href={route("login")}
                    className="absolute top-8 left-8 flex items-center text-gray-200 hover:text-white transition-colors group"
                >
                    <LucideMoveLeft
                        size={20}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-lg font-medium">Back</span>
                </Link>

                <div className="mt-6 flex flex-col items-center">
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

                    <img src="/img/logo.png" alt="Logo" className="h-16 mb-8" />
                    <h2 className="text-3xl font-semibold">Verify Identity</h2>
                    <p className="mt-2 opacity-80">
                        Enter the {otp_length}-digit code sent to <br />
                        <span className="font-bold text-[#F2A922]">
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
                                    className={`w-10 h-12 md:w-14 md:h-16 bg-black/40 border-2 rounded-xl text-center text-2xl font-bold focus:border-[#F2A922] outline-none transition-all ${
                                        otpError
                                            ? "border-red-500 shadow-lg"
                                            : "border-white/20"
                                    }`}
                                />
                            ))}
                        </div>

                        {otpError && (
                            <p className="text-red-400 font-medium animate-pulse">
                                {otpError}
                            </p>
                        )}

                        <div className="flex flex-col items-center space-y-6">
                            <PrimaryButton
                                className="w-56 h-14 bg-[#AD0100] rounded-full flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50"
                                disabled={processing}
                            >
                                <span className="text-lg font-bold mr-2">
                                    {processing ? "Checking..." : "Verify Now"}
                                </span>
                                {!processing && <LucideMoveRight size={20} />}
                            </PrimaryButton>

                            <div className="h-10">
                                {timer > 0 ? (
                                    <p className="text-gray-300">
                                        Resend code in{" "}
                                        <span className="text-[#F2A922] font-bold">
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
                                        className="flex items-center text-[#F2A922] font-bold gap-2 hover:text-white transition-colors"
                                    >
                                        <LucideRefreshCcw size={18} /> Resend
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
