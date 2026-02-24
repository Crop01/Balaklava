<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    /**
     * Mostra la lista dei prodotti.
     */
    public function index()
    {
        // Prende tutti i prodotti, ordinati per ID decrescente (dal più nuovo)
        $products = Product::latest()->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Mostra il form per creare un nuovo prodotto.
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    /**
     * Salva un nuovo prodotto nel database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'collection' => 'required|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|string', // Arriva come stringa "Nero, Bianco"
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:4096' // Max 4MB per foto
        ]);

        // Gestione Immagini
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Salva nello storage pubblico (storage/app/public/products)
                $path = $image->store('products', 'public');
                // Aggiungi prefisso per accesso web
                $imagePaths[] = '/storage/' . $path;
            }
        }

        // Gestione Colori (da stringa a array)
        $colorsArray = $validated['colors'] 
            ? array_map('trim', explode(',', $validated['colors'])) 
            : null;

        // Generazione Slug Univoco
        $slug = Str::slug($validated['name']);
        // Se esiste già uno slug uguale, aggiungiamo un timestamp per renderlo unico
        if (Product::where('slug', $slug)->exists()) {
            $slug .= '-' . time();
        }

        Product::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'],
            'description' => $validated['description'],
            'collection' => strtolower($validated['collection']),
            'sizes' => $validated['sizes'],
            'colors' => $colorsArray,
            'images' => $imagePaths,
            'shipping_cost' => 5.00
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Prodotto creato con successo.');
    }

    /**
     * Mostra il form per modificare un prodotto esistente.
     */
    public function edit($id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('Admin/Products/Edit', ['product' => $product]);
    }

    /**
     * Aggiorna un prodotto esistente.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'collection' => 'required|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|string', // Arriva come stringa
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096'
        ]);

        // Gestione Immagini: Aggiungiamo le nuove a quelle esistenti
        $imagePaths = $product->images ?? [];
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = '/storage/' . $path;
            }
        }

        // Gestione Colori
        $colorsArray = $validated['colors'] 
            ? array_map('trim', explode(',', $validated['colors'])) 
            : null;

        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'],
            'description' => $validated['description'],
            'collection' => $validated['collection'],
            'sizes' => $validated['sizes'],
            'colors' => $colorsArray,
            'images' => $imagePaths,
        ]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Prodotto aggiornato con successo.');
    }

    /**
     * Elimina un prodotto dal database.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Opzionale: Eliminare anche i file fisici delle immagini
        // if ($product->images) {
        //     foreach ($product->images as $img) {
        //         // Rimuovi '/storage/' per ottenere il path relativo
        //         $relativePath = str_replace('/storage/', '', $img);
        //         Storage::disk('public')->delete($relativePath);
        //     }
        // }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Prodotto eliminato correttamente.');
    }
}