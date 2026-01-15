import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth } = usePage().props;
    return (
        <UserLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6 bg-[#F8F9FB] min-h-screen font-sans">
                {/* --- Welcome Header --- */}
            </div>
        </UserLayout>
    );
}
