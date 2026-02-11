import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import { 
    User, 
    Plus, 
    Search,
    Mail,
    Edit3,
    Trash2
} from "lucide-react";


const Staff = ({ staff, roles, permissions }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStaff = staff.filter(user => 
        `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <Head title="Staff Management" />
            
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Access Control</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage roles, permissions and staff access</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-100 mb-8">
                    <Link 
                        href={route('admin.settings.roles.index')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${
                            route().current('admin.settings.roles.index') ? 'text-[#FF9F43]' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Roles
                        {route().current('admin.settings.roles.index') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43]" />}
                    </Link>
                    <Link 
                        href={route('admin.settings.permissions.index')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${
                            route().current('admin.settings.permissions.index') ? 'text-[#FF9F43]' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Permissions
                        {route().current('admin.settings.permissions.index') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43]" />}
                    </Link>
                    <Link 
                        href={route('admin.settings.staff.index')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${
                            route().current('admin.settings.staff.index') ? 'text-[#FF9F43]' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Staff Management
                        {route().current('admin.settings.staff.index') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43]" />}
                    </Link>
                </div>

                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Staff</h2>
                        <p className="text-sm text-gray-400 mt-1">Manage team access and permissions</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search..."
                                className="bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-1 focus:ring-gray-300 outline-none transition-all"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link 
                            href={route('admin.settings.staff.create')}
                            className="bg-[#FF9F43] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#e68a2e] transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Add Staff
                        </Link>
                    </div>
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-xl border border-gray-100">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Staff</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Access</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStaff.map((user) => (
                                <StaffRow key={user.id} user={user} roles={roles} allPermissions={permissions} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

const StaffRow = ({ user, roles, allPermissions }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing } = useForm({
        roles: user.roles.map(r => r.name),
        permissions: user.permissions.map(p => p.name),
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.settings.staff.access.update", user.id), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={20} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => {
                                        const current = [...data.roles];
                                        const index = current.indexOf(role.name);
                                        if (index > -1) current.splice(index, 1);
                                        else current.push(role.name);
                                        setData("roles", current);
                                    }}
                                    className={`px-3 py-1 rounded text-xs border transition-colors ${
                                        data.roles.includes(role.name) 
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {role.name}
                                </button>
                            ))}
                        </div>
                        
                        <div className="pt-2">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Direct Permissions</div>
                            <div className="flex flex-wrap gap-1">
                                {allPermissions.map(perm => (
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
                                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                                            data.permissions.includes(perm.name) 
                                                ? "bg-orange-100 text-[#e68a2e] border-orange-200"
                                                : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
                                        }`}
                                    >
                                        {perm.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                            {user.roles
                                ?.filter(role => role.name !== 'Admin')
                                .slice(0, 2).map(role => (
                                <span key={role.id} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
                                    {role.name}
                                </span>
                            ))}
                            {user.roles?.filter(role => role.name !== 'Admin').length > 2 && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                                    +{user.roles.filter(role => role.name !== 'Admin').length - 2}
                                </span>
                            )}
                        </div>
                        {user.permissions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {user.permissions.map(perm => (
                                    <span key={perm.id} className="px-1.5 py-0.5 bg-orange-50 text-[#e68a2e] rounded text-[9px] font-medium border border-orange-100">
                                        {perm.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 text-right">
                {isEditing ? (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={submit}
                            disabled={processing}
                            className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save"}
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1.5 text-gray-700 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="Edit access"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button 
                            onClick={() => {
                                if (confirm(`Delete ${user.first_name}?`)) {
                                    router.delete(route("admin.settings.staff.destroy", user.id));
                                }
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete staff"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default Staff;
