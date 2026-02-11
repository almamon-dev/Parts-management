<?php

namespace App\Http\Controllers\Admin\Role;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->whereNotIn('name', ['Admin'])->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Settings/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function permissionsIndex()
    {
        $permissions = Permission::all();
        $users = User::where('user_type', 'staff')
            ->select('*', \Illuminate\Support\Facades\DB::raw("CONCAT(first_name, ' ', last_name) as name"))
            ->with(['roles', 'permissions'])
            ->get();
        $roles = Role::with('permissions')->whereNotIn('name', ['Admin'])->get();

        return Inertia::render('Admin/Settings/Roles/Permissions', [
            'permissions' => $permissions,
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function updateUserPermissions(Request $request, User $user)
    {
        $user->syncPermissions($request->permissions);
        return back()->with('success', 'User permissions updated successfully.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $request->name]);
        
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return back()->with('success', 'Role created successfully.');
    }

    public function updatePermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'array',
        ]);

        $role->syncPermissions($request->permissions);

        return back()->with('success', 'Permissions updated successfully.');
    }

    public function storePermission(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        Permission::create(['name' => $request->name]);

        return back()->with('success', 'Permission created successfully.');
    }

    public function destroy(Role $role)
    {

        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }

    public function staffIndex()
    {
        $staff = User::where('user_type', 'staff')->with(['roles', 'permissions'])->get();
        $roles = Role::with('permissions')->whereNotIn('name', ['Admin'])->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Settings/Roles/Staff', [
            'staff' => $staff,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function createStaff()
    {
        $roles = Role::with('permissions')->whereNotIn('name', ['Admin'])->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Settings/Roles/CreateStaff', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function updateUserAccess(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user->syncRoles($request->roles);
        $user->syncPermissions($request->permissions);

        return back()->with('success', 'User access updated successfully.');
    }
    public function storeStaff(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => 'staff',
            'is_verified' => true, // Auto-verify staff
            'email_verified_at' => now(),
        ]);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('admin.settings.staff.index')->with('success', 'Staff member created successfully.');
    }

    public function destroyStaff(User $user)
    {
        if ($user->user_type === 'admin') {
            return back()->withErrors(['error' => 'Admin users cannot be deleted via this panel.']);
        }

        if ($user->id === \Illuminate\Support\Facades\Auth::id()) {
            return back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user->delete();

        return back()->with('success', 'Staff member deleted successfully.');
    }
}
