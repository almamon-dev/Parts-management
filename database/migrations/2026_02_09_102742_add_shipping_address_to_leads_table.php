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
        Schema::table('leads', function (Blueprint $table) {
            $table->string('shipping_street_address')->nullable()->after('country');
            $table->string('shipping_unit_number')->nullable()->after('shipping_street_address');
            $table->string('shipping_city')->nullable()->after('shipping_unit_number');
            $table->string('shipping_province')->nullable()->after('shipping_city');
            $table->string('shipping_postcode')->nullable()->after('shipping_province');
            $table->string('shipping_country')->nullable()->after('shipping_postcode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_street_address',
                'shipping_unit_number',
                'shipping_city',
                'shipping_province',
                'shipping_postcode',
                'shipping_country',
            ]);
        });
    }
};
