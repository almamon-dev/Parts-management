import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;
    return (
        <UserLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6 bg-[#F8F9FB] min-h-screen font-sans">
                {/* --- Welcome Header --- */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Welcome, User
                        </h1>
                        <p className="text-sm text-slate-500">
                            You have{" "}
                            <span className="text-orange-500 font-bold">
                                200+
                            </span>{" "}
                            Orders, Today
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
                        <span className="opacity-70">📅</span> 12/20/2025 -
                        12/26/2025
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
