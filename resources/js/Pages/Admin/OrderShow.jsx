import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function OrderShow({ auth, order }) {
    const [isConfirming, setIsConfirming] = useState(false);
    const { data, setData, post, processing } = useForm({
        message: 'Il tuo ordine Balaklava è stato spedito! \nGrazie per il supporto.\nBalaklava Team',
    });

    const submitShipment = (e) => {
        e.preventDefault();
        post(route('admin.orders.ship', order.id));
    };

    return (
        <div className="bg-[#050505] min-h-screen text-gray-300 font-sans selection:bg-red-600 selection:text-white">
            <Head title={`Ordine #${order.id}`} />
            
            <nav className="border-b border-gray-800 bg-[#0a0a0a] px-8 py-5 flex justify-between items-center sticky top-0 z-50">
                <div className="font-black uppercase text-xl tracking-tighter text-white">
                    Balaklava <span className="text-gray-600">.Admin</span>
                </div>
                <Link href={route('admin.dashboard')} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                    ← Torna alla Dashboard
                </Link>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                
                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-6">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dettaglio Ordine</p>
                        <h1 className="text-3xl font-black text-white font-mono">#{order.id}</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Data Creazione</p>
                        <p className="text-sm font-bold text-white">
                            {new Date(order.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLONNA SINISTRA: DETTAGLI */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Tabella Prodotti */}
                        <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-sm">
                            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Articoli Acquistati</h2>
                            <ul className="divide-y divide-gray-800">
                                {order.items.map(item => (
                                    <li key={item.id} className="py-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-900 rounded-sm flex items-center justify-center text-gray-700 text-xs">IMG</div>
                                            <div>
                                                <p className="font-bold text-white uppercase text-sm">{item.product_name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                    Taglia: <span className="text-gray-300">{item.size}</span>
                                                    {item.color && <span className="mx-2">|</span>}
                                                    {item.color && <span>Colore: <span className="text-gray-300">{item.color}</span></span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold text-sm">x{item.quantity}</p>
                                            <p className="text-xs text-gray-500 font-mono">€{item.price}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Totale Ordine</span>
                                <span className="text-xl font-black text-white">€{order.total}</span>
                            </div>
                        </div>

                        {/* Dati Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm">
                                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Cliente</h2>
                                <div className="space-y-1">
                                    <p className="text-white font-bold uppercase text-sm">{order.customer_name}</p>
                                    <p className="text-gray-400 text-xs">{order.customer_email}</p>
                                    <p className="text-gray-400 text-xs">{order.customer_phone}</p>
                                </div>
                            </div>
                            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm">
                                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">Spedizione</h2>
                                <div className="space-y-1">
                                    <p className="text-gray-300 text-xs">{order.address}</p>
                                    <p className="text-gray-300 text-xs">{order.city} ({order.province})</p>
                                    <p className="text-gray-300 text-xs">{order.zip_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLONNA DESTRA: AZIONI */}
                    <div className="space-y-6">
                        
                        {/* Box Stato */}
                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm">
                            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Stato Attuale</h2>
                            <div className={`p-4 text-center font-black uppercase tracking-[0.2em] text-sm border ${order.status === 'shipped' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}>
                                {order.status === 'shipped' ? 'SPEDITO' : 'IN LAVORAZIONE'}
                            </div>
                        </div>

                        {/* Box Spedizione */}
                        {order.status !== 'shipped' ? (
                            <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm ring-1 ring-red-900/30">
                                <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Azione Richiesta</h2>
                                <form onSubmit={submitShipment}>
                                    <div className="mb-4">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2">
                                            Messaggio Email
                                        </label>
                                        <textarea 
                                            className="w-full bg-black border border-gray-700 text-white p-3 text-xs font-mono rounded-sm focus:border-red-600 focus:ring-0 h-40 resize-none"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                        ></textarea>
                                    </div>
                                    
                                    {!isConfirming ? (
                                        <button 
                                            type="button"
                                            onClick={() => setIsConfirming(true)}
                                            className="w-full bg-white hover:bg-gray-200 text-black font-black uppercase tracking-[0.2em] py-4 text-xs transition-colors"
                                        >
                                            Segna come Spedito
                                        </button>
                                    ) : (
                                        <div className="space-y-2 animate-pulse">
                                            <p className="text-center text-[10px] text-red-500 font-bold uppercase">Confermi l'invio della mail?</p>
                                            <div className="flex gap-2">
                                                <button 
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-2 text-xs transition-colors"
                                                >
                                                    {processing ? '...' : 'Sì, Invia'}
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setIsConfirming(false)}
                                                    className="flex-1 bg-transparent border border-gray-700 hover:border-white text-gray-400 hover:text-white font-bold uppercase py-2 text-xs transition-colors"
                                                >
                                                    Annulla
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed border-gray-800 text-center">
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest">Ordine già processato.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}