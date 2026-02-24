import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useCart } from '@/Context/CartContext';

export default function Success({ order, auth }) {
    const { clearCart } = useCart();

    // Appena la pagina viene caricata, svuotiamo il carrello
    useEffect(() => {
        clearCart();
    }, []);

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title="Ordine Confermato" />
            <Navbar auth={auth} isFixed={false} />

            <div className="max-w-3xl mx-auto px-6 py-24 text-center">
                
                {/* Icona Successo */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-900/30 border-2 border-green-500 mb-8">
                    <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
                    Grazie per l'ordine!
                </h1>
                
                <p className="text-gray-400 text-lg mb-8">
                    Il tuo ordine <span className="text-white font-bold">#{order.id}</span> è stato ricevuto correttamente.
                </p>

                <div className="bg-brand-dark border border-brand-gray p-8 rounded-sm text-left mb-12">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6 border-b border-brand-gray pb-2">
                        Dettagli Spedizione
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-gray-500 uppercase text-xs tracking-widest mb-1">Cliente</p>
                            <p className="text-white font-bold">{order.customer_name}</p>
                            <p className="text-gray-400">{order.customer_email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs tracking-widest mb-1">Indirizzo</p>
                            <p className="text-white">{order.address}</p>
                            <p className="text-white">{order.city}, {order.province} {order.zip_code}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs tracking-widest mb-1">Pagamento</p>
                            <p className="text-white">Contrassegno (Cash on Delivery)</p>
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase text-xs tracking-widest mb-1">Totale da Pagare</p>
                            <p className="text-red-500 font-bold text-lg">€{parseFloat(order.total).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <Link 
                    href="/" 
                    className="inline-block bg-white text-black px-12 py-4 font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors text-sm"
                >
                    Continua lo Shopping
                </Link>
            </div>
        </div>
    );
}