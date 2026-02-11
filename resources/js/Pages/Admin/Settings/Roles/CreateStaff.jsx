import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { 
    Shield, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    Key,
    ArrowLeft,
    Check
} from "lucide-react";

const CreateStaff = ({ roles, permissions }) => {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        roles: [],
        permissions: [],
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.settings.staff.store"));
    };

    return (
        <AdminLayout>
            <Head title="Create Staff Member" />
            
            <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link 
                        href={route('admin.settings.staff.index')}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Staff List
                    </Link>
                    <h1 className="text-2xl font-semibold text-gray-900">Add Staff Member</h1>
                    <p className="text-sm text-gray-500 mt-1">Create a new administrative account with specific roles and permissions</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 mb-6">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 text-left block">First Name</label>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                                        placeholder="John"
                                        value={data.first_name}
                                        onChange={e => setData("first_name", e.target.value)}
                                    />
                                    {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 text-left block">Last Name</label>
                                    <input 
                                        type="text"
                                        required
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                                        placeholder="Doe"
                                        value={data.last_name}
                                        onChange={e => setData("last_name", e.target.value)}
                                    />
                                    {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 text-left block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type="email"
                                            required
                                            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                                            placeholder="john@example.com"
                                            value={data.email}
                                            onChange={e => setData("email", e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 text-left block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                                            placeholder="••••••••"
                                            value={data.password}
                                            onChange={e => setData("password", e.target.value)}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Access Control */}
                        <div className="p-8 bg-gray-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Roles */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">Assign Roles</h3>
                                            <p className="text-xs text-gray-500">Grant high-level group permissions</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {roles.map(role => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => {
                                                    const current = [...data.roles];
                                                    const index = current.indexOf(role.name);
                                                    if (index > -1) current.splice(index, 1);
                                                    else current.push(role.name);
                                                    setData("roles", current);
                                                }}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${
                                                    data.roles.includes(role.name)
                                                        ? "bg-white border-[#FF9F43] shadow-md ring-1 ring-[#FF9F43]"
                                                        : "bg-white border-gray-100 hover:border-gray-300"
                                                }`}
                                            >
                                                <div>
                                                    <p className={`text-sm font-semibold ${data.roles.includes(role.name) ? 'text-[#FF9F43]' : 'text-gray-700'}`}>
                                                        {role.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{role.permissions?.length || 0} permissions</p>
                                                </div>
                                                {data.roles.includes(role.name) && (
                                                    <div className="w-5 h-5 rounded-full bg-[#FF9F43] text-white flex items-center justify-center">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Direct Permissions */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Key size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">Direct Permissions</h3>
                                            <p className="text-xs text-gray-500">Add specific access rights</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-100 p-4 max-h-[400px] overflow-y-auto">
                                        <div className="grid grid-cols-1 gap-1">
                                            {permissions.map(perm => {
                                                const isSelected = data.permissions.includes(perm.name);
                                                return (
                                                    <button
                                                        key={perm.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = [...data.permissions];
                                                            const index = current.indexOf(perm.name);
                                                            if (index > -1) current.splice(index, 1);
                                                            else current.push(perm.name);
                                                            setData("permissions", current);
                                                        }}
                                                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                                                            isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span className={`text-xs font-medium ${isSelected ? 'text-[#FF9F43]' : 'text-gray-600'}`}>
                                                            {perm.name.replace('.', ' / ')}
                                                        </span>
                                                        {isSelected && <Check size={14} className="text-[#FF9F43]" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-white">
                            <Link 
                                href={route('admin.settings.staff.index')}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#FF9F43] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#e68a2e] transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
                            >
                                {processing ? "Creating..." : "Create Staff Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateStaff;
