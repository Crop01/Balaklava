import { Head, Link } from '@inertiajs/react';

export default function AdminDashboard({ auth, orders }) {
    
    // Calcolo Statistiche al volo
    const totalRevenue = orders.reduce((acc, order) => acc + parseFloat(order.total), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;

    // Helper Stato
    const getStatusStyle = (status) => {
        switch(status) {
            case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-gray-300 font-sans selection:bg-red-600 selection:text-white">
            <Head title="Admin Dashboard" />
            
            {/* Topbar */}
            <nav className="border-b border-gray-800 bg-[#0a0a0a] px-8 py-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
                <div className="font-black uppercase text-xl tracking-tighter text-white">
                    Balaklava <span className="text-red-600">.Admin</span>
                </div>
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest items-center">
                    <Link href="/" className="hover:text-white transition-colors opacity-60 hover:opacity-100">
                        Vai allo Shop
                    </Link>
                    <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white">{auth.user.name}</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-8 py-12">
                
                {/* Header & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    <div className="lg:col-span-1">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">Overview</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                            Gestione ordini e<br/>monitoraggio vendite.
                        </p>
                        <Link 
                            href={route('admin.products.index')}
                            className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors border-b border-gray-800 pb-1 hover:border-red-500"
                        >
                            Gestisci Catalogo →
                        </Link>
                    </div>

                    {/* Stat Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm hover:border-gray-600 transition-colors">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Totale Vendite</p>
                            <p className="text-2xl font-bold text-white">€{totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm hover:border-gray-600 transition-colors">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">In Attesa</p>
                            <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm hover:border-gray-600 transition-colors">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Spediti</p>
                            <p className="text-2xl font-bold text-blue-500">{shippedOrders}</p>
                        </div>
                    </div>
                </div>

                {/* Tabella Ordini */}
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Ultimi Ordini</h2>
                        <span className="text-[10px] text-gray-600 uppercase bg-gray-900 px-2 py-1 rounded">Total: {orders.length}</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-[10px] uppercase text-gray-500 bg-black/50 border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-widest">ID</th>
                                    <th className="px-6 py-4 font-bold tracking-widest">Cliente</th>
                                    <th className="px-6 py-4 font-bold tracking-widest">Data</th>
                                    <th className="px-6 py-4 font-bold tracking-widest">Totale</th>
                                    <th className="px-6 py-4 font-bold tracking-widest">Stato</th>
                                    <th className="px-6 py-4 font-bold tracking-widest text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-900/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white mb-0.5">{order.customer_name}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{order.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString('it-IT')}
                                            <span className="text-gray-600 ml-2">{new Date(order.created_at).toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white font-mono">
                                            €{parseFloat(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={route('admin.orders.show', order.id)}
                                                className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors border border-transparent hover:border-gray-700 px-3 py-1 rounded-sm"
                                            >
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-30">
                                                <svg className="w-12 h-12 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                                                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Nessun ordine trovato</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}