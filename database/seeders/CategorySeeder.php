<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiers = [
            1 => [
                'Body Panel', 'Lamps', 'Mechanical', 'Interior', 'Tires / Wheels',
                'Accessories', 'Performance', 'Upgrades', 'Vehicles', 'Fluids / Paint / Oil',
            ],
            2 => [
                'OEM Used', 'Aftermarket', 'OEM Take-Off',
            ],
            3 => [
                'Front', 'Driver Side', 'Passenger Side', 'Rear', 'Inside',
            ],
        ];

        foreach ($tiers as $type => $names) {
            foreach ($names as $name) {
                Category::updateOrCreate(
                    ['name' => $name, 'category_type' => $type],
                    ['slug' => Str::slug($name), 'status' => 'active']
                );
            }
        }
    }
}
