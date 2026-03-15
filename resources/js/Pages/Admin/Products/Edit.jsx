import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditProduct({ product }) {
    
    const initialColors = product.colors ? product.colors.join(', ') : '';

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: product.name,
        price: product.price,
        sale_price: product.sale_price || '',
        description: product.description || '',
        collection: product.collection,
        sizes: product.sizes || [],
        colors: initialColors,
        existing_images: product.images || [], 
        images: [], 
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const availableSizes = ['Regolabile', 'XS-S', 'M-L', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleSizeChange = (size) => {
        if (data.sizes.includes(size)) {
            setData('sizes', data.sizes.filter(s => s !== size));
        } else {
            setData('sizes', [...data.sizes, size]);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    // --- NUOVE FUNZIONI PER ORDINARE LE IMMAGINI ---
    
    const removeExistingImage = (indexToRemove) => {
        setData('existing_images', data.existing_images.filter((_, idx) => idx !== indexToRemove));
    };

    const moveImageLeft = (idx) => {
        if (idx === 0) return;
        const newImages = [...data.existing_images];
        [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
        setData('existing_images', newImages);
    };

    const moveImageRight = (idx) => {
        if (idx === data.existing_images.length - 1) return;
        const newImages = [...data.existing_images];
        [newImages[idx + 1], newImages[idx]] = [newImages[idx], newImages[idx + 1]];
        setData('existing_images', newImages);
    };

    const makeCover = (idx) => {
        if (idx === 0) return;
        const newImages = [...data.existing_images];
        const [movedImage] = newImages.splice(idx, 1);
        newImages.unshift(movedImage);
        setData('existing_images', newImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
    };

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title={`Modifica ${product.name}`} />
            
            <nav className="border-b border-gray-800 bg-[#121212] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-black uppercase text-xl text-white tracking-tighter">
                    Admin <span className="text-gray-500">/ Modifica Prodotto</span>
                </div>
                <Link href={route('admin.products.index')} className="text-xs font-bold uppercase tracking-widest hover:text-white text-gray-400">
                    Annulla
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="bg-[#121212] border border-gray-800 p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-gray-800 pb-2">Info Generali</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nome Prodotto</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm focus:border-red-500 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prezzo (€)</label>
                                <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm focus:border-red-500 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prezzo Scontato</label>
                                <input type="number" step="0.01" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm focus:border-red-500 focus:ring-red-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Collezione</label>
                                <input type="text" value={data.collection} onChange={e => setData('collection', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm focus:border-red-500 focus:ring-red-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Descrizione</label>
                                <textarea rows="4" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm focus:border-red-500 focus:ring-red-500"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-gray-800 p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-gray-800 pb-2">Varianti</h2>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Taglie</label>
                            <div className="flex flex-wrap gap-4">
                                {availableSizes.map(size => (
                                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={data.sizes.includes(size)} onChange={() => handleSizeChange(size)} className="bg-black border-gray-700 text-red-600 focus:ring-red-500 rounded-sm" />
                                        <span className="text-sm text-gray-300">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Colori (Separati da virgola)</label>
                            <input type="text" value={data.colors} onChange={e => setData('colors', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm focus:border-red-500 focus:ring-red-500" />
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-gray-800 p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-gray-800 pb-2">Immagini</h2>
                        
                        {data.existing_images.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-4 uppercase">Ordina Immagini (La prima sarà la copertina)</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {data.existing_images.map((src, idx) => (
                                        <div key={src} className="relative group border border-gray-800 rounded-sm overflow-hidden bg-black aspect-square flex items-center justify-center">
                                            
                                            <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            
                                            {/* Sfondo scuro in hover per far risaltare i bottoni */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                            {/* Badge Copertina */}
                                            {idx === 0 && (
                                                <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider z-10 shadow-lg">
                                                    Copertina
                                                </div>
                                            )}

                                            {/* Pulsante "X" in alto a destra */}
                                            <button 
                                                type="button" 
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all z-20"
                                                title="Rimuovi Immagine"
                                            >
                                                ✕
                                            </button>

                                            {/* Comandi Centrali (Visibili in hover) */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                
                                                {idx > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => makeCover(idx)} 
                                                        className="bg-white hover:bg-gray-200 text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 transition-colors pointer-events-auto mb-2"
                                                    >
                                                        Set Cover
                                                    </button>
                                                )}

                                                <div className="flex gap-1 pointer-events-auto">
                                                    {idx > 0 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => moveImageLeft(idx)} 
                                                            className="bg-gray-900/90 hover:bg-black text-white w-10 h-10 flex items-center justify-center text-sm transition-colors border border-gray-700 hover:border-white" 
                                                            title="Sposta a Sinistra"
                                                        >
                                                            ←
                                                        </button>
                                                    )}
                                                    
                                                    {idx < data.existing_images.length - 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => moveImageRight(idx)} 
                                                            className="bg-gray-900/90 hover:bg-black text-white w-10 h-10 flex items-center justify-center text-sm transition-colors border border-gray-700 hover:border-white" 
                                                            title="Sposta a Destra"
                                                        >
                                                            →
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-800 pt-6 mt-6">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Aggiungi Nuove Immagini</label>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:bg-gray-800 file:border-0 file:text-white hover:file:bg-gray-700 cursor-pointer transition-colors" />
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="aspect-square border border-gray-600 opacity-60 rounded-sm overflow-hidden bg-black">
                                            <img src={src} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="bg-white text-black px-8 py-4 font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors disabled:opacity-50">
                            {processing ? 'Salvataggio...' : 'Salva Modifiche'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}