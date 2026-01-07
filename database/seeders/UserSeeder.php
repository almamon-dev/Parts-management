<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin Account create kora
        User::create([
            'first_name' => 'System',
            'last_name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('12345678'), // default password
            'user_type' => 'admin',
            'position' => 'Super Admin',
            'phone_number' => '01700000000',
            'account_type' => 'business',
            'is_verified' => true,
            'marketing_emails' => true,
            'order_confirmation' => true,
        ]);

        // 2. Ekta Regular User create kora (Manual)
        User::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'username' => 'testuser',
            'email' => 'user@gmail.com',
            'password' => Hash::make('12345678'),
            'user_type' => 'user',
            'company_name' => 'Demo Company Ltd',
            'address' => 'Dhaka, Bangladesh',
            'store_hours' => [
                'mon' => '09:00 AM - 06:00 PM',
                'tue' => '09:00 AM - 06:00 PM',
                'fri' => 'Closed',
            ],
            'is_verified' => true,
            'order_confirmation' => true,
        ]);

        // 3. Loop dea kisu extra dummy users create kora (Optional)
        $users = [
            ['first' => 'Arif', 'last' => 'Hossain', 'email' => 'arif@example.com'],
            ['first' => 'Sara', 'last' => 'Islam', 'email' => 'sara@example.com'],
        ];

        foreach ($users as $u) {
            User::create([
                'first_name' => $u['first'],
                'last_name' => $u['last'],
                'email' => $u['email'],
                'password' => Hash::make('password'),
                'user_type' => 'user',
                'is_verified' => false,
            ]);
        }
    }
}
