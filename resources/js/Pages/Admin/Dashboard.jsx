import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    Users,
    ShoppingCart,
    ShoppingBag,
    RotateCcw,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Info,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

// Demo Data for Graph
const chartData = [
    { time: "2 am", purchase: 30, sales: 20 },
    { time: "4 am", purchase: 25, sales: 15 },
    { time: "6 am", purchase: 20, sales: 10 },
    { time: "8 am", purchase: 35, sales: 25 },
    { time: "10 am", purchase: 32, sales: 22 },
    { time: "12 am", purchase: 32, sales: 22 },
    { time: "14 pm", purchase: 25, sales: 15 },
    { time: "16 pm", purchase: 38, sales: 28 },
    { time: "18 pm", purchase: 45, sales: 35 },
    { time: "20 pm", purchase: 28, sales: 18 },
    { time: "22 pm", purchase: 35, sales: 25 },
    { time: "24 pm", purchase: 30, sales: 20 },
];

export default function Dashboard({ auth }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6 bg-[#F8F9FB] min-h-screen font-sans">
                {/* --- Welcome Header --- */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Welcome, Admin
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

                {/* --- Low Stock Alert --- */}
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-orange-800">
                        <Info size={16} />
                        <span>
                            Your Product{" "}
                            <strong className="text-red-500">
                                Apple iPhone 15 is running Low
                            </strong>
                            , already below 5 Pcs.{" "}
                            <button className="underline font-bold">
                                Add Stock
                            </button>
                        </span>
                    </div>
                    <button className="text-orange-400 hover:text-orange-600">
                        ✕
                    </button>
                </div>

                {/* --- Top 4 Stat Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Sales"
                        value="$48,988,078"
                        change="+22%"
                        color="bg-orange-500"
                        icon={<ShoppingCart className="text-white" />}
                    />
                    <StatCard
                        title="Total Sales Return"
                        value="$16,478,145"
                        change="-22%"
                        color="bg-slate-800"
                        icon={<RotateCcw className="text-white" />}
                        isNegative
                    />
                    <StatCard
                        title="Total Purchase"
                        value="$24,145,789"
                        change="+22%"
                        color="bg-emerald-500"
                        icon={<ShoppingBag className="text-white" />}
                    />
                    <StatCard
                        title="Total Purchase Return"
                        value="$18,458,747"
                        change="+22%"
                        color="bg-blue-600"
                        icon={<RotateCcw className="text-white" />}
                    />
                </div>

                {/* --- Detailed Stats --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <SmallInfoCard
                        title="Profit"
                        value="$8,458,798"
                        change="+35%"
                    />
                    <SmallInfoCard
                        title="Invoice Due"
                        value="$48,988,78"
                        change="+35%"
                    />
                    <SmallInfoCard
                        title="Total Expenses"
                        value="$8,980,097"
                        change="+41%"
                    />
                    <SmallInfoCard
                        title="Total Payment Returns"
                        value="$78,458,798"
                        change="-20%"
                        isNegative
                    />
                </div>

                {/* --- Charts & Overall Info --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales & Purchase Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800">
                                Sales & Purchase
                            </h3>
                            <div className="flex bg-gray-100 p-1 rounded-md text-xs font-bold text-gray-500">
                                <button className="px-3 py-1 hover:bg-white rounded">
                                    1D
                                </button>
                                <button className="px-3 py-1 hover:bg-white rounded">
                                    1W
                                </button>
                                <button className="px-3 py-1 bg-white shadow-sm text-orange-500 rounded">
                                    1M
                                </button>
                                <button className="px-3 py-1 hover:bg-white rounded">
                                    1Y
                                </button>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#94a3b8" }}
                                    />
                                    <Tooltip cursor={{ fill: "#f8fafc" }} />
                                    <Bar
                                        dataKey="purchase"
                                        fill="#ffedd5"
                                        radius={[4, 4, 0, 0]}
                                        barSize={30}
                                    />
                                    <Bar
                                        dataKey="sales"
                                        fill="#f97316"
                                        radius={[4, 4, 0, 0]}
                                        barSize={30}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Overall Information */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Info size={18} className="text-blue-500" /> Overall
                            Information
                        </h3>
                        <div className="space-y-4">
                            <InfoRow
                                icon={<Users className="text-blue-500" />}
                                label="Suppliers"
                                value="6987"
                                bgColor="bg-blue-50"
                            />
                            <InfoRow
                                icon={<Users className="text-orange-500" />}
                                label="Customer"
                                value="4896"
                                bgColor="bg-orange-50"
                            />
                            <InfoRow
                                icon={
                                    <ShoppingCart className="text-emerald-500" />
                                }
                                label="Orders"
                                value="487"
                                bgColor="bg-emerald-50"
                            />
                        </div>

                        <div className="mt-8 border-t pt-6">
                            <h4 className="font-bold text-sm mb-4">
                                Customers Overview
                            </h4>
                            <div className="flex items-center justify-center relative h-32">
                                {/* Simplified representation of Circle Progress */}
                                <div className="w-24 h-24 border-[10px] border-orange-500 border-t-transparent rounded-full rotate-45"></div>
                                <div className="absolute text-center">
                                    <p className="text-lg font-bold">5.5K</p>
                                    <p className="text-[10px] text-gray-400">
                                        First Time
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

// Sub-components
function StatCard({ title, value, change, color, icon, isNegative }) {
    return (
        <div
            className={`${color} p-5 rounded-xl flex items-center justify-between`}
        >
            <div>
                <p className="text-white/80 text-sm font-medium">{title}</p>
                <h2 className="text-white text-xl font-bold mt-1">{value}</h2>
                <span className="inline-flex items-center text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded mt-2">
                    {isNegative ? (
                        <ArrowDownRight size={10} />
                    ) : (
                        <ArrowUpRight size={10} />
                    )}{" "}
                    {change}
                </span>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
        </div>
    );
}

function SmallInfoCard({ title, value, change, isNegative }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <p className="text-xs text-slate-400 font-medium">{title}</p>
            <h3 className="text-lg font-bold text-slate-700 mt-1">{value}</h3>
            <div className="flex justify-between items-center mt-3">
                <span
                    className={`text-[10px] font-bold ${
                        isNegative ? "text-red-500" : "text-emerald-500"
                    }`}
                >
                    {change}{" "}
                    <span className="text-slate-300 font-normal">
                        vs Last Month
                    </span>
                </span>
                <button className="text-[10px] text-blue-500 underline">
                    View All
                </button>
            </div>
            <div className="absolute top-4 right-4 text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp size={20} />
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value, bgColor }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
                <div className={`${bgColor} p-2 rounded-lg`}>{icon}</div>
                <span className="text-sm font-medium text-slate-500">
                    {label}
                </span>
            </div>
            <span className="font-bold text-slate-700">{value}</span>
        </div>
    );
}
