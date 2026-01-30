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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('lead_number')->nullable()->unique();
            $table->string('po_number')->nullable();
            $table->string('shop_name')->nullable();
            $table->string('name'); // Required as per request
            $table->string('contact_number'); // Required as per request
            $table->string('email')->nullable();

            // Address
            $table->string('street_address')->nullable();
            $table->string('unit_number')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postcode')->nullable();
            $table->string('country')->nullable();

            $table->text('notes')->nullable();

            // Vehicle Info
            $table->string('vehicle_info'); // Required as per request
            $table->string('vin')->nullable();
            $table->string('color_code')->nullable();
            $table->string('engine_size')->nullable();

            $table->string('status')->default('Quote');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
