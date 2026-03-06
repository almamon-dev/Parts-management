import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";

export default function Success({ auth, order }) {
    return (
        <UserLayout user={auth.user}>
            <Head title="Payment Successful" />

            <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-4">
                <div className="max-w-sm w-full text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle
                                size={40}
                                className="text-emerald-600"
                            />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-slate-600 text-sm mb-8">
                        Thank you for your payment. Your transaction has been
                        completed successfully.
                    </p>

                    {/* Order Number (if available) */}
                    {order?.order_number && (
                        <div className="bg-slate-50 rounded-lg p-4 mb-8">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                Order Number
                            </p>
                            <p className="text-lg font-mono font-bold text-slate-900">
                                #{order.order_number}
                            </p>
                        </div>
                    )}

                    {/* Continue Button */}
                    <Link
                        href={route("dashboard")}
                        className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Continue to Dashboard
                    </Link>
                </div>
            </div>
        </UserLayout>
    );
}
