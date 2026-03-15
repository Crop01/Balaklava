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
        existing_images: product.images || [], // AGGIUNTO: Gestione foto vecchie
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

    // AGGIUNTO: Funzione per rimuovere un'immagine vecchia dal form
    const removeExistingImage = (indexToRemove) => {
        setData('existing_images', data.existing_images.filter((_, idx) => idx !== indexToRemove));
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
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prezzo (€)</label>
                                <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prezzo Scontato</label>
                                <input type="number" step="0.01" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Collezione</label>
                                <input type="text" value={data.collection} onChange={e => setData('collection', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Descrizione</label>
                                <textarea rows="4" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm"></textarea>
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
                                        <input type="checkbox" checked={data.sizes.includes(size)} onChange={() => handleSizeChange(size)} className="bg-black border-gray-700 text-red-600 focus:ring-0 rounded-sm" />
                                        <span className="text-sm text-gray-300">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Colori (Separati da virgola)</label>
                            <input type="text" value={data.colors} onChange={e => setData('colors', e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-sm" />
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-gray-800 p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-gray-800 pb-2">Immagini</h2>
                        
                        {/* AGGIUNTO: Griglia con pulsante "X" per eliminare */}
                        {data.existing_images.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-2 uppercase">Immagini Attuali (Clicca la X per rimuovere)</p>
                                <div className="grid grid-cols-4 gap-4">
                                    {data.existing_images.map((src, idx) => (
                                        <div key={idx} className="relative group border border-gray-800 rounded-sm overflow-hidden bg-black">
                                            <img src={src} className="w-full h-auto opacity-70 group-hover:opacity-40 transition-opacity" />
                                            {/* Pulsante Rimuovi */}
                                            <button 
                                                type="button" 
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute inset-0 m-auto w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black uppercase text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                                title="Rimuovi questa foto"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-800 pt-4">
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Aggiungi Nuove Immagini</label>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:bg-gray-800 file:border-0 file:text-white hover:file:bg-gray-700" />
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {imagePreviews.map((src, idx) => (
                                        <img key={idx} src={src} className="w-full h-auto border border-green-500 rounded-sm" />
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