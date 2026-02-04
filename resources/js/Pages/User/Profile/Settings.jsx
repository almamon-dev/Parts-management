import React, { useState, useRef } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { 
    User, 
    Building2, 
    KeyRound, 
    Settings, 
    LogOut, 
    ChevronRight, 
    Eye, 
    EyeOff, 
    Camera,
    Bell,
    CheckCircle2,
    ArrowUpRight
} from "lucide-react";

export default function SettingsPage() {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState("account");
    const photoInput = useRef();

    // Account Info Form
    const accountForm = useForm({
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
        email: auth.user.email || "",
        phone_number: auth.user.phone_number || "",
    });

    // Company Info Form
    const companyForm = useForm({
        company_name: auth.user.company_name || "",
        position: auth.user.position || "",
        address: auth.user.address || "",
        account_type: auth.user.account_type || "Mechanic",
    });

    // Password Form
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // Preferences Form
    const preferencesForm = useForm({
        store_hours: auth.user.store_hours || { start_day: "Monday", end_day: "Friday", start_time: "09.00 AM", end_time: "05.00 PM" },
        marketing_emails: auth.user.marketing_emails || false,
        order_confirmation: auth.user.order_confirmation || false,
        order_cancellation: auth.user.order_cancellation || false,
        monthly_statement: auth.user.monthly_statement || false,
    });

    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            router.post(route('settings.photo.update'), {
                photo: file
            }, {
                forceFormData: true,
                onSuccess: () => {
                    // Success handling if needed
                }
            });
        }
    };

    const sidebarItems = [
        { id: "account", label: "Account Information", icon: User },
        { id: "company", label: "Company Information", icon: Building2 },
        { id: "password", label: "Password change", icon: KeyRound },
        { id: "preferences", label: "Preferences", icon: Settings },
    ];

    return (
        <>
            <Head title="Settings" />

            <div className="p-4 md:p-8 bg-[#F8F9FB] min-h-screen">
                <div className="max-w-9xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Card */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Profile Header */}
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="relative group mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 relative">
                                        {auth.user.profile_photo ? (
                                            <img 
                                                src={`/${auth.user.profile_photo}`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <User size={48} />
                                            </div>
                                        )}
                                        <div 
                                            onClick={() => photoInput.current.click()}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={photoInput} 
                                        onChange={handlePhotoUpload} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                    {auth.user.first_name} {auth.user.last_name}
                                </h3>
                                <p className="text-slate-400 text-sm mt-1 mb-1">{auth.user.email}</p>
                                <p className="text-slate-400 text-xs font-medium">Position: {auth.user.position || "Not Set"}</p>
                                
                                <button 
                                    onClick={() => photoInput.current.click()}
                                    className="mt-4 bg-[#AD0100] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-red-800 transition-colors"
                                >
                                    Edit Profile Photo
                                </button>
                            </div>

                            {/* Sidebar Menu */}
                            <div className="border-t border-slate-50 p-4 space-y-1">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                                            activeTab === item.id 
                                                ? "bg-[#FFF9F4] text-[#AD0100] font-bold" 
                                                : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === item.id ? "bg-[#FFF0E6] text-[#AD0100]" : "text-slate-400"}`}>
                                                <item.icon size={18} />
                                            </div>
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                        <ChevronRight size={16} className={activeTab === item.id ? "opacity-100" : "opacity-30"} />
                                    </button>
                                ))}
                                <button 
                                    onClick={() => router.post(route('logout'))}
                                    className="w-full flex items-center justify-between p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400">
                                            <LogOut size={18} />
                                        </div>
                                        <span className="text-sm font-semibold">Log Out</span>
                                    </div>
                                    <ChevronRight size={16} className="opacity-30" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Side */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 min-h-[600px]">
                            
                            {/* Header Section */}
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-12 h-12 bg-[#FFF8F1] rounded-2xl flex items-center justify-center text-[#F5B52E]">
                                    {(() => {
                                        const ActiveIcon = sidebarItems.find(i => i.id === activeTab)?.icon;
                                        return ActiveIcon ? <ActiveIcon size={24} /> : <Settings size={24} />;
                                    })()}
                                </div>
                                <h2 className="text-[22px] font-bold text-slate-900">
                                    {sidebarItems.find(i => i.id === activeTab)?.label}
                                </h2>
                            </div>

                            {/* Account Information Tab */}
                            {activeTab === "account" && (
                                <form onSubmit={(e) => { e.preventDefault(); accountForm.post(route('settings.account.update')) }} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[15px] font-bold text-slate-900 block">First Name</label>
                                            <input 
                                                type="text"
                                                value={accountForm.data.first_name}
                                                onChange={e => accountForm.setData("first_name", e.target.value)}
                                                placeholder="Enter your first name"
                                                className="w-full h-[54px] bg-[#F0F2F5] border-none rounded-[14px] px-6 text-[15px] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[15px] font-bold text-slate-900 block">Last Name</label>
                                            <input 
                                                type="text"
                                                value={accountForm.data.last_name}
                                                onChange={e => accountForm.setData("last_name", e.target.value)}
                                                placeholder="Enter your last name"
                                                className="w-full h-[54px] bg-white border border-[#E2E8F0] rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Email</label>
                                        <input 
                                            type="email"
                                            value={accountForm.data.email}
                                            readOnly
                                            className="w-full h-[54px] bg-[#F0F2F5] border-none rounded-[14px] px-6 text-[15px] text-slate-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Username</label>
                                        <input 
                                            type="text"
                                            value={auth.user.username}
                                            readOnly
                                            className="w-full h-[54px] bg-[#F0F2F5] border-none rounded-[14px] px-6 text-[15px] text-slate-500 cursor-not-allowed outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Phone Number</label>
                                        <input 
                                            type="text"
                                            value={accountForm.data.phone_number}
                                            onChange={e => accountForm.setData("phone_number", e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full h-[54px] bg-white border border-[#E2E8F0] rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none"
                                        />
                                    </div>
                                    <div className="pt-6 flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={accountForm.processing}
                                            className="bg-[#AD0100] text-white h-[54px] pl-8 pr-3 rounded-full font-bold flex items-center gap-4 hover:bg-[#8B0000] transition-all group"
                                        >
                                            Save Changes
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Company Information Tab */}
                            {activeTab === "company" && (
                                <form onSubmit={(e) => { e.preventDefault(); companyForm.post(route('settings.company.update')) }} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Company Name</label>
                                        <input 
                                            type="text"
                                            value={companyForm.data.company_name}
                                            onChange={e => companyForm.setData("company_name", e.target.value)}
                                            placeholder="e.g. Bay Mechanic Shop"
                                            className="w-full h-[54px] bg-[#F0F2F5] border-none rounded-[14px] px-6 text-[15px] outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Position</label>
                                        <input 
                                            type="text"
                                            value={companyForm.data.position}
                                            onChange={e => companyForm.setData("position", e.target.value)}
                                            placeholder="e.g. Manager"
                                            className="w-full h-[54px] bg-white border border-[#E2E8F0] rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Address</label>
                                        <textarea 
                                            rows="3"
                                            value={companyForm.data.address}
                                            onChange={e => companyForm.setData("address", e.target.value)}
                                            placeholder="Enter your company address"
                                            className="w-full bg-white border border-[#E2E8F0] rounded-[14px] px-6 py-4 text-[15px] focus:border-[#AD0100] transition-colors outline-none resize-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Account type</label>
                                        <select 
                                            value={companyForm.data.account_type}
                                            onChange={e => companyForm.setData("account_type", e.target.value)}
                                            className="w-full h-[54px] bg-white border border-[#E2E8F0] rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="Bodyshop">Bodyshop</option>
                                            <option value="Towing / Fleet Services">Towing / Fleet Services</option>
                                            <option value="Auto Part Store">Auto Part Store</option>
                                            <option value="Dealership">Dealership</option>
                                            <option value="Mechanic">Mechanic</option>
                                        </select>
                                    </div>
                                    <div className="pt-6 flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={companyForm.processing}
                                            className="bg-[#AD0100] text-white h-[54px] pl-8 pr-3 rounded-full font-bold flex items-center gap-4 hover:bg-[#8B0000] transition-all group"
                                        >
                                            Request to Change
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Password Change Tab */}
                            {activeTab === "password" && (
                                <form onSubmit={(e) => { e.preventDefault(); passwordForm.post(route('settings.password.update'), { onSuccess: () => passwordForm.reset() }) }} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Enter Current Password*</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword.current ? "text" : "password"}
                                                value={passwordForm.data.current_password}
                                                onChange={e => passwordForm.setData("current_password", e.target.value)}
                                                placeholder="••••••••••••"
                                                className={`w-full h-[54px] bg-white border ${passwordForm.errors.current_password ? 'border-red-400' : 'border-[#E2E8F0]'} rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none`}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {passwordForm.errors.current_password && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{passwordForm.errors.current_password}</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Enter New Password*</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword.new ? "text" : "password"}
                                                value={passwordForm.data.password}
                                                onChange={e => passwordForm.setData("password", e.target.value)}
                                                placeholder="••••••••••••"
                                                className={`w-full h-[54px] bg-white border ${passwordForm.errors.password ? 'border-red-400' : 'border-[#E2E8F0]'} rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none`}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {passwordForm.errors.password && <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{passwordForm.errors.password}</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 block">Confirm Password*</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword.confirm ? "text" : "password"}
                                                value={passwordForm.data.password_confirmation}
                                                onChange={e => passwordForm.setData("password_confirmation", e.target.value)}
                                                placeholder="••••••••••••"
                                                className="w-full h-[54px] bg-white border border-[#E2E8F0] rounded-[14px] px-6 text-[15px] focus:border-[#AD0100] transition-colors outline-none"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="bg-[#AD0100] text-white h-[54px] pl-8 pr-3 rounded-full font-bold flex items-center gap-4 hover:bg-[#8B0000] transition-all group"
                                        >
                                            Update Password
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === "preferences" && (
                                <form onSubmit={(e) => { e.preventDefault(); preferencesForm.post(route('settings.preferences.update')) }} className="space-y-8">
                                    {/* Store Hours */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 ml-1 tracking-wider uppercase">Store hours</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <select 
                                                value={preferencesForm.data.store_hours.start_day}
                                                onChange={e => preferencesForm.setData("store_hours", { ...preferencesForm.data.store_hours, start_day: e.target.value })}
                                                className="h-11 bg-slate-50 border border-slate-100 rounded-lg px-3 text-sm focus:ring-2 focus:ring-red-50 outline-none"
                                            >
                                                <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                                            </select>
                                            <select 
                                                value={preferencesForm.data.store_hours.end_day}
                                                onChange={e => preferencesForm.setData("store_hours", { ...preferencesForm.data.store_hours, end_day: e.target.value })}
                                                className="h-11 bg-slate-50 border border-slate-100 rounded-lg px-3 text-sm focus:ring-2 focus:ring-red-50 outline-none"
                                            >
                                                <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                                            </select>
                                            <select 
                                                value={preferencesForm.data.store_hours.start_time}
                                                onChange={e => preferencesForm.setData("store_hours", { ...preferencesForm.data.store_hours, start_time: e.target.value })}
                                                className="h-11 bg-slate-50 border border-slate-100 rounded-lg px-3 text-sm focus:ring-2 focus:ring-red-50 outline-none"
                                            >
                                                <option>09.00 AM</option><option>08.00 AM</option><option>07.00 AM</option>
                                            </select>
                                            <select 
                                                value={preferencesForm.data.store_hours.end_time}
                                                onChange={e => preferencesForm.setData("store_hours", { ...preferencesForm.data.store_hours, end_time: e.target.value })}
                                                className="h-11 bg-slate-50 border border-slate-100 rounded-lg px-3 text-sm focus:ring-2 focus:ring-red-50 outline-none"
                                            >
                                                <option>05.00 PM</option><option>04.00 PM</option><option>06.00 PM</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Email Toggles */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-slate-500 ml-1 tracking-wider uppercase">I would Like to receive</label>
                                        <div className="space-y-3">
                                            {[
                                                { id: "marketing_emails", label: "Marketing Emails" },
                                                { id: "order_confirmation", label: "Order Confirmation" },
                                                { id: "order_cancellation", label: "Order Cancellation" },
                                                { id: "monthly_statement", label: "Monthly Statement" },
                                            ].map((pref) => (
                                                <div key={pref.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                                                    <span className="text-sm font-semibold text-slate-700">{pref.label}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => preferencesForm.setData(pref.id, !preferencesForm.data[pref.id])}
                                                        className={`w-12 h-6 rounded-full transition-all duration-300 relative ${preferencesForm.data[pref.id] ? "bg-orange-400" : "bg-slate-200"}`}
                                                    >
                                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${preferencesForm.data[pref.id] ? "translate-x-6" : ""}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={preferencesForm.processing}
                                            className="bg-[#AD0100] text-white h-11 px-10 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg shadow-red-100/50"
                                        >
                                            Update Preferences
                                            <ArrowUpRight size={14} />
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
        </>
    );
}

SettingsPage.layout = page => <UserLayout children={page} />;
