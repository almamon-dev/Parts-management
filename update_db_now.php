<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

try {
    Schema::table('products', function (Blueprint $table) {
        if (!Schema::hasColumn('products', 'category_2_id')) {
            $table->unsignedBigInteger('category_2_id')->nullable()->after('sub_category_id');
            $table->foreign('category_2_id')->references('id')->on('categories')->nullOnDelete();
        }
        if (!Schema::hasColumn('products', 'category_3_id')) {
            $table->unsignedBigInteger('category_3_id')->nullable()->after('category_2_id');
            $table->foreign('category_3_id')->references('id')->on('categories')->nullOnDelete();
        }
    });
    echo "Successfully updated products table.\n";
} catch (\Exception $e) {
    echo "Error updating products: " . $e->getMessage() . "\n";
}
