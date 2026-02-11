import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { 
    Key,
    Plus,
    X,
    Search,
    Shield,
    Check,
    Lock,
    User,
    Filter,
    ChevronDown,
    ChevronRight
} from "lucide-react";

const Permissions = ({ permissions, users }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    
    const permissionForm = useForm({ name: "" });

    const submitNewPermission = (e) => {
        e.preventDefault();
        permissionForm.post(route("admin.settings.permissions.store"), {
            onSuccess: () => {
                permissionForm.reset();
                setShowAddModal(false);
            },
        });
    };

    const togglePermissionForUser = (user, permName) => {
        const currentPerms = user.permissions.map(p => p.name);
        const index = currentPerms.indexOf(permName);
        
        let newPerms = [...currentPerms];
        if (index > -1) {
            newPerms.splice(index, 1);
        } else {
            newPerms.push(permName);
        }

        useForm({ permissions: newPerms }).post(route("admin.settings.users.permissions.update", user.id), {
            preserveScroll: true,
        });
    };

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const filteredPermissions = permissions.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group permissions by first segment
    const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
        const [group] = perm.name.split('.');
        if (!acc[group]) acc[group] = [];
        acc[group].push(perm);
        return acc;
    }, {});

    // Sort groups alphabetically
    const sortedGroups = Object.keys(groupedPermissions).sort();

    return (
        <AdminLayout>
            <Head title="User Permissions" />
            
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">User Permissions</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage individual user permissions directly</p>
                    </div>
                    {/* <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-[#FF9F43] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e68a2e] transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        New Permission
                    </button> */}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-100 mb-8">
                    <Link href={route('admin.settings.roles.index')} className={`pb-4 text-sm font-medium transition-colors relative ${route().current('admin.settings.roles.index') ? 'text-[#FF9F43]' : 'text-gray-500 hover:text-gray-700'}`}>
                        Roles
                    </Link>
                    <Link href={route('admin.settings.permissions.index')} className={`pb-4 text-sm font-medium transition-colors relative ${route().current('admin.settings.permissions.index') ? 'text-[#FF9F43]' : 'text-gray-500 hover:text-gray-700'}`}>
                        User Permissions
                        {route().current('admin.settings.permissions.index') && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9F43]" />}
                    </Link>
                    <Link href={route('admin.settings.staff.index')} className={`pb-4 text-sm font-medium transition-colors relative ${route().current('admin.settings.staff.index') ? 'text-[#FF9F43]' : 'text-gray-500 hover:text-gray-700'}`}>
                        Staff Management
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Permissions</div>
                        <div className="text-2xl font-bold text-gray-900">{permissions.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Active Users</div>
                        <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Permission Groups</div>
                        <div className="text-2xl font-bold text-gray-900">{sortedGroups.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Selected User</div>
                        <div className="text-2xl font-bold text-gray-900 truncate">{selectedUser ? selectedUser.name : 'None'}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* User List Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <User size={16} className="text-[#FF9F43]" />
                                    Select User
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Choose a user to manage permissions</p>
                                <div className="relative mt-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search users..."
                                        className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {users.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                                            selectedUser?.id === user.id ? 'bg-orange-50 border-l-4 border-[#FF9F43]' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                selectedUser?.id === user.id ? 'bg-[#FF9F43] text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {(user?.name || user?.first_name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${
                                                    selectedUser?.id === user.id ? 'text-[#FF9F43]' : 'text-gray-900'
                                                }`}>
                                                    {user?.name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Unknown')}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {user.roles
                                                        ?.filter(role => role.name !== 'Admin')
                                                        .slice(0, 2).map(role => (
                                                        <span key={role.id} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                    {user.roles?.filter(role => role.name !== 'Admin').length > 2 && (
                                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                                                            +{user.roles.filter(role => role.name !== 'Admin').length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Permissions Panel */}
                    <div className="flex-1">
                        {selectedUser ? (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* User Header */}
                                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-[#FF9F43] text-white flex items-center justify-center text-lg font-semibold`}>
                                                {(selectedUser?.name || selectedUser?.first_name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900">{selectedUser?.name || (selectedUser?.first_name ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'Unknown')}</h2>
                                                <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs font-medium text-gray-500">Roles:</span>
                                                    {selectedUser.roles
                                                        ?.filter(role => role.name !== 'Admin')
                                                        .map(role => (
                                                        <span key={role.id} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700">
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {selectedUser.permissions?.length || 0} direct permissions
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Permissions List */}
                                <div className="divide-y divide-gray-100">
                                    {sortedGroups.map(group => (
                                        <div key={group} className="hover:bg-gray-50/50">
                                            <button
                                                onClick={() => toggleGroup(group)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {expandedGroups[group] ? (
                                                        <ChevronDown size={16} className="text-gray-400" />
                                                    ) : (
                                                        <ChevronRight size={16} className="text-gray-400" />
                                                    )}
                                                    <span className="text-xs font-bold text-[#FF9F43] uppercase tracking-wider">
                                                        {group.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {groupedPermissions[group].length} permissions
                                                </span>
                                            </button>
                                            
                                            {expandedGroups[group] && (
                                                <div className="px-6 pb-4">
                                                    <div className="space-y-3">
                                                        {groupedPermissions[group].map(perm => {
                                                            const hasPermission = selectedUser.permissions?.some(p => p.name === perm.name);
                                                            return (
                                                                <div key={perm.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-gray-700">
                                                                            {perm.name.split('.').slice(1).join(' ').replace('_', ' ')}
                                                                        </p>
                                                                        <code className="text-[10px] text-gray-400">{perm.name}</code>
                                                                    </div>
                                                                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                                                                        <input 
                                                                            type="checkbox" 
                                                                            className="sr-only" 
                                                                            checked={hasPermission || false}
                                                                            onChange={() => togglePermissionForUser(selectedUser, perm.name)}
                                                                        />
                                                                        <div className={`w-11 h-6 rounded-full transition-colors ${
                                                                            hasPermission ? "bg-[#FF9F43]" : "bg-gray-200"
                                                                        }`}>
                                                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                                                                                hasPermission ? "translate-x-5" : ""
                                                                            }`} />
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={24} className="text-[#FF9F43]" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No User Selected</h3>
                                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                    Select a user from the sidebar to manage their individual permissions
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm shadow-xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">New Permission</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitNewPermission} className="p-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <input 
                                        type="text"
                                        required
                                        autoFocus
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#FF9F43] focus:border-[#FF9F43] outline-none"
                                        value={permissionForm.data.name}
                                        onChange={e => permissionForm.setData("name", e.target.value)}
                                        placeholder="e.g. orders.edit"
                                    />
                                    <p className="text-[10px] text-gray-400">Use dot notation: group.action</p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="submit"
                                        disabled={permissionForm.processing}
                                        className="flex-1 bg-[#FF9F43] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#e68a2e] transition-colors disabled:opacity-50"
                                    >
                                        {permissionForm.processing ? "Creating..." : "Create"}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Permissions;
