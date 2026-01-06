import * as React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    LucideLock,
    LucideMail,
    LucideBriefcase,
    LucidePhone,
    LucideBuilding,
    LucideMapPin,
    LucideCamera,
    LucideMoveRight,
    LucideEye,
    LucideEyeOff,
    User, // Default icon er jonno
} from "lucide-react";

import { Input } from "@/Components/ui/Input";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        position: "",
        phone_number: "",
        company_name: "",
        address: "",
        company_phone: "",
        account_type: "",
        profile_photo: null,
        // Store Hours
        store_start_day: "Monday",
        store_end_day: "Friday",
        store_open_time: "09.00 AM",
        store_close_time: "05.00 PM",
        // Preferences
        marketing_emails: false,
        order_confirmation: true,
        order_cancellation: true,
        monthly_statement: true,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_photo", file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            forceFormData: true,
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const times = [
        "08.00 AM",
        "09.00 AM",
        "10.00 AM",
        "11.00 AM",
        "12.00 PM",
        "01.00 PM",
        "02.00 PM",
        "03.00 PM",
        "04.00 PM",
        "05.00 PM",
        "06.00 PM",
    ];

    return (
        <div
            className="min-h-screen py-20 flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
            style={{ backgroundImage: "url('/img/login-bg.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <Head title="Sign up" />

            <div className="relative z-10 w-full max-w-[712px] mx-4 text-white bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[48px] p-8 md:p-[64px] overflow-hidden">
                {/* Background Images */}
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
                    <div className="flex flex-col items-center mb-10 text-center">
                        <img
                            src="img/logo.png"
                            alt="Logo"
                            className="h-16 mb-6 object-contain"
                        />
                        <h2 className="text-4xl font-bold tracking-tight mb-4 text-white">
                            Sign up
                        </h2>
                    </div>

                    <form onSubmit={submit} className="space-y-10">
                        {/* --- Personal Information --- */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2 text-left">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="First Name*"
                                    placeholder="John"
                                    value={data.first_name}
                                    error={errors.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                />
                                <Input
                                    label="Last Name*"
                                    placeholder="Doe"
                                    value={data.last_name}
                                    error={errors.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                />
                            </div>
                            <Input
                                label="Email Address*"
                                type="email"
                                icon={LucideMail}
                                placeholder="johndoe@gmail.com"
                                value={data.email}
                                error={errors.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                <Input
                                    label="Password*"
                                    type={showPassword ? "text" : "password"}
                                    icon={LucideLock}
                                    placeholder="********"
                                    value={data.password}
                                    error={errors.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <div className="relative">
                                    <Input
                                        label="Confirm Password*"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        icon={LucideLock}
                                        placeholder="********"
                                        value={data.password_confirmation}
                                        error={errors.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-[48px] text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? (
                                            <LucideEye size={18} />
                                        ) : (
                                            <LucideEyeOff size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- User Profile Setup --- */}
                        <div className="space-y-6 flex flex-col items-center">
                            <h3 className="text-xl font-bold w-full border-b border-white/10 pb-2 text-left">
                                User Profile Setup
                            </h3>

                            {/* Profile Image Preview logic starts here */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-2 border-white/30 overflow-hidden bg-black/40 flex items-center justify-center">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            className="w-full h-full object-cover"
                                            alt="Profile Preview"
                                        />
                                    ) : (
                                        <User
                                            size={48}
                                            className="text-white/30"
                                        />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                                    <LucideCamera size={18} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            </div>
                            {errors.profile_photo && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.profile_photo}
                                </p>
                            )}

                            <div className="w-full space-y-4">
                                <Input
                                    icon={LucideBriefcase}
                                    label="Position"
                                    placeholder="Position (eg. Manager)"
                                    value={data.position}
                                    error={errors.position}
                                    onChange={(e) =>
                                        setData("position", e.target.value)
                                    }
                                />
                                <Input
                                    icon={LucidePhone}
                                    label="Phone Number"
                                    placeholder="Phone Number"
                                    value={data.phone_number}
                                    error={errors.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* --- Company Information --- */}
                        <div className="space-y-4 text-left">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2">
                                Company Information
                            </h3>
                            <Input
                                icon={LucideBuilding}
                                label="Company Name"
                                placeholder="Enter company name"
                                value={data.company_name}
                                error={errors.company_name}
                                onChange={(e) =>
                                    setData("company_name", e.target.value)
                                }
                            />
                            <Input
                                icon={LucideMapPin}
                                label="Address"
                                placeholder="Enter company location"
                                value={data.address}
                                error={errors.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                            <Input
                                icon={LucidePhone}
                                label="Company Phone"
                                placeholder="eg. 888-5555-6666"
                                value={data.company_phone}
                                error={errors.company_phone}
                                onChange={(e) =>
                                    setData("company_phone", e.target.value)
                                }
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-100 ml-1">
                                    Account type
                                </label>
                                <select
                                    className="w-full bg-black/40 border border-white/20 text-gray-300 rounded-[12px] h-[64px] px-5 outline-none focus:ring-2 focus:ring-red-600 appearance-none"
                                    value={data.account_type}
                                    onChange={(e) =>
                                        setData("account_type", e.target.value)
                                    }
                                >
                                    <option value="" className="bg-zinc-900">
                                        Select type
                                    </option>
                                    <option value="b2b" className="bg-zinc-900">
                                        B2B Marketplace
                                    </option>
                                    <option
                                        value="dealer"
                                        className="bg-zinc-900"
                                    >
                                        Dealer
                                    </option>
                                </select>
                                {errors.account_type && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.account_type}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* --- Store Hours --- */}
                        <div className="space-y-4 text-left">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2">
                                Store hours
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <CustomSelect
                                    value={data.store_start_day}
                                    options={days}
                                    onChange={(val) =>
                                        setData("store_start_day", val)
                                    }
                                />
                                <CustomSelect
                                    value={data.store_end_day}
                                    options={days}
                                    onChange={(val) =>
                                        setData("store_end_day", val)
                                    }
                                />
                                <CustomSelect
                                    value={data.store_open_time}
                                    options={times}
                                    onChange={(val) =>
                                        setData("store_open_time", val)
                                    }
                                />
                                <CustomSelect
                                    value={data.store_close_time}
                                    options={times}
                                    onChange={(val) =>
                                        setData("store_close_time", val)
                                    }
                                />
                            </div>
                        </div>

                        {/* --- Preferences --- */}
                        <div className="space-y-6 text-left">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2">
                                Preferences
                            </h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-300 ml-1">
                                    I would like to receive
                                </p>
                                {[
                                    {
                                        id: "marketing_emails",
                                        label: "Marketing Emails",
                                    },
                                    {
                                        id: "order_confirmation",
                                        label: "Order Confirmation",
                                    },
                                    {
                                        id: "order_cancellation",
                                        label: "Order Cancellation",
                                    },
                                    {
                                        id: "monthly_statement",
                                        label: "Monthly Statement",
                                    },
                                ].map((item) => (
                                    <ToggleSwitch
                                        key={item.id}
                                        label={item.label}
                                        active={data[item.id]}
                                        onClick={() =>
                                            setData(item.id, !data[item.id])
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col items-center pt-8">
                            <PrimaryButton
                                className="group w-[240px] h-[64px] bg-[#AD0100] hover:bg-red-700 text-white rounded-[100px] flex items-center justify-center transition-all shadow-xl"
                                disabled={processing}
                            >
                                <span className="text-[22px] font-bold mr-3">
                                    Sign up
                                </span>
                                <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                                    <LucideMoveRight size={24} />
                                </div>
                            </PrimaryButton>
                            <p className="mt-10 text-gray-200">
                                Already have an account?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-white font-bold hover:underline"
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

// Sub-components remains the same...
const CustomSelect = ({ value, options, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/10 text-white rounded-[12px] h-[56px] px-4 appearance-none focus:ring-2 focus:ring-red-600 outline-none transition-all cursor-pointer"
        >
            {options.map((opt) => (
                <option
                    key={opt}
                    value={opt}
                    className="bg-zinc-900 text-white"
                >
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

const ToggleSwitch = ({ label, active, onClick }) => (
    <div className="flex items-center justify-between bg-black/40 border border-white/10 p-4 rounded-[12px] h-[64px]">
        <span className="text-gray-200 text-[16px]">{label}</span>
        <button
            type="button"
            onClick={onClick}
            className={`w-[52px] h-[28px] rounded-full relative transition-all duration-300 flex items-center ${
                active ? "bg-[#F2A922]" : "bg-[#E5E7EB]"
            }`}
        >
            <div
                className={`w-[22px] h-[22px] bg-white rounded-full shadow-md transition-all duration-300 absolute ${
                    active ? "left-[26px]" : "left-[4px]"
                }`}
            ></div>
        </button>
    </div>
);
