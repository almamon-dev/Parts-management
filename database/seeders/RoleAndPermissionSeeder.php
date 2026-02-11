<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'orders.view',
            'orders.manage',
            'returns.view',
            'returns.approve_decline',
            'leads.view',
            'leads.create',
            'leads.edit',
            'leads.delete',
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'blogs.view',
            'blogs.manage',
            'support_tickets.view',
            'support_tickets.manage',
            'announcements.view',
            'announcements.manage',
            'settings.access',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Roles and Assign Permissions

        // Super Admin
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->syncPermissions(Permission::all());

        // Admin
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions([
            'orders.view',
            'orders.manage',
            'returns.view',
            'returns.approve_decline',
            'leads.view',
            'leads.create',
            'leads.edit',
            'products.view',
            'products.create',
            'products.edit',
            'blogs.view',
            'blogs.manage',
            'support_tickets.view',
            'support_tickets.manage',
            'announcements.view',
            'announcements.manage',
            'settings.access',
        ]);

        // Manager
        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $manager->syncPermissions([
            'orders.view',
            'orders.manage',
            'returns.view',
            'leads.view',
            'leads.create',
            'leads.edit',
            'products.view',
            'products.create',
            'products.edit',
            'blogs.view',
            'blogs.manage',
            'support_tickets.view',
            'support_tickets.manage',
        ]);

        // Supervisor
        $supervisor = Role::firstOrCreate(['name' => 'Supervisor']);
        $supervisor->syncPermissions([
            'orders.view',
            'orders.manage',
            'leads.view',
            'leads.create',
            'leads.edit',
            'products.view',
            'products.create',
            'products.edit',
            'support_tickets.view',
            'support_tickets.manage',
        ]);

        // Parts Specialist
        $partsSpecialist = Role::firstOrCreate(['name' => 'Parts Specialist']);
        $partsSpecialist->syncPermissions([
            'products.view',
            'products.create',
        ]);

        // Sales Associate
        $salesAssociate = Role::firstOrCreate(['name' => 'Sales Associate']);
        $salesAssociate->syncPermissions([
            'leads.view',
            'leads.create',
            'products.view',
            'products.create',
        ]);

        // Assign roles to staff users
        $adminUsers = \App\Models\User::where('user_type', 'admin')->get();
        foreach ($adminUsers as $index => $user) {
            $user->assignRole('Admin');
            
            if ($index === 0) {
                $user->assignRole('Super Admin');
            }
        }
    }
}
