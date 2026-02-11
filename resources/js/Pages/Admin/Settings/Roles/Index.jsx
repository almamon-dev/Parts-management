import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { 
    Shield,
    Plus,
    X,
    Lock,
    Key,
    Users,
    UserCircle,
    UserPlus,
    Trash2
} from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";

const Index = ({ roles, permissions }) => {
    const { auth } = usePage().props;
    const isSuperAdminUser = auth.user.roles.includes('Super Admin');

    const [selectedRole, setSelectedRole] = useState(roles[0] || null);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    
    const { data, setData, post, processing } = useForm({
        permissions: selectedRole ? selectedRole.permissions.map(p => p.name) : [],
    });

    const roleForm = useForm({ 
        name: "",
        permissions: []
    });

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setData("permissions", role.permissions.map(p => p.name));
    };

    const togglePermission = (permName) => {
        if (selectedRole?.name === 'Super Admin') return;
        const current = [...data.permissions];
        const index = current.indexOf(permName);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(permName);
        }
        setData("permissions", current);
    };

    const toggleRoleFormPermission = (permName) => {
        const current = [...roleForm.data.permissions];
        const index = current.indexOf(permName);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(permName);
        }
        roleForm.setData("permissions", current);
    };

    const submitPermissions = (e) => {
        e.preventDefault();
        post(route("admin.settings.roles.permissions.update", selectedRole.id), {
            preserveScroll: true,
        });
    };

    const submitNewRole = (e) => {
        e.preventDefault();
        roleForm.post(route("admin.settings.roles.store"), {
            onSuccess: () => {
                roleForm.reset();
                setShowAddRoleModal(false);
            },
        });
    };


    // Group permissions by first segment
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const [group] = perm.name.split('.');
        if (!acc[group]) acc[group] = [];
        acc[group].push(perm);
        return acc;
    }, {});

    return (
        <AdminLayout>
            <Head title="Access Control" />
            
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

                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex">
                    {/* Sidebar - Roles */}
                    <aside className="w-64 border-r border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-medium text-gray-900">Roles</h2>
                            <button 
                                onClick={() => setShowAddRoleModal(true)}
                                className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        
                        <div className="space-y-1">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                                        selectedRole?.id === role.id 
                                            ? "bg-[#FF9F43] text-white shadow-sm" 
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div onClick={() => handleRoleSelect(role)} className="flex-1">
                                            <div className="font-medium">{role.name}</div>
                                            <div className="text-xs opacity-75 mt-0.5">
                                                {role.permissions.length} permissions
                                            </div>
                                        </div>
                                        {role.name !== 'Admin' && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Are you sure you want to delete the ${role.name} role? This action cannot be undone.`)) {
                                                        router.delete(route("admin.settings.roles.destroy", role.id));
                                                    }
                                                }}
                                                className={`p-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all ${
                                                    selectedRole?.id === role.id ? 'text-white/70' : 'text-gray-400'
                                                }`}
                                                title="Delete Role"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-8">
                        {selectedRole ? (
                            <form onSubmit={submitPermissions} className="max-w-3xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#FF9F43]/10 rounded-xl flex items-center justify-center text-[#FF9F43]">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{selectedRole.name}</h2>
                                            <p className="text-sm text-gray-500">Configure access permissions</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit"
                                        disabled={processing || selectedRole.name === 'Super Admin'}
                                        onClick={submitPermissions}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                                            selectedRole.name === 'Super Admin' 
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed hidden" 
                                                : "bg-[#FF9F43] text-white hover:bg-[#e68a2e]"
                                        }`}
                                    >
                                        {processing ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>

                                {selectedRole.name === 'Admin' ? (
                                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-8 text-center space-y-3">
                                        <div className="w-16 h-16 bg-[#FF9F43]/10 rounded-full flex items-center justify-center mx-auto text-[#FF9F43]">
                                            <Shield size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Universal Access</h3>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            The <span className="font-bold text-gray-900">Admin</span> role has implicit access to all system features and permissions. No manual configuration is required.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-8">
                                        {Object.entries(groupedPermissions).map(([group, perms]) => (
                                            <div key={group} className="space-y-4">
                                                <h3 className="text-sm font-medium text-gray-900 pb-2 border-b border-gray-100 capitalize">
                                                    {group.replace('_', ' ')}
                                                </h3>
                                                <div className="space-y-3">
                                                    {perms.map(perm => {
                                                        const isChecked = data.permissions.includes(perm.name);
                                                        
                                                        return (
                                                            <label 
                                                                key={perm.id}
                                                                className="flex items-center justify-between cursor-pointer group"
                                                            >
                                                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                                                    {perm.name.split('.').slice(1).join(' ').replace('_', ' ')}
                                                                </span>
                                                                <div className="relative">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => togglePermission(perm.name)}
                                                                        className="sr-only"
                                                                    />
                                                                    <div className={`w-10 h-5 rounded-full transition-colors ${
                                                                        isChecked ? "bg-[#FF9F43]" : "bg-gray-200"
                                                                    }`}>
                                                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                                                                            isChecked ? "translate-x-5" : ""
                                                                        }`} />
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Lock size={40} className="mb-4" />
                                <p className="text-sm">Select a role to configure permissions</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Modals */}
            {showAddRoleModal && (
                <Modal 
                    title="New Role"
                    close={() => setShowAddRoleModal(false)}
                    form={roleForm}
                    onSubmit={submitNewRole}
                    placeholder="e.g. Moderator"
                    groupedPermissions={groupedPermissions}
                    togglePermission={toggleRoleFormPermission}
                />
            )}
        </AdminLayout>
    );
};

const Modal = ({ title, close, form, onSubmit, placeholder, groupedPermissions, togglePermission }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button onClick={close} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                </button>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-base">
                        <label className="text-sm font-medium text-gray-700">Role Name</label>
                        <input 
                            type="text"
                            required
                            autoFocus
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                            value={form.data.name}
                            onChange={e => form.setData("name", e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <Shield size={16} className="text-[#FF9F43]" />
                            Assign Initial Permissions
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                                <div key={group} className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                        {group.replace('_', ' ')}
                                    </h3>
                                    <div className="space-y-2.5">
                                        {perms.map(perm => {
                                            const isChecked = form.data.permissions.includes(perm.name);
                                            return (
                                                <label 
                                                    key={perm.id}
                                                    className="flex items-center justify-between cursor-pointer group"
                                                >
                                                    <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors truncate pr-2">
                                                        {perm.name.split('.').slice(1).join(' ').replace('_', ' ')}
                                                    </span>
                                                    <div className="relative shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => togglePermission(perm.name)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-8 h-4 rounded-full transition-colors ${
                                                            isChecked ? "bg-[#FF9F43]" : "bg-gray-200"
                                                        }`}>
                                                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${
                                                                isChecked ? "translate-x-4" : ""
                                                            }`} />
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-100 bg-gray-50/30 shrink-0">
                    <div className="flex gap-3">
                        <button 
                            type="submit"
                            disabled={form.processing}
                            className="flex-1 bg-[#FF9F43] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#e68a2e] transition-all disabled:opacity-50 shadow-md shadow-orange-100"
                        >
                            {form.processing ? "Creating..." : "Create Role with Permissions"}
                        </button>
                        <button 
                            type="button"
                            onClick={close}
                            className="px-6 py-2.5 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white hover:border-gray-300 transition-all bg-white shadow-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);

export default Index;
