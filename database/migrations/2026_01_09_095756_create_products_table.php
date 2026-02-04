<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('part_type_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('shop_view_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('sorting_id')->nullable()->constrained('categories')->nullOnDelete();

            $table->text('description');

            $table->decimal('buy_price', 10, 2)->nullable();
            $table->decimal('list_price', 10, 2);

            $table->integer('stock_oakville')->default(0);
            $table->integer('stock_mississauga')->default(0);
            $table->integer('stock_saskatoon')->default(0);

            $table->string('sku')->unique()->index();
            $table->string('location_id')->nullable();

            $table->enum('visibility', ['private', 'public', 'draft'])
                ->default('public')
                ->index();

            $table->timestamps();

            $table->index(
                ['visibility', 'part_type_id', 'shop_view_id', 'sorting_id'],
                'idx_products_visibility_tiers'
            );
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
