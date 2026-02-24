<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            
            // Prezzi
            $table->decimal('price', 8, 2);
            $table->decimal('sale_price', 8, 2)->nullable();
            $table->decimal('shipping_cost', 8, 2)->default(5.00);
            
            // Varianti
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            
            // Immagini (Ora è un JSON Array per supportare multiple foto)
            $table->json('images')->nullable(); 
            
            // Organizzazione
            $table->string('collection')->default('classic');
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};