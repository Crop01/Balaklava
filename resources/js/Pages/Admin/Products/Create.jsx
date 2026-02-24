import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateProduct() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        sale_price: '',
        description: '',
        collection: '', // Ora è una stringa libera
        sizes: [],
        colors: '',
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    
    // Lista suggerimenti (puoi espanderla)
    const predefinedCollections = ['classic', 'star', 'summer', 'accessories'];
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title="Nuovo Prodotto" />
            
            <nav className="border-b border-brand-gray bg-brand-dark px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-black uppercase text-xl text-white tracking-tighter">
                    Admin <span className="text-gray-500">/ Nuovo Prodotto</span>
                </div>
                <Link href={route('admin.products.index')} className="text-xs font-bold uppercase tracking-widest hover:text-white text-gray-400">
                    Annulla
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="bg-brand-dark border border-brand-gray p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-brand-gray pb-2">Info Generali</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nome Prodotto</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-black border border-brand-gray text-white px-4 py-2 rounded-sm" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prezzo (€)</label>
                                <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full bg-black border border-brand-gray text-white px-4 py-2 rounded-sm" />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prezzo Scontato</label>
                                <input type="number" step="0.01" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} className="w-full bg-black border border-brand-gray text-white px-4 py-2 rounded-sm" />
                            </div>

                            {/* --- SEZIONE COLLEZIONE DINAMICA --- */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Collezione / Categoria</label>
                                <input 
                                    list="collections-list" 
                                    type="text"
                                    value={data.collection} 
                                    onChange={e => setData('collection', e.target.value)} 
                                    placeholder="Scrivi o seleziona..."
                                    className="w-full bg-black border border-brand-gray text-white px-4 py-2 rounded-sm"
                                />
                                <datalist id="collections-list">
                                    {predefinedCollections.map(c => <option key={c} value={c} />)}
                                </datalist>
                                <p className="text-[10px] text-gray-500 mt-1">Es: classic, star, summer. Creane una nuova scrivendo qui.</p>
                                {errors.collection && <p className="text-red-500 text-xs mt-1">{errors.collection}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Descrizione</label>
                                <textarea rows="4" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full bg-black border border-brand-gray text-white px-4 py-2 rounded-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-dark border border-brand-gray p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-brand-gray pb-2">Varianti</h2>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Taglie</label>
                            <div className="flex flex-wrap gap-4">
                                {availableSizes.map(size => (
                                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={data.sizes.includes(size)} onChange={() => handleSizeChange(size)} className="bg-black border-brand-gray text-red-600 focus:ring-0 rounded-sm" />
                                        <span className="text-sm text-gray-300">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Colori (Separati da virgola)</label>
                            <input type="text" value={data.colors} onChange={e => setData('colors', e.target.value)} className="w-full bg-black border border-brand-gray text-white px-4 py-2 rounded-sm" />
                        </div>
                    </div>

                    <div className="bg-brand-dark border border-brand-gray p-6 rounded-sm space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide border-b border-brand-gray pb-2">Immagini</h2>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:bg-white file:text-black hover:file:bg-gray-200" />
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {imagePreviews.map((src, idx) => (
                                    <div key={idx} className="aspect-square bg-black border border-brand-gray overflow-hidden rounded-sm relative">
                                        <img src={src} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="bg-red-600 text-white px-8 py-4 font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-colors disabled:opacity-50">
                            {processing ? 'Salvataggio...' : 'Crea Prodotto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}