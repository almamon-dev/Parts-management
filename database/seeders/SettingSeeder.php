<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'site_name',
                'value' => 'Oakville Warehouse',
                'group' => 'general',
            ],
            [
                'key' => 'address',
                'value' => "2416 Wyecroft Road, Unit 1,\nOakville, ON, L6L 6M6",
                'group' => 'general',
            ],
            [
                'key' => 'contact_phone',
                'value' => '+1 (905) 555-0123',
                'group' => 'general',
            ],
            [
                'key' => 'contact_email',
                'value' => 'info@oakvillewarehouse.com',
                'group' => 'general',
            ],
            [
                'key' => 'currency',
                'value' => 'USD',
                'group' => 'general',
            ],

            // Logo & Branding
            [
                'key' => 'site_logo',
                'value' => null,
                'group' => 'branding',
            ],
            [
                'key' => 'site_favicon',
                'value' => null,
                'group' => 'branding',
            ],

            // Stripe Settings
            [
                'key' => 'stripe_publishable_key',
                'value' => env('STRIPE_KEY', 'pk_test_placeholder'),
                'group' => 'payment',
            ],
            [
                'key' => 'stripe_secret_key',
                'value' => env('STRIPE_SECRET', 'sk_test_placeholder'),
                'group' => 'payment',
            ],
            [
                'key' => 'stripe_webhook_secret',
                'value' => env('STRIPE_WEBHOOK_SECRET', 'whsec_placeholder'),
                'group' => 'payment',
            ],

            // Social Links
            [
                'key' => 'facebook_url',
                'value' => 'https://facebook.com',
                'group' => 'social',
            ],
            [
                'key' => 'twitter_url',
                'value' => 'https://twitter.com',
                'group' => 'social',
            ],
            // Tax Settings
            [
                'key' => 'tax_percentage',
                'value' => '13',
                'group' => 'general',
            ],
            [
                'key' => 'tax_label',
                'value' => 'HST 13%',
                'group' => 'general',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                ]
            );
        }
    }
}
