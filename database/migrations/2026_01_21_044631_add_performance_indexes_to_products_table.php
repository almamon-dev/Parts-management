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
        Schema::table('products', function (Blueprint $table) {
            $table->index('visibility', 'idx_products_visibility');
            $table->index('part_type_id', 'idx_products_part_type_id');
            $table->index('shop_view_id', 'idx_products_shop_view_id');
            $table->index('sorting_id', 'idx_products_sorting_id');
            $table->index('sku', 'idx_products_sku');
            $table->index('created_at', 'idx_products_created_at');
            $table->index(['visibility', 'part_type_id', 'shop_view_id', 'sorting_id'], 'idx_products_filter_combo_tiers');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_filter_combo_tiers');
            $table->dropIndex('idx_products_visibility');
            $table->dropIndex('idx_products_part_type_id');
            $table->dropIndex('idx_products_shop_view_id');
            $table->dropIndex('idx_products_sorting_id');
            $table->dropIndex('idx_products_sku');
            $table->dropIndex('idx_products_created_at');
        });
    }
};
