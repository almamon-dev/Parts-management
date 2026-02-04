<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $makes = ['TOYOTA', 'HONDA', 'FORD', 'BMW', 'AUDI'];
        $models = ['Camry', 'Civic', 'F-150', '3 Series', 'A4'];

        // Get categories for each tier
        $cat1 = Category::where('category_type', 1)->get();
        $cat2 = Category::where('category_type', 2)->get();
        $cat3 = Category::where('category_type', 3)->get();

        for ($i = 1; $i <= 50; $i++) {
            $make = $makes[array_rand($makes)];
            $model = $models[array_rand($models)];
            $basePrice = rand(50, 2000);

            $c1 = $cat1->random();
            $c2 = $cat2->random();
            $c3 = $cat3->random();

            $productId = DB::table('products')->insertGetId([
                'part_type_id' => $c1->id,
                'shop_view_id' => $c2->id,
                'sorting_id' => $c3->id,
                'description' => "High quality $make $model spare part #$i - {$c1->name} Grade",
                'buy_price' => $basePrice,
                'list_price' => $basePrice * 1.5,
                'sku' => 'SKU-'.strtoupper(substr($make, 0, 3)).'-'.str_pad($i, 5, '0', STR_PAD_LEFT),
                'location_id' => 'BIN-'.rand(100, 999),
                'stock_oakville' => rand(0, 50),
                'stock_mississauga' => rand(0, 50),
                'stock_saskatoon' => rand(0, 50),
                'visibility' => 'public',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add fitment
            DB::table('fitments')->insert([
                'product_id' => $productId,
                'year_from' => rand(2000, 2015),
                'year_to' => rand(2016, 2024),
                'make' => $make,
                'model' => $model,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add part numbers
            DB::table('parts_numbers')->insert([
                ['product_id' => $productId, 'part_number' => 'PN-'.rand(10000, 99999), 'created_at' => now(), 'updated_at' => now()],
                ['product_id' => $productId, 'part_number' => 'ALT-'.rand(10000, 99999), 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }
}
