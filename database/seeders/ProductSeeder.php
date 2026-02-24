<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Pulisce la tabella
        Product::truncate();

        $products = [
            [
                'name' => 'Cappellino Pescatore',
                // Specifica solo il nome della cartella che hai in public/img/products/
                'folder' => 'cappellino-pescatore', 
                'price' => 45.00,
                'sale_price' => 35.00,
                'sizes' => ['XS-S', 'M-L'],
                'collection' => 'classic',
                'description' => 'Cappellino stile pescatore, fit comodo.',
            ],
            [
                'name' => 'Cappellino BLKLV',
                'folder' => 'cappellino-blklv',
                'price' => 35.00,
                'sale_price' => 25.00,
                'sizes' => ['Regolabile'],
                'collection' => 'classic',
                'description' => 'Cappellino con visiera, fit regolabile.',
            ],
            [
                'name' => 'Maglia BKLF Classic',
                'folder' => 'maglia-classic',
                'price' => 40.00,
                'sale_price' => 30.00,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'collection' => 'classic',
                'description' => 'T-shirt classica fit normale.',
            ],
            [
                'name' => 'Maglia Star Edition',
                'folder' => 'maglia-star',
                'price' => 40.00,
                'sale_price' => 30.00,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['Nero', 'Grigio Scuro'],
                'collection' => 'star',
                'description' => 'Edizione speciale Star.',
            ],
            [
                'name' => 'Hoodie BKLF Classic',
                'folder' => 'hoodie-classic',
                'price' => 80.00,
                'sale_price' => 60.00,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'collection' => 'classic',
                'description' => 'Felpa con cappuccio classica. 100% Cotone.',
            ],
            [
                'name' => 'Hoodie Star Edition',
                'folder' => 'hoodie-star',
                'price' => 80.00,
                'sale_price' => 60.00,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'collection' => 'star',
                'description' => 'Felpa Star Edition, fit premium.',
            ],
        ];

        foreach ($products as $product) {
            
            // LOGICA AUTOMATICA PER LE IMMAGINI
            $imagePaths = [];
            
            // Percorso assoluto della cartella sul tuo computer
            $absolutePath = public_path('img/products/' . $product['folder']);
            
            // Se la cartella esiste, cerchiamo i file
            if (File::exists($absolutePath)) {
                // Cerca tutti i file immagine
                $files = File::files($absolutePath);
                
                foreach ($files as $file) {
                    // Costruiamo il percorso web (es: /img/products/nome/1.jpg)
                    $imagePaths[] = '/img/products/' . $product['folder'] . '/' . $file->getFilename();
                }
                
                // Ordiniamo i file per nome (così 1.jpg viene prima di 2.jpg)
                sort($imagePaths);
            }

            Product::create([
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'description' => $product['description'],
                'price' => $product['price'],
                'sale_price' => $product['sale_price'],
                'shipping_cost' => 5.00,
                'sizes' => isset($product['sizes']) ? $product['sizes'] : null,
                'colors' => isset($product['colors']) ? $product['colors'] : null,
                'collection' => $product['collection'],
                'images' => $imagePaths, // Inserisce le immagini trovate automaticamente
            ]);
        }
    }
}