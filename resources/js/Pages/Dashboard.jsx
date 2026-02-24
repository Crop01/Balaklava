import Navbar from '@/Components/Navbar';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, orders }) {
    
    // Funzione per lo stile dello stato
    const getStatusStyle = (status) => {
        switch(status) {
            case 'pending': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
            case 'shipped': return 'text-green-500 border-green-500/30 bg-green-500/10';
            case 'cancelled': return 'text-red-500 border-red-500/30 bg-red-500/10';
            default: return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
        }
    };

    // Traduzione stati
    const getStatusLabel = (status) => {
        switch(status) {
            case 'pending': return 'In Lavorazione';
            case 'shipped': return 'Spedito';
            case 'cancelled': return 'Annullato';
            default: return status;
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-gray-300 font-sans selection:bg-red-600 selection:text-white">
            <Head title="Il mio Account" />
            
            <Navbar auth={auth} isFixed={false} />

            <div className="py-20 px-6 max-w-5xl mx-auto">
                
                {/* Header Profilo */}
                <div className="mb-16 border-b border-gray-800 pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Profilo Utente</p>
                        <h4 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white">
                            Ciao {auth.user.name.split(' ')[0]}
                        </h4>
                        <p className="text-sm text-gray-400 mt-2 font-mono">{auth.user.email}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <div className="px-4 py-2 border border-gray-800 bg-[#0a0a0a] rounded-sm text-xs font-bold uppercase tracking-widest text-green-500 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Account Attivo
                        </div>
                    </div>
                </div>

                {/* Sezione Ordini */}
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-8 flex items-center gap-4">
                        I tuoi Ordini
                        <span className="text-sm font-bold text-gray-600 bg-gray-900 px-3 py-1 rounded-full">{orders.length}</span>
                    </h2>

                    {orders.length > 0 ? (
                        <div className="grid gap-6">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm hover:border-gray-600 transition-all duration-300 group relative overflow-hidden">
                                    
                                    {/* Effetto Hover Sfondo */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/0 via-gray-900/0 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                                        
                                        {/* Info Ordine */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono text-xl text-white font-bold">#{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                Ordinato il {new Date(order.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* Anteprima Prodotti */}
                                        <div className="flex-1 md:px-8">
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <span key={idx} className="text-xs text-gray-300 bg-gray-900 border border-gray-800 px-2 py-1 rounded-sm uppercase">
                                                        {item.product_name} <span className="text-gray-600">x{item.quantity}</span>
                                                    </span>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <span className="text-xs text-gray-500 py-1">+ altri {order.items.length - 3}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Totale */}
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Totale</p>
                                            <p className="text-xl font-bold text-white">€{parseFloat(order.total).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-24 text-center border border-dashed border-gray-800 rounded-sm bg-[#0a0a0a]">
                            <div className="text-4xl mb-4 opacity-30">📦</div>
                            <h3 className="text-white font-bold uppercase tracking-wide mb-2">Nessun ordine trovato</h3>
                            <p className="text-gray-500 text-sm mb-8">Non hai ancora acquistato nulla.</p>
                            <Link 
                                href="/" 
                                className="inline-block bg-white text-black px-8 py-3 font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-colors text-xs"
                            >
                                Inizia lo Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}