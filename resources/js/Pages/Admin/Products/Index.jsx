import { Head, Link, router } from '@inertiajs/react';

export default function ProductIndex({ auth, products }) {

    const handleDelete = (id, name) => {
        if (confirm(`Sei sicuro di voler eliminare "${name}"? Questa azione è irreversibile.`)) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title="Gestione Prodotti" />
            
            <nav className="border-b border-brand-gray bg-brand-dark px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="font-black uppercase text-xl text-white tracking-tighter">
                    Admin <span className="text-gray-500">/ Prodotti</span>
                </div>
                <div className="flex gap-6 text-xs font-bold uppercase tracking-widest items-center">
                    <Link href={route('admin.dashboard')} className="hover:text-white text-gray-400 transition-colors">
                        Torna alla Dashboard
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Prodotti ({products.length})</h1>
                    <Link 
                        href={route('admin.products.create')} 
                        className="bg-red-600 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-colors shadow-lg"
                    >
                        + Aggiungi Prodotto
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-brand-dark border border-brand-gray rounded-sm overflow-hidden group">
                            {/* Anteprima Immagine */}
                            <div className="h-48 overflow-hidden relative bg-black/50">
                                <img 
                                    src={product.images && product.images[0] ? product.images[0] : ''} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/333/999?text=No+Image'; }}
                                />
                                {product.sale_price && (
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 uppercase tracking-wider font-bold">
                                        Sale
                                    </span>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white uppercase text-sm truncate pr-2">{product.name}</h3>
                                    <span className="text-[10px] text-gray-500 uppercase border border-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                        {product.collection}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <div className="text-gray-400">
                                        {product.sale_price ? (
                                            <>
                                                <span className="text-red-500 font-bold">€{product.sale_price}</span>
                                                <span className="line-through ml-2 text-xs">€{product.price}</span>
                                            </>
                                        ) : (
                                            <span>€{product.price}</span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-gray-600 font-mono">
                                        ID: {product.id}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-brand-gray">
                                    <Link 
                                        href={route('admin.products.edit', product.id)}
                                        className="flex-1 text-center border border-white text-white hover:bg-white hover:text-black py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Modifica
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="flex-1 text-center border border-brand-gray text-gray-400 hover:border-red-600 hover:text-red-600 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Elimina
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}