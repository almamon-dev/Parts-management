import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    ChevronDown,
} from "lucide-react";
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

export default function Dashboard({ 
    auth, 
    leads = [], 
    onlineOrders = [], 
    returnRequests = [],
    listingsStats = [],
    onlineSalesStats = [],
    salesByChannel = [],
    customerStats = [],
}) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="p-1 md:p-2 min-h-screen font-sans">
                
                {/* --- Row 1: Lists --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {/* Leads Created */}
                    <DataCard title="Leads Created" hasFilter>
                        <div className="space-y-2 mt-4 overflow-hidden">
                            {leads.length > 0 ? (
                                <div className="space-y-2">
                                    {leads.map((lead, i) => (
                                        <div key={i} className="bg-slate-50/80 p-2.5 px-4 rounded-xl text-sm font-medium text-slate-700 flex justify-between border border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-300">
                                            <span>{lead.name}</span>
                                        </div>
                                    ))}
                                    {/* Ghost items to maintain layout height if few items */}
                                    {leads.length < 8 && [...Array(8 - leads.length)].map((_, i) => (
                                        <div key={`ghost-${i}`} className="bg-slate-50/30 h-10 rounded-xl border border-slate-50/50"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p className="text-sm font-medium">No Leads Found</p>
                                    <p className="text-[11px]">New leads will appear here</p>
                                </div>
                            )}
                        </div>
                    </DataCard>

                    {/* Online Orders */}
                    <DataCard title="Online Orders">
                        <div className="space-y-3 mt-4 overflow-x-auto custom-scrollbar pb-2">
                            {onlineOrders.length > 0 ? (
                                <div className="min-w-[400px] lg:min-w-0 space-y-3">
                                    {onlineOrders.map((order, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[11px] whitespace-nowrap">
                                            <span className="w-24 truncate font-bold text-slate-700">{order.customer}</span>
                                            <Badge text={order.type} color="bg-blue-500/10 text-blue-600 border border-blue-100" />
                                            <Badge text={`${order.items} Items`} color="bg-indigo-500/10 text-indigo-600 border border-indigo-100" />
                                            <Badge text={order.date} color="bg-slate-100 text-slate-600 border border-slate-200" />
                                            <Badge text={order.status} color={order.status === 'Fulfilled' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-100' : 'bg-rose-500/10 text-rose-600 border border-rose-100'} />
                                        </div>
                                    ))}
                                    {onlineOrders.length < 5 && [...Array(5 - onlineOrders.length)].map((_, i) => (
                                        <div key={`ghost-o-${i}`} className="h-6 w-full bg-slate-50/50 rounded-full border border-slate-100/50"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p className="text-sm font-medium">No Orders Yet</p>
                                    <p className="text-[11px]">Start selling to see orders</p>
                                </div>
                            )}
                        </div>
                    </DataCard>

                    {/* Return Requests */}
                    <DataCard title="Return Requests">
                        <div className="space-y-3 mt-4 overflow-x-auto custom-scrollbar pb-2">
                            {returnRequests.length > 0 ? (
                                <div className="min-w-[400px] lg:min-w-0 space-y-3">
                                    {returnRequests.map((req, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[11px] whitespace-nowrap">
                                            <span className="w-24 truncate font-bold text-slate-700">{req.customer}</span>
                                            <Badge text={req.type} color="bg-blue-500/10 text-blue-600 border border-blue-100" />
                                            <Badge text={`${req.items} Items`} color="bg-indigo-500/10 text-indigo-600 border border-indigo-100" />
                                            <Badge text={req.date} color="bg-slate-100 text-slate-600 border border-slate-200" />
                                            <Badge text={req.status} color={getStatusColorBadge(req.status)} />
                                        </div>
                                    ))}
                                    {returnRequests.length < 5 && [...Array(5 - returnRequests.length)].map((_, i) => (
                                        <div key={`ghost-r-${i}`} className="h-6 w-full bg-slate-50/50 rounded-full border border-slate-100/50"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                    <p className="text-sm font-medium">No Returns Found</p>
                                    <p className="text-[11px]">Customer returns will show here</p>
                                </div>
                            )}
                        </div>
                    </DataCard>
                </div>

                {/* --- Row 2: Listings & Sales Charts --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                    {/* New Listings Chart */}
                    <DataCard title="New Listings" hasFilter>
                        <div className="flex items-center justify-between h-52 mt-4">
                            <div className="w-[140px] md:w-1/2 h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={listingsStats}
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {listingsStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">2,366</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 pr-2 pl-4">
                                {listingsStats.map((stat, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: stat.color }}></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.name}</span>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">{stat.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DataCard>

                    {/* Online Sales Donut */}
                    <DataCard title="Online Sales" hasFilter>
                         <div className="flex items-center justify-between h-52 mt-4">
                            <div className="w-[140px] md:w-1/2 h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={onlineSalesStats}
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {onlineSalesStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue</span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">$37K</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 pr-2 pl-4">
                                {onlineSalesStats.map((stat, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: stat.color }}></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.name}</span>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">${stat.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DataCard>

                    {/* Sales - All Channels Bar Chart */}
                    <DataCard title="Sales - All Channels" hasFilter>
                        <div className="h-52 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesByChannel} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }}
                                        angle={-30}
                                        textAnchor="end"
                                        height={50}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                                        tickFormatter={(val) => `$${val/1000}k`}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc', radius: 4 }}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px' }}
                                        itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        radius={[6, 6, 0, 0]}
                                        barSize={20}
                                    >
                                        {salesByChannel.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getChannelColor(index)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DataCard>
                </div>

                {/* --- Row 3: Online Customers --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <DataCard title="Online Customers" hasFilter>
                        <div className="flex items-center justify-between h-52 mt-4">
                            <div className="w-[140px] md:w-1/2 h-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={customerStats}
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {customerStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">45</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 pr-2 pl-4">
                                {customerStats.map((stat, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: stat.color }}></div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.name}</span>
                                            <span className="text-sm font-black text-slate-800 tracking-tight">{stat.value.toLocaleString()}</span>
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

function getStatusColorBadge(status) {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'bg-amber-500/10 text-amber-600 border border-amber-100';
    if (s.includes('declined')) return 'bg-emerald-500/10 text-emerald-600 border border-emerald-100';
    if (s.includes('approved')) return 'bg-rose-500/10 text-rose-600 border border-rose-100';
    return 'bg-slate-500/10 text-slate-600 border border-slate-100';
}

// Sub-components
function DataCard({ title, children, hasFilter }) {
    return (
        <div className="bg-white p-6 rounded-[22px] shadow-sm border border-slate-200/50 flex flex-col h-full min-h-[300px] transition-all hover:shadow-lg hover:shadow-slate-200/40">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-slate-800 text-sm tracking-tight uppercase opacity-80">{title}</h3>
                {hasFilter && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] text-slate-500 font-bold cursor-pointer hover:bg-white transition-colors">
                        Last 30 days <ChevronDown size={10} />
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}

function Badge({ text, color }) {
    return (
        <span className={`${color} px-2.5 py-0.5 rounded-full whitespace-nowrap text-[10px] font-bold tracking-tight shadow-sm`}>
            {text}
        </span>
    );
}

function getStatusColor(status) {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'bg-orange-500';
    if (s.includes('declined')) return 'bg-emerald-800'; // Match image's green for declined for some reason? Wait, let's check image.
    // In image: Approved is Red, Declined is Green/Dark Blue? 
    // Wait: Pending (Orange), Declined (Greenish/Turquoise), Declined (Greenish), Approved (Dark Red).
    // Let's match image exactly:
    if (s.includes('pending')) return 'bg-[#f59e0b]';
    if (s.includes('declined')) return 'bg-[#065f46]';
    if (s.includes('approved')) return 'bg-[#991b1b]';
    return 'bg-slate-600';
}

function getChannelColor(index) {
    const colors = [
        '#22d3ee', // Mississauga
        '#38bdf8', // Oakville
        '#60a5fa', // Brampton
        '#818cf8', // Saskatoon
        '#a78bfa', // B2B Online
        '#db2777', // B2C Website
        '#991b1b'  // eBay
    ];
    return colors[index % colors.length];
}
