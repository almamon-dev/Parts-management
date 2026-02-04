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
    User,
} from "lucide-react";
import { Input } from "@/Components/ui/Input";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Added clearErrors to the destructuring
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
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
            store_start_day: "Monday",
            store_end_day: "Friday",
            store_open_time: "09.00 AM",
            store_close_time: "05.00 PM",
            marketing_emails: 0,
            order_confirmation: 1,
            order_cancellation: 1,
            monthly_statement: 1,
        });

    // Handle standard text input changes and clear errors live
    const handleChange = (field, value) => {
        setData(field, value);
        if (errors[field]) {
            clearErrors(field);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("profile_photo", file);
            setPhotoPreview(URL.createObjectURL(file));
            if (errors.profile_photo) clearErrors("profile_photo");
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

            <div className="relative z-10 w-full max-w-[760px] mx-4 text-white bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[40px] p-8 md:p-12 overflow-hidden">
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

                <div className="relative w-full">
                    <div className="text-center mb-8">
                        <img
                            src="/img/logo.png"
                            className="h-14 mx-auto mb-5"
                            alt="Logo"
                        />
                        <h2 className="text-3xl font-bold mb-3">Sign up</h2>
                        <p className="text-base text-gray-200 max-w-[500px] mx-auto opacity-90">
                            Sign up to access your personalized B2B car parts
                            marketplace.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Personal Information */}
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
                                        handleChange(
                                            "first_name",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    label="Last Name*"
                                    placeholder="Doe"
                                    value={data.last_name}
                                    error={errors.last_name}
                                    onChange={(e) =>
                                        handleChange(
                                            "last_name",
                                            e.target.value
                                        )
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
                                    handleChange("email", e.target.value)
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
                                        handleChange("password", e.target.value)
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
                                            handleChange(
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
                                        className="absolute right-4 top-[44px] text-gray-400 hover:text-white transition-colors"
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

                        {/* User Profile Setup */}
                        <div className="space-y-6 flex flex-col items-center">
                            <h3 className="text-xl font-bold w-full border-b border-white/10 pb-2 text-left">
                                User Profile Setup
                            </h3>
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-2 border-white/30 overflow-hidden bg-black/40 flex items-center justify-center">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            className="w-full h-full object-cover"
                                            alt="Profile"
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
                                    placeholder="Manager"
                                    value={data.position}
                                    error={errors.position}
                                    onChange={(e) =>
                                        handleChange("position", e.target.value)
                                    }
                                />
                                <Input
                                    icon={LucidePhone}
                                    label="Phone Number"
                                    placeholder="Phone Number"
                                    value={data.phone_number}
                                    error={errors.phone_number}
                                    onChange={(e) =>
                                        handleChange(
                                            "phone_number",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="space-y-4 text-left">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2">
                                Company Information
                            </h3>
                            <Input
                                icon={LucideBuilding}
                                label="Company Name"
                                placeholder="Company Name"
                                value={data.company_name}
                                error={errors.company_name}
                                onChange={(e) =>
                                    handleChange("company_name", e.target.value)
                                }
                            />
                            <Input
                                icon={LucideMapPin}
                                label="Address"
                                placeholder="Location"
                                value={data.address}
                                error={errors.address}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                            />
                            <Input
                                icon={LucidePhone}
                                label="Company Phone"
                                placeholder="888-5555-6666"
                                value={data.company_phone}
                                error={errors.company_phone}
                                onChange={(e) =>
                                    handleChange(
                                        "company_phone",
                                        e.target.value
                                    )
                                }
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-100 ml-1">
                                    Account type
                                </label>
                                <select
                                    className="w-full bg-black/40 border border-white/20 text-gray-300 rounded-[12px] h-[56px] px-5 outline-none focus:ring-2 focus:ring-red-600 appearance-none transition-all"
                                    value={data.account_type}
                                    onChange={(e) =>
                                        handleChange(
                                            "account_type",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="" className="bg-zinc-900">
                                        Select type
                                    </option>
                                    <option value="Bodyshop" className="bg-zinc-900">Bodyshop</option>
                                    <option value="Towing / Fleet Services" className="bg-zinc-900">Towing / Fleet Services</option>
                                    <option value="Auto Part Store" className="bg-zinc-900">Auto Part Store</option>
                                    <option value="Dealership" className="bg-zinc-900">Dealership</option>
                                    <option value="Mechanic" className="bg-zinc-900">Mechanic</option>
                                </select>
                                {errors.account_type && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.account_type}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Store Hours */}
                        <div className="space-y-4 text-left">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-2">
                                Store hours
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <CustomSelect
                                    value={data.store_start_day}
                                    options={days}
                                    onChange={(val) =>
                                        handleChange("store_start_day", val)
                                    }
                                />
                                <CustomSelect
                                    value={data.store_end_day}
                                    options={days}
                                    onChange={(val) =>
                                        handleChange("store_end_day", val)
                                    }
                                />
                                <CustomSelect
                                    value={data.store_open_time}
                                    options={times}
                                    onChange={(val) =>
                                        handleChange("store_open_time", val)
                                    }
                                />
                                <CustomSelect
                                    value={data.store_close_time}
                                    options={times}
                                    onChange={(val) =>
                                        handleChange("store_close_time", val)
                                    }
                                />
                            </div>
                        </div>

                        {/* Preferences */}
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
                                        active={!!data[item.id]}
                                        onClick={() =>
                                            handleChange(
                                                item.id,
                                                data[item.id] ? 0 : 1
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col items-center pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="group w-full max-w-[240px] h-[56px] bg-[#AD0100] hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all shadow-xl border-none disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white mr-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span className="text-lg font-bold">
                                            Registering...
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-xl font-bold mr-3">
                                            Sign up
                                        </span>
                                        <div className="bg-white/20 rounded-full p-2.5 group-hover:bg-white/30 transition-colors">
                                            <LucideMoveRight size={20} />
                                        </div>
                                    </>
                                )}
                            </button>
                            <p className="mt-8 text-gray-300">
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
    <div className="flex items-center justify-between bg-black/40 border border-white/10 p-4 rounded-[12px] h-[56px]">
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
