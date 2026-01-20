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
        Schema::create('fitments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->year('year_from')->index();
            $table->year('year_to')->index();
            $table->string('make')->index();
            $table->string('model')->index();

            $table->timestamps();

            $table->index(
                ['make', 'model', 'year_from', 'year_to'],
                'idx_fitments_vehicle'
            );
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fitments');
    }
};
