<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Fitment;
use App\Models\PartsNumber;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to truncate
        Schema::disableForeignKeyConstraints();
        Product::truncate();
        Fitment::truncate();
        PartsNumber::truncate();
        Schema::enableForeignKeyConstraints();

        $models = [
            'BMW' => ['1 SERIES', '2 SERIES', '3 SERIES', '4 SERIES', '5 SERIES', '6 SERIES', '7 SERIES', 'I3', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z3', 'Z4'],
        ];

        $positions = ['Front', 'Driver Side', 'Passenger Side', 'Rear Side', 'Interior'];

        // Get categories for each tier
        $cat1 = Category::where('category_type', 1)->get();
        $cat2 = Category::where('category_type', 2)->get();
        $cat3 = Category::where('category_type', 3)->get();

        if ($cat1->isEmpty()) {
            return;
        }

        $count = 0;
        foreach ($positions as $pos) {
            for ($i = 0; $i < 5; $i++) {
                $count++;
                $make = 'BMW';
                $modelOptions = $models['BMW'];
                $modelName = $modelOptions[array_rand($modelOptions)];

                $basePrice = rand(50, 2000);

                $c1 = $cat1->random();
                $c2 = $cat2->count() > 0 ? $cat2->random() : null;
                $c3 = $cat3->count() > 0 ? $cat3->random() : null;

                $product = Product::create([
                    'part_type_id' => $c1->id,
                    'shop_view_id' => $c2 ? $c2->id : null,
                    'sorting_id' => $c3 ? $c3->id : null,
                    'description' => "High quality $make $modelName replacement part for $pos section - {$c1->name} Grade",
                    'buy_price' => $basePrice,
                    'list_price' => $basePrice * 1.5,
                    'sku' => 'SKU-'.strtoupper(substr($make, 0, 3)).'-'.str_pad($count, 5, '0', STR_PAD_LEFT).'-'.rand(1000, 9999),
                    'location_id' => 'BIN-'.rand(100, 999),
                    'position' => $pos,
                    'stock_oakville' => rand(0, 50),
                    'stock_mississauga' => rand(0, 50),
                    'stock_saskatoon' => rand(0, 50),
                    'visibility' => 'public',
                ]);

                // Add fitment
                $product->fitments()->create([
                    'year_from' => rand(2000, 2015),
                    'year_to' => rand(2016, 2024),
                    'make' => $make,
                    'model' => $modelName,
                ]);

                // Add part numbers
                $product->partsNumbers()->createMany([
                    ['part_number' => 'PN-'.rand(10000, 99999)],
                    ['part_number' => 'ALT-'.rand(10000, 99999)],
                ]);
            }
        }
    }
}
