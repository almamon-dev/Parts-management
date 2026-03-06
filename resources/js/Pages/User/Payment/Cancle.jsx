import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { XCircle, RefreshCw, ChevronLeft, AlertCircle } from "lucide-react";

export default function Cancle({ auth }) {
    return (
        <UserLayout user={auth.user}>
            <Head title="Payment Cancelled" />

            <div className="bg-[#F8F9FB] min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-red-500 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <XCircle size={32} className="text-white" />
                        </div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tight">
                            Payment Cancelled
                        </h1>
                        <p className="text-red-50 text-[12px] mt-1 font-medium opacity-90">
                            Your transaction was not completed.
                        </p>
                    </div>

                    <div className="p-8 text-center">
                        <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-3 px-4 rounded-xl mb-8 border border-amber-100">
                            <AlertCircle size={18} />
                            <p className="text-[12px] font-medium">
                                No funds were deducted from your account.
                            </p>
                        </div>

                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            If you encountered an error, you can try paying
                            again from your cart or contact support.
                        </p>

                        <div className="flex flex-col gap-2">
                            <Link
                                href={route("carts.index")}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm"
                            >
                                <RefreshCw size={18} />
                                Try Payment Again
                            </Link>

                            <Link
                                href={route("parts.index")}
                                className="w-full flex items-center justify-center gap-2 text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all text-[12px]"
                            >
                                <ChevronLeft size={16} />
                                Back to Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
