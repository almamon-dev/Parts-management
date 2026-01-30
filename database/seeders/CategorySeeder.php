<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $defaultImage = 'img/Dashboard/56b144518c1fddbb5095d6b2844d7c5de67f040d.png';

        $subcategories = ['OEM Used', 'Aftermarket', 'OEM Take-Off'];

        $categories = [
            'Body Panel',
            'Lamps',
            'Mechanical',
            'Electrical',
            'Interior',
            'Tires / Wheels',
            'Accessories',
            'Performance',
            'Upgrades',
            'Vehicles',
            'Fluids / Paint / Oil',
        ];

        foreach ($categories as $categoryName) {
            $category = Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'image' => $defaultImage,
                'status' => 'active',
            ]);

            foreach ($subcategories as $subCategoryName) {
                $category->subCategories()->create([
                    'name' => $subCategoryName,
                    'status' => 'active',
                ]);
            }
        }
    }
}
