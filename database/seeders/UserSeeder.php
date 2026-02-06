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
        // 1. Admin Account
        User::create([
            'first_name' => 'System',
            'last_name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('12345678'),
            'user_type' => 'admin',
            'position' => 'Super Admin',
            'phone_number' => '01700000000',
            'company_name' => 'Lee Auto Parts',
            'company_phone' => '01700000000',
            'address' => 'Dhaka, Bangladesh',
            'account_type' => 'business',
            'is_verified' => true,
            'email_verified_at' => now(),
            'marketing_emails' => true,
            'order_confirmation' => true,
            'order_cancellation' => true,
            'monthly_statement' => true,
            'discount_rate' => 0,
            'total_purchases' => 0,
            'total_returns' => 0,
        ]);

        // 2-6. Five Normal B2B Users with Complete Data
        $normalUsers = [
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Rahman',
                'email' => 'ahmed@autoparts.com',
                'company_name' => 'Ahmed Auto Parts',
                'company_phone' => '01711111111',
                'phone_number' => '01711111111',
                'address' => 'Mirpur, Dhaka',
                'discount_rate' => 0,
                'total_purchases' => 0,
                'total_returns' => 0,
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Begum',
                'email' => 'fatima@motors.com',
                'company_name' => 'Fatima Motors',
                'company_phone' => '01722222222',
                'phone_number' => '01722222222',
                'address' => 'Uttara, Dhaka',
                'discount_rate' => 0,
                'total_purchases' => 0,
                'total_returns' => 0,
            ],
            [
                'first_name' => 'Karim',
                'last_name' => 'Hossain',
                'email' => 'karim@garage.com',
                'company_name' => 'Karim Auto Garage',
                'company_phone' => '01733333333',
                'phone_number' => '01733333333',
                'address' => 'Dhanmondi, Dhaka',
                'discount_rate' => 0,
                'total_purchases' => 0,
                'total_returns' => 0,
            ],
            [
                'first_name' => 'Nadia',
                'last_name' => 'Khan',
                'email' => 'nadia@parts.com',
                'company_name' => 'Nadia Car Parts',
                'company_phone' => '01744444444',
                'phone_number' => '01744444444',
                'address' => 'Gulshan, Dhaka',
                'discount_rate' => 0,
                'total_purchases' => 0,
                'total_returns' => 0,
            ],
            [
                'first_name' => 'Rahim',
                'last_name' => 'Uddin',
                'email' => 'rahim@auto.com',
                'company_name' => 'Rahim Auto Service',
                'company_phone' => '01755555555',
                'phone_number' => '01755555555',
                'address' => 'Banani, Dhaka',
                'discount_rate' => 0,
                'total_purchases' => 0,
                'total_returns' => 0,
            ],
        ];

        foreach ($normalUsers as $index => $userData) {
            User::create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => $userData['email'],
                'password' => Hash::make('12345678'),
                'user_type' => 'user',
                'position' => 'Manager',
                'phone_number' => $userData['phone_number'],
                'company_name' => $userData['company_name'],
                'company_phone' => $userData['company_phone'],
                'address' => $userData['address'],
                'account_type' => 'business',
                'store_hours' => [
                    'mon' => '09:00 AM - 06:00 PM',
                    'tue' => '09:00 AM - 06:00 PM',
                    'wed' => '09:00 AM - 06:00 PM',
                    'thu' => '09:00 AM - 06:00 PM',
                    'fri' => '09:00 AM - 02:00 PM',
                    'sat' => '09:00 AM - 06:00 PM',
                    'sun' => 'Closed',
                ],
                'is_verified' => true,
                'email_verified_at' => now(),
                'marketing_emails' => true,
                'order_confirmation' => true,
                'order_cancellation' => true,
                'monthly_statement' => false,
                'discount_rate' => $userData['discount_rate'],
                'total_purchases' => $userData['total_purchases'],
                'total_returns' => $userData['total_returns'],
            ]);
        }
    }
}
