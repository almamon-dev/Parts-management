<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get all subcategories created by CategorySeeder
        $subCategories = SubCategory::all();

        if ($subCategories->isEmpty()) {
            $this->command->error('Please run CategorySeeder first!');
            return;
        }

        $carData = [
            'Toyota' => ['Corolla', 'Camry', 'RAV4'],
            'Honda' => ['Civic', 'Accord', 'CR-V'],
            'Ford' => ['F-150', 'Mustang', 'Explorer'],
            'Nissan' => ['Altima', 'Sentra', 'Rogue'],
        ];

        for ($i = 1; $i <= 2; $i++) {
            $make = array_rand($carData);
            $model = $carData[$make][array_rand($carData[$make])];
            
            // Pick a random subcategory and its parent category
            $subCategory = $subCategories->random();

            $basePrice = rand(250, 500);
            
            $productId = DB::table('products')->insertGetId([
                'category_id' => $subCategory->category_id,
                'sub_category_id' => $subCategory->id,
                'description' => "High quality $make $model spare part #$i - {$subCategory->name} Grade",
                'buy_price' => $basePrice,
                'list_price' => $basePrice,
                'stock_oakville' => rand(0, 100),
                'stock_mississauga' => rand(0, 100),
                'stock_saskatoon' => rand(0, 100),
                'sku' => strtoupper(Str::random(8)),
                'location_id' => 'LOC-'.rand(100, 999),
                'visibility' => 'public',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('fitments')->insert([
                'product_id' => $productId,
                'year_from' => rand(2010, 2018),
                'year_to' => rand(2019, 2024),
                'make' => $make,
                'model' => $model,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('parts_numbers')->insert([
                'product_id' => $productId,
                'part_number' => 'PN-'.rand(10000, 99999),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add a mock image
            DB::table('product_files')->insert([
                'product_id' => $productId,
                'file_name' => 'product-image.png',
                'file_path' => 'img/Dashboard/56b144518c1fddbb5095d6b2844d7c5de67f040d.png',
                'file_size' => rand(1000, 5000),
                'file_type' => 'image',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
