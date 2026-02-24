<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabella Ordini (Info Cliente e Totale)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Se l'utente è registrato lo colleghiamo, altrimenti NULL (ospite)
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            
            // Dati Spedizione
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('zip_code');
            $table->string('province', 2)->nullable(); // Sigla provincia
            
            // Dati Economici
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_cost', 10, 2);
            $table->decimal('total', 10, 2);
            
            // Stato Ordine
            $table->string('status')->default('pending'); // pending, paid, shipped, completed, cancelled
            $table->string('payment_method')->default('cod'); // cod = cash on delivery (contrassegno), stripe, paypal
            
            $table->timestamps();
        });

        // 2. Tabella Oggetti nell'Ordine (Snapshot dei prodotti)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete(); // Se il prodotto viene cancellato, rimane lo storico
            
            $table->string('product_name'); // Salviamo il nome storico
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // Prezzo unitario al momento dell'acquisto
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};