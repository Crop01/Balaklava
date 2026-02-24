import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useCart } from '@/Context/CartContext';
import { useEffect } from 'react';

export default function CheckoutIndex({ auth }) {
    const { cartItems, getCartTotal, getCartCount } = useCart();
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 5;
    const total = subtotal + shipping;

    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth.user ? auth.user.name : '',
        customer_email: auth.user ? auth.user.email : '',
        customer_phone: '',
        address: '',
        city: '',
        zip_code: '',
        province: '',
        cart_items: cartItems,
    });

    useEffect(() => {
        setData('cart_items', cartItems);
    }, [cartItems]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-brand-black min-h-screen text-white flex items-center justify-center">
                <p>Il carrello è vuoto. <a href="/" className="underline">Torna allo shop</a></p>
            </div>
        );
    }

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title="Checkout" />
            <Navbar auth={auth} isFixed={false} />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-12 border-b border-brand-gray pb-4">
                    Checkout
                </h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    
                    {/* COLONNA SINISTRA: FORM */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-4">Dati Spedizione</h2>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        value={data.customer_name}
                                        onChange={e => setData('customer_name', e.target.value)}
                                        className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                        required
                                    />
                                    {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={data.customer_email}
                                        onChange={e => setData('customer_email', e.target.value)}
                                        className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                        required
                                    />
                                    {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Telefono</label>
                                    <input 
                                        type="tel" 
                                        value={data.customer_phone}
                                        onChange={e => setData('customer_phone', e.target.value)}
                                        className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Indirizzo e N. Civico</label>
                                    <input 
                                        type="text" 
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Città</label>
                                    <input 
                                        type="text" 
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">CAP</label>
                                        <input 
                                            type="text" 
                                            value={data.zip_code}
                                            onChange={e => setData('zip_code', e.target.value)}
                                            className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Prov</label>
                                        <input 
                                            type="text" 
                                            maxLength="2"
                                            value={data.province}
                                            onChange={e => setData('province', e.target.value.toUpperCase())}
                                            className="w-full bg-brand-dark border border-brand-gray text-white px-4 py-3 rounded-sm focus:border-white focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* --- MODIFICA 2: SEZIONE PAGAMENTO SOLO TESTO --- */}
                            <div className="mt-8 pt-8 border-t border-brand-gray">
                                <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-4">Pagamento</h2>
                                <div className="bg-brand-dark/50 border border-brand-gray p-6 rounded-sm">
                                    <div className="flex items-start gap-4">
                                        <span className="text-2xl">✉️</span>
                                        <div>
                                            <p className="font-bold text-white uppercase text-sm mb-1">Attendi istruzioni via Email</p>
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                Al termine dell'ordine riceverai una mail di conferma.<br/>
                                                Verrai ricontattato a breve dal nostro team con il link per il pagamento e i dettagli per la spedizione.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full mt-8 bg-red-600 text-white py-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Elaborazione...' : 'Conferma e Attendi Mail'}
                            </button>

                        </form>
                    </div>

                    {/* COLONNA DESTRA: RIEPILOGO */}
                    <div className="lg:col-span-5 mt-12 lg:mt-0">
                        <div className="bg-brand-dark border border-brand-gray p-6 rounded-sm sticky top-24">
                            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-6">Riepilogo ({getCartCount()})</h2>
                            
                            <ul className="divide-y divide-brand-gray mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <li key={`${item.id}-${item.selectedSize}`} className="py-4 flex gap-4">
                                        <img 
                                            src={item.images && item.images[0] ? item.images[0] : ''} 
                                            className="h-16 w-12 object-cover rounded-sm bg-gray-800"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-white uppercase">{item.name}</h3>
                                            <p className="text-xs text-gray-400">Taglia: {item.selectedSize} x {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-white">€{item.sale_price || item.price}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-brand-gray pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotale</span>
                                    <span>€{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Spedizione</span>
                                    <span>{shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-brand-gray mt-2">
                                    <span>Totale</span>
                                    <span className="text-red-500">€{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}