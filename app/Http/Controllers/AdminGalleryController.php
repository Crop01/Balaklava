<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class AdminGalleryController extends Controller
{
    // Mostra la pagina con tutte le immagini
    public function index()
    {
        $galleryPath = public_path('img/gallery');
        $images = [];

        // Se la cartella esiste, leggi tutti i file
        if (File::exists($galleryPath)) {
            $files = File::files($galleryPath);
            foreach ($files as $file) {
                if (in_array(strtolower($file->getExtension()), ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                    $images[] = [
                        'name' => $file->getFilename(),
                        'url' => '/img/gallery/' . $file->getFilename(),
                    ];
                }
            }
        }

        return Inertia::render('Admin/Gallery/Index', [
            'images' => $images
        ]);
    }

    // Salva le nuove immagini caricate
    public function store(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096'
        ]);

        if ($request->hasFile('images')) {
            $galleryPath = public_path('img/gallery');
            
            // Crea la cartella se non esiste
            if (!File::exists($galleryPath)) {
                File::makeDirectory($galleryPath, 0755, true);
            }

            foreach ($request->file('images') as $image) {
                // Genera un nome univoco per evitare sovrascritture
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9_.]/', '', $image->getClientOriginalName());
                $image->move($galleryPath, $filename);
            }
        }

        return redirect()->back()->with('success', 'Immagini caricate con successo!');
    }

    // Elimina un'immagine
    public function destroy(Request $request)
    {
        $filename = $request->input('filename');
        $path = public_path('img/gallery/' . $filename);
        
        if (File::exists($path)) {
            File::delete($path);
        }

        return redirect()->back()->with('success', 'Immagine eliminata!');
    }
}