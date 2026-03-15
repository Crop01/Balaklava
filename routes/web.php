<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

Route::get('/', function () {
    // Raggruppa i prodotti per collezione automaticamente
    // Il risultato sarà tipo: {'classic': [...], 'star': [...], 'summer': [...]}
    $collections = Product::where('is_active', true)
        ->get()
        ->groupBy('collection');

    $galleryPath = public_path('img/gallery');
    $galleryImages = [];

    if (File::exists($galleryPath)) {
        $files = File::files($galleryPath);
        foreach ($files as $file) {
            // Verifica che siano immagini (opzionale ma consigliato)
            if (in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                $galleryImages[] = '/img/gallery/' . $file->getFilename();
            }
        }
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'collections' => $collections, // Passiamo l'intera collezione raggruppata
        'galleryImages' => $galleryImages, // Passiamo le immagini della galleria
    ]);
})->name('home');

// --- DETTAGLIO PRODOTTO ---
Route::get('/shop/{slug}', function ($slug) {
    $product = Product::where('slug', $slug)->where('is_active', true)->firstOrFail();
    return Inertia::render('Product/Show', [
        'product' => $product
    ]);
})->name('product.show');

// --- CARRELLO (Nuova Rotta) ---
Route::get('/cart', function () {
    return Inertia::render('Cart/Index');
})->name('cart.index');

// --- GUIDA TAGLIE ---
Route::get('/guida-taglie', function () {
    return Inertia::render('SizeGuide');
})->name('size-guide');

// --- DASHBOARD ---
Route::get('/dashboard', function () {
    // Se l'utente è un Admin, lo mandiamo alla sua dashboard speciale
    if (auth()->user() && auth()->user()->is_admin) {
        return redirect()->route('admin.dashboard');
    }
    
    // Altrimenti mostriamo la dashboard utente normale (es. storico acquisti)
    $orders = \App\Models\Order::where('user_id', auth()->id())
        ->with('items') // Carica anche i dettagli dei prodotti
        ->latest()
        ->get();

    return Inertia::render('Dashboard', [
        'orders' => $orders
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// --- CHECKOUT (Nuove Rotte) ---
Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.create');
Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success/{id}', [OrderController::class, 'success'])->name('checkout.success');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- AREA ADMIN ---
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    
    // Dashboard Principale
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Gestione Ordini
    Route::get('/orders/{id}', [AdminController::class, 'show'])->name('admin.orders.show');
    Route::post('/orders/{id}/ship', [AdminController::class, 'ship'])->name('admin.orders.ship');

    // Gestione Prodotti (CRUD Completo)
    Route::resource('products', \App\Http\Controllers\AdminProductController::class)
        ->names([
            'index' => 'admin.products.index',
            'create' => 'admin.products.create',
            'store' => 'admin.products.store',
            'edit' => 'admin.products.edit',
            'update' => 'admin.products.update',
            'destroy' => 'admin.products.destroy',
        ]);

        
    // Rotte Galleria Marquee (Nomi corretti con admin.)
    Route::get('/gallery', [App\Http\Controllers\AdminGalleryController::class, 'index'])->name('admin.gallery.index');
    Route::post('/gallery', [App\Http\Controllers\AdminGalleryController::class, 'store'])->name('admin.gallery.store');
    Route::post('/gallery/delete', [App\Http\Controllers\AdminGalleryController::class, 'destroy'])->name('admin.gallery.destroy');
});

require __DIR__.'/auth.php';