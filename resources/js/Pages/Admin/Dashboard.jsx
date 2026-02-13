import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// ... imports
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({
    auth,
    leads = [],
    onlineOrders = [],
    returnRequests = [],
    listingsStats = [],
    onlineSalesStats = [],
    salesByChannel = [],
    customerStats = [],
    filters = {
        leads_filter: "last_30_days",
        listings_filter: "last_30_days",
        sales_filter: "last_30_days",
        channels_filter: "last_30_days",
        customers_filter: "last_30_days",
    },
}) {
    const onFilterChange = (key, value) => {
        router.get(
            route("dashboard"),
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6 min-h-screen font-sans">
                {/* --- Row 1: Lists --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {/* Leads Created */}
                    <DataCard
                        title="Leads Created"
                        hasFilter
                        currentFilter={filters.leads_filter}
                        onFilterChange={(val) =>
                            onFilterChange("leads_filter", val)
                        }
                    >
                        <div className="space-y-2 mt-4 overflow-hidden">
                            {leads.length > 0 ? (
                                <div className="space-y-2">
                                    {leads.map((lead, i) => (
                                        <div
                                            key={i}
                                            className="bg-slate-50/80 p-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 flex justify-between items-center border border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-[#FF9F43] leading-none mb-1">
                                                    {lead.lead_number}
                                                </span>
                                                <span className="font-bold">
                                                    {lead.name}
                                                </span>
                                            </div>
                                            <Badge
                                                text="Lead"
                                                color="bg-orange-500/10 text-[#FF9F43] border border-orange-100"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p className="text-sm font-medium">
                                        No Leads Found
                                    </p>
                                    <p className="text-[11px]">
                                        New leads will appear here
                                    </p>
                                </div>
                            )}
                        </div>
                    </DataCard>

                    {/* Online Orders */}
                    <DataCard title="Online Orders">
                        <div className="space-y-3 mt-4 overflow-x-auto custom-scrollbar pb-2">
                            {onlineOrders.length > 0 ? (
                                <div className="w-full space-y-3">
                                    {onlineOrders.map((order, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-[11px] whitespace-nowrap"
                                        >
                                            <span className="w-16 font-black text-[#FF9F43]">
                                                {order.order_number}
                                            </span>
                                            <span className="w-24 truncate font-bold text-slate-700">
                                                {order.customer}
                                            </span>
                                            <Badge
                                                text={order.type}
                                                color="bg-slate-800 text-white"
                                            />
                                            <Badge
                                                text={`${order.items} Items`}
                                                color="bg-slate-800 text-white"
                                            />
                                            <Badge
                                                text={order.date}
                                                color="bg-slate-800 text-white"
                                            />
                                            <Badge
                                                text={order.status}
                                                color={getStatusColorBadge(
                                                    order.status,
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {onlineOrders.length < 5 &&
                                        [...Array(5 - onlineOrders.length)].map(
                                            (_, i) => (
                                                <div
                                                    key={`ghost-o-${i}`}
                                                    className="h-6 w-full bg-slate-50/50 rounded-full border border-slate-100/50"
                                                ></div>
                                            ),
                                        )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p className="text-sm font-medium">
                                        No Orders Yet
                                    </p>
                                    <p className="text-[11px]">
                                        Start selling to see orders
                                    </p>
                                </div>
                            )}
                        </div>
                    </DataCard>

                    {/* Return Requests */}
                    <DataCard title="Return Requests">
                        <div className="space-y-3 mt-4 overflow-x-auto custom-scrollbar pb-2">
                            {returnRequests.length > 0 ? (
                                <div className="w-full space-y-3">
                                    {returnRequests.map((req, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-[11px] whitespace-nowrap"
                                        >
                                            <span className="w-16 font-black text-[#FF9F43]">
                                                {req.return_number}
                                            </span>
                                            <span className="w-24 truncate font-bold text-slate-700">
                                                {req.customer}
                                            </span>
                                            <Badge
                                                text={req.type}
                                                color="bg-slate-800 text-white"
                                            />
                                            <Badge
                                                text={`${req.items} Items`}
                                                color="bg-slate-800 text-white"
                                            />
                                            <Badge
                                                text={req.date}
                                                color="bg-slate-800 text-white"
                                            />
                                            <Badge
                                                text={req.status}
                                                color={getStatusColorBadge(
                                                    req.status,
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {returnRequests.length < 5 &&
                                        [
                                            ...Array(5 - returnRequests.length),
                                        ].map((_, i) => (
                                            <div
                                                key={`ghost-r-${i}`}
                                                className="h-6 w-full bg-slate-50/50 rounded-full border border-slate-100/50"
                                            ></div>
                                        ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p className="text-sm font-medium">
                                        No Returns Found
                                    </p>
                                    <p className="text-[11px]">
                                        Customer returns will show here
                                    </p>
                                </div>
                            )}
                        </div>
                    </DataCard>
                </div>

                {/* --- Row 2: Listings & Sales Charts --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {/* New Listings Chart */}
                    <DataCard
                        title="New Listings"
                        hasFilter
                        currentFilter={filters.listings_filter}
                        onFilterChange={(val) =>
                            onFilterChange("listings_filter", val)
                        }
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-52 mt-4 gap-4 sm:gap-0">
                            <div className="w-full sm:w-1/2 h-40 sm:h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={listingsStats}
                                            innerRadius={45}
                                            outerRadius={65}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {listingsStats.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        Total
                                    </span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">
                                        {listingsStats
                                            .reduce((a, b) => a + b.value, 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto flex-1 space-y-3 sm:space-y-4 px-2 sm:pl-4">
                                {listingsStats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5"
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                                            style={{
                                                backgroundColor: stat.color,
                                            }}
                                        ></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                                {stat.name}
                                            </span>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">
                                                {stat.value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DataCard>
                    {/* Online Sales Donut */}
                    <DataCard
                        title="Online Sales"
                        hasFilter
                        currentFilter={filters.sales_filter}
                        onFilterChange={(val) =>
                            onFilterChange("sales_filter", val)
                        }
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-52 mt-4 gap-4 sm:gap-0">
                            <div className="w-full sm:w-1/2 h-40 sm:h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={onlineSalesStats}
                                            innerRadius={45}
                                            outerRadius={65}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {onlineSalesStats.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        Revenue
                                    </span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">
                                        $
                                        {onlineSalesStats
                                            .reduce(
                                                (a, b) => a + Number(b.value),
                                                0,
                                            )
                                            .toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto flex-1 space-y-3 sm:space-y-4 px-2 sm:pl-4">
                                {onlineSalesStats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5"
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                                            style={{
                                                backgroundColor: stat.color,
                                            }}
                                        ></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                                {stat.name}
                                            </span>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">
                                                $
                                                {Number(
                                                    stat.value,
                                                ).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DataCard>
                    {/* Sales - All Channels Bar Chart */}
                    <DataCard
                        title="Sales - All Channels"
                        hasFilter
                        currentFilter={filters.channels_filter}
                        onFilterChange={(val) =>
                            onFilterChange("channels_filter", val)
                        }
                    >
                        <div className="h-52 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={salesByChannel}
                                    margin={{
                                        top: 20,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 9,
                                            fill: "#64748b",
                                            fontWeight: "bold",
                                        }}
                                        angle={-30}
                                        textAnchor="end"
                                        height={50}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fill: "#94a3b8",
                                            fontWeight: "bold",
                                        }}
                                        tickFormatter={(val) =>
                                            `$${val / 1000}k`
                                        }
                                    />
                                    <Tooltip
                                        cursor={{ fill: "#f8fafc", radius: 4 }}
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "1px solid #f1f5f9",
                                            boxShadow:
                                                "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                            padding: "8px",
                                        }}
                                        itemStyle={{
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                        }}
                                        labelStyle={{
                                            color: "#64748b",
                                            fontSize: "10px",
                                            marginBottom: "4px",
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[6, 6, 0, 0]}
                                        barSize={20}
                                    >
                                        {salesByChannel.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getChannelColor(index)}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DataCard>
                </div>

                {/* --- Row 3: Online Customers --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <DataCard
                        title="Online Customers"
                        hasFilter
                        currentFilter={filters.customers_filter}
                        onFilterChange={(val) =>
                            onFilterChange("customers_filter", val)
                        }
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-52 mt-4 gap-4 sm:gap-0">
                            <div className="w-full sm:w-1/2 h-40 sm:h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={customerStats}
                                            innerRadius={45}
                                            outerRadius={65}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {customerStats.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        Customers
                                    </span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">
                                        {customerStats
                                            .reduce((a, b) => a + b.value, 0)
                                            .toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto flex-1 space-y-3 sm:space-y-4 px-2 sm:pl-4">
                                {customerStats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5"
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                                            style={{
                                                backgroundColor: stat.color,
                                            }}
                                        ></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                                {stat.name}
                                            </span>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">
                                                {stat.value.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DataCard>
                </div>
            </div>
        </AdminLayout>
    );
}

// ... helper functions ...

// Sub-components
function getStatusColorBadge(status) {
    const s = status.toLowerCase();
    if (s.includes("pending"))
        return "bg-amber-400 text-white border border-amber-500";
    if (s.includes("declined"))
        return "bg-emerald-600 text-white border border-emerald-700";
    if (s.includes("approved"))
        return "bg-red-700 text-white border border-red-800";
    if (s.includes("unfulfilled"))
        return "bg-red-600 text-white border border-red-700";
    if (s.includes("fulfilled"))
        return "bg-emerald-600 text-white border border-emerald-700";
    return "bg-slate-500 text-white border border-slate-600";
}

function DataCard({
    title,
    children,
    hasFilter,
    currentFilter,
    onFilterChange,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const filterOptions = [
        { label: "Last 7 days", value: "last_7_days" },
        { label: "Last 30 days", value: "last_30_days" },
        { label: "Last Year", value: "last_year" },
    ];

    const currentLabel =
        filterOptions.find((opt) => opt.value === currentFilter)?.label ||
        "Last 30 days";

    return (
        <div className="bg-white p-6 rounded-[22px] shadow-sm border border-slate-200/50 flex flex-col h-full min-h-[300px] transition-all hover:shadow-lg hover:shadow-slate-200/40 relative">
            <div className="flex justify-between items-start mb-4 relative z-20">
                <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase opacity-80">
                    {title}
                </h3>
                {hasFilter && (
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] text-slate-500 font-bold cursor-pointer hover:bg-white transition-colors outline-none"
                        >
                            {currentLabel} <ChevronDown size={10} />
                        </button>
                        {isOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-30 overflow-hidden">
                                    {filterOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => {
                                                onFilterChange(opt.value);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-slate-50 transition-colors ${
                                                currentFilter === opt.value
                                                    ? "text-[#FF9F43]"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="relative z-0 h-full flex flex-col">{children}</div>
        </div>
    );
}

function Badge({ text, color }) {
    return (
        <span
            className={`${color} px-3 py-1 rounded-full whitespace-nowrap text-[10px] font-bold tracking-tight shadow-sm`}
        >
            {text}
        </span>
    );
}

function getStatusColor(status) {
    const s = status.toLowerCase();
    if (s.includes("pending")) return "bg-orange-500";
    if (s.includes("declined")) return "bg-emerald-800"; // Match image's green for declined for some reason? Wait, let's check image.
    // In image: Approved is Red, Declined is Green/Dark Blue?
    // Wait: Pending (Orange), Declined (Greenish/Turquoise), Declined (Greenish), Approved (Dark Red).
    // Let's match image exactly:
    if (s.includes("pending")) return "bg-[#f59e0b]";
    if (s.includes("declined")) return "bg-[#065f46]";
    if (s.includes("approved")) return "bg-[#991b1b]";
    return "bg-slate-600";
}

function getChannelColor(index) {
    const colors = [
        "#22d3ee",
        "#38bdf8",
        "#60a5fa",
        "#818cf8",
        "#a78bfa",
        "#db2777",
        "#991b1b",
    ];
    return colors[index % colors.length];
}
