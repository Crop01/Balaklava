import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function GalleryIndex({ images }) {
    const { data, setData, post, processing, reset } = useForm({
        images: []
    });

    const [previewUrls, setPreviewUrls] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        setPreviewUrls(files.map(file => URL.createObjectURL(file)));
    };

    const handleUpload = (e) => {
        e.preventDefault();
        post(route('admin.gallery.store'), {
            onSuccess: () => {
                reset('images');
                setPreviewUrls([]);
                document.getElementById('gallery-upload').value = '';
            }
        });
    };

    const handleDelete = (filename) => {
        if (confirm('Vuoi davvero eliminare questa foto dalla galleria scorrevole?')) {
            router.post(route('admin.gallery.destroy'), { filename: filename });
        }
    };

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title="Gestione Galleria" />
            
            <nav className="border-b border-gray-800 bg-[#121212] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-black uppercase text-xl text-white tracking-tighter">
                    Admin <span className="text-gray-500">/ Galleria Lifestyle</span>
                </div>
                <Link href={route('admin.dashboard')} className="text-xs font-bold uppercase tracking-widest hover:text-white text-gray-400">
                    Torna alla Dashboard
                </Link>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* SEZIONE UPLOAD */}
                <div className="bg-[#121212] border border-gray-800 p-8 rounded-sm mb-12">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6">Aggiungi Nuove Foto</h2>
                    <form onSubmit={handleUpload} className="space-y-6">
                        <input 
                            id="gallery-upload"
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:bg-gray-800 file:border-0 file:text-white hover:file:bg-gray-700 cursor-pointer" 
                        />
                        
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                                {previewUrls.map((src, idx) => (
                                    <div key={idx} className="aspect-square border border-green-500 rounded-sm overflow-hidden bg-black">
                                        <img src={src} className="w-full h-full object-cover opacity-80" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-right">
                            <button 
                                type="submit" 
                                disabled={processing || data.images.length === 0} 
                                className="bg-white text-black px-8 py-4 font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Caricamento...' : 'Salva nella Galleria'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* SEZIONE FOTO ESISTENTI */}
                <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6">Foto Attuali ({images.length})</h2>
                {images.length === 0 ? (
                    <p className="text-gray-500 uppercase text-sm tracking-widest">Nessuna immagine presente nella galleria.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {images.map((image, idx) => (
                            <div key={idx} className="relative group border border-gray-800 rounded-sm overflow-hidden bg-black aspect-[3/4] flex items-center justify-center">
                                <img src={image.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-30 transition-opacity duration-300" />
                                
                                <button 
                                    type="button" 
                                    onClick={() => handleDelete(image.name)}
                                    className="absolute inset-0 m-auto w-32 h-12 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center font-black uppercase text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                                >
                                    Elimina Foto
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}