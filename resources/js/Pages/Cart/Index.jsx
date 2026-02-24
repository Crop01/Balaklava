import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useCart } from '@/Context/CartContext';

export default function CartIndex({ auth }) {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const total = getCartTotal();

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title="Il tuo Carrello" />
            
            <Navbar auth={auth} isFixed={false} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-12 border-b border-brand-gray pb-4">
                    Il tuo Carrello
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 uppercase tracking-widest mb-6">Il carrello è vuoto</p>
                        <Link href="/" className="inline-block bg-white text-black px-8 py-3 font-black uppercase tracking-widest hover:bg-gray-200 transition-colors text-xs">
                            Torna allo Shop
                        </Link>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Lista Prodotti */}
                        <div className="lg:col-span-8">
                            <ul className="divide-y divide-brand-gray">
                                {cartItems.map((item) => (
                                    <li key={`${item.id}-${item.selectedSize}`} className="py-6 flex">
                                        {/* Immagine */}
                                        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm border border-brand-gray bg-brand-dark">
                                            <img 
                                                src={item.images && item.images[0] ? item.images[0] : ''} 
                                                alt={item.name} 
                                                className="h-full w-full object-cover object-center" 
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-bold text-white uppercase tracking-wide">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">€{item.sale_price || item.price}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-400">Taglia: {item.selectedSize}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center gap-3 border border-brand-gray rounded-sm px-2">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                                        className="px-2 py-1 hover:text-white text-gray-400"
                                                    >-</button>
                                                    <span className="text-white font-bold">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                                        className="px-2 py-1 hover:text-white text-gray-400"
                                                    >+</button>
                                                </div>

                                                <button 
                                                    type="button" 
                                                    onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                                    className="font-medium text-red-500 hover:text-red-400 uppercase text-xs tracking-widest"
                                                >
                                                    Rimuovi
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Riepilogo Ordine */}
                        <div className="mt-16 rounded-sm bg-brand-dark border border-brand-gray p-6 lg:col-span-4 lg:mt-0 lg:p-8">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-4">Riepilogo Ordine</h2>
                            
                            <div className="flow-root">
                                <dl className="-my-4 divide-y divide-brand-gray text-sm">
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-400">Subtotale</dt>
                                        <dd className="font-bold text-white">€{total.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="text-gray-400">Spedizione</dt>
                                        <dd className="font-bold text-white">
                                            {total > 100 ? 'Gratis' : '€5.00'}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-t border-brand-gray">
                                        <dt className="text-base font-bold text-white uppercase">Totale</dt>
                                        <dd className="text-base font-bold text-red-500">
                                            €{(total + (total > 100 ? 0 : 5)).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href={route('checkout.create')} // <--- MODIFICA QUI
                                    className="w-full flex items-center justify-center rounded-sm border border-transparent bg-red-600 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-red-700 uppercase tracking-widest"
                                >
                                    Procedi al Checkout
                                </Link>
                                <p className="mt-4 text-center text-xs text-gray-500">
                                    Tasse incluse.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}