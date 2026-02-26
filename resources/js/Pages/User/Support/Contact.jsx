import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    ArrowRight,
    CheckCircle2,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        order_id: "",
        subject: "",
        message: "",
    });

    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            onSuccess: () => {
                reset();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    // Also handle direct flash success (e.g. if redirected from another page)
    React.useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [flash.success]);

    return (
        <>
            <Head title="Contact Support" />

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
                    >
                        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/50 backdrop-blur-md">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-sm uppercase tracking-tight">
                                    Message Received
                                </h4>
                                <p className="text-white/80 text-xs font-medium">
                                    {flash.success ||
                                        "We've received your inquiry and will respond shortly."}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                            Customer Support
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">
                            We're here to help. Send us a message and we'll
                            respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Essential Info */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-5">
                                    Contact Details
                                </h2>

                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-[#AD0100] shrink-0 border border-red-100">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">
                                                Direct Line
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                (1-800-288-6727)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 shrink-0 border border-slate-100">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">
                                                Support Email
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                support@autopartshub.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 shrink-0 border border-slate-100">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 leading-none mb-1">
                                                Headquarters
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900 leading-snug">
                                                123 Industrial Parkway Suite 500
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Minimal Help Box */}
                            <div className="bg-slate-900 p-5 rounded-lg text-white shadow-sm group">
                                <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#AD0100] rounded-full" />
                                    Instant Answers
                                </h3>
                                <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                                    Most return and order questions are already
                                    answered in our FAQ.
                                </p>
                                <button className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded transition-colors border border-slate-700">
                                    Browse FAQ{" "}
                                    <ArrowRight
                                        size={14}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: High-Density Minimal Form */}
                        <div className="lg:col-span-8">
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <MessageCircle
                                        size={18}
                                        className="text-[#AD0100]"
                                    />
                                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                                        Direct Inquiry
                                    </h2>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Jane"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full h-10 bg-slate-50 border ${errors.first_name ? "border-red-400" : "border-slate-200"} rounded-md px-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-100 focus:border-[#AD0100] transition-all outline-none`}
                                        />
                                        {errors.first_name && (
                                            <p className="text-red-500 text-[10px] mt-1">
                                                {errors.first_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Morgan"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full h-10 bg-slate-50 border ${errors.last_name ? "border-red-400" : "border-slate-200"} rounded-md px-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-100 focus:border-[#AD0100] transition-all outline-none`}
                                        />
                                        {errors.last_name && (
                                            <p className="text-red-500 text-[10px] mt-1">
                                                {errors.last_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="jane.m@example.com"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className={`w-full h-10 bg-slate-50 border ${errors.email ? "border-red-400" : "border-slate-200"} rounded-md px-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-100 focus:border-[#AD0100] transition-all outline-none`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-[10px] mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="+1 (555) 000-0000"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className={`w-full h-10 bg-slate-50 border ${errors.phone ? "border-red-400" : "border-slate-200"} rounded-md px-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-100 focus:border-[#AD0100] transition-all outline-none`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-[10px] mt-1">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            Order ID{" "}
                                            <span className="text-slate-400 font-normal ml-1">
                                                (Optional)
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ORD-XXXXXX"
                                            value={data.order_id}
                                            onChange={(e) =>
                                                setData(
                                                    "order_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-md px-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-50 focus:border-[#AD0100] transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            Inquiry Subject
                                        </label>
                                        <select
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    "subject",
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full h-10 bg-slate-50 border ${errors.subject ? "border-red-400" : "border-slate-200"} rounded-md px-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-100 focus:border-[#AD0100] transition-all outline-none cursor-pointer`}
                                        >
                                            <option value="">
                                                Select subject
                                            </option>
                                            <option value="General Inquiry">
                                                General Inquiry
                                            </option>
                                            <option value="Order Support">
                                                Order Support
                                            </option>
                                            <option value="Return Request">
                                                Return Request
                                            </option>
                                            <option value="Technical Issue">
                                                Technical Issue
                                            </option>
                                            <option value="Others">
                                                Others
                                            </option>
                                        </select>
                                        {errors.subject && (
                                            <p className="text-red-500 text-[10px] mt-1">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 ml-0.5">
                                            Message
                                        </label>
                                        <textarea
                                            rows="4"
                                            placeholder="Describe your inquiry in detail..."
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    "message",
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full bg-slate-50 border ${errors.message ? "border-red-400" : "border-slate-200"} rounded-md p-3 text-sm focus:bg-white focus:ring-1 focus:ring-red-100 focus:border-[#AD0100] transition-all outline-none resize-none`}
                                        />
                                        {errors.message && (
                                            <p className="text-red-500 text-[10px] mt-1">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2 pt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full md:w-auto md:min-w-[180px] flex items-center justify-center gap-2 bg-[#AD0100] text-white px-8 h-11 rounded-md font-bold text-sm tracking-wide hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            Send Message
                                            <Send size={15} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Contact.layout = (page) => <UserLayout children={page} />;
