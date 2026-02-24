import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/Components/Navbar';
import { useCart } from '@/Context/CartContext';

export default function Show({ product, auth }) {
    const { addToCart } = useCart();
    
    const images = product.images || [];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : null);
    const [error, setError] = useState(null);
    
    // Stato caricamento per animazione (condiviso tra main e lightbox)
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // --- FUNZIONI DI NAVIGAZIONE (Con effetto Fade) ---
    const changeIndex = (newIndex) => {
        if (newIndex === currentIndex) return;
        
        // 1. Inizia transizione (Fade Out)
        setIsTransitioning(true);
        
        // 2. Aspetta che l'immagine sparisca, poi cambia indice
        setTimeout(() => {
            setCurrentIndex(newIndex);
            
            // 3. Aspetta un attimo che il DOM si aggiorni, poi Fade In
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50); 
        }, 300); // Durata del fade-out (coincide con duration-300 del CSS)
    };

    const nextImage = (e) => {
        e?.stopPropagation();
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        changeIndex(newIndex);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        changeIndex(newIndex);
    };

    // --- GESTIONE TASTIERA ---
    const handleKeyDown = useCallback((e) => {
        if (!isLightboxOpen) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') setIsLightboxOpen(false);
    }, [isLightboxOpen, currentIndex]); // Aggiunto currentIndex alle dipendenze

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // --- LOGICA CARRELLO ---
    const handleAddToCart = () => {
        setError(null);
        if (!auth.user) {
            if(confirm("Devi essere registrato per acquistare. Vuoi accedere o registrarti ora?")) {
                router.get(route('login'));
            }
            return;
        }
        if (!selectedSize && product.sizes) {
            setError('Devi selezionare una taglia per procedere.');
            return;
        }
        addToCart(product, selectedSize, selectedColor);
        router.visit('/cart');
    };

    return (
        <div className="bg-brand-black min-h-screen text-brand-text font-sans selection:bg-red-600 selection:text-white">
            <Head title={product.name} />
            <Navbar auth={auth} />

            {/* --- LIGHTBOX (FULLSCREEN PREMIUM) --- */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out_forwards]">
                    
                    {/* Sfondo Sfumato (Blur Pesante) */}
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
                        onClick={() => setIsLightboxOpen(false)} // Clicca fuori per chiudere
                    ></div>

                    {/* Top Bar (Close) */}
                    <div className="absolute top-0 right-0 p-6 z-50">
                        <button 
                            onClick={() => setIsLightboxOpen(false)}
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors">Chiudi</span>
                            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Area Immagine Centrale */}
                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 z-40">
                        
                        {/* Freccia Sinistra (Solo se > 1 img) */}
                        {images.length > 1 && (
                            <button 
                                onClick={prevImage} 
                                className="absolute left-4 md:left-8 p-4 text-white/50 hover:text-white hover:scale-110 transition-all duration-300"
                            >
                                <svg className="w-12 h-12 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        )}

                        {/* Immagine con Transizione Smooth */}
                        <img 
                            src={images[currentIndex]} 
                            className={`
                                max-h-[85vh] max-w-[90vw] object-contain shadow-2xl select-none 
                                transition-all duration-500 ease-in-out
                                ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
                            `}
                            alt="Fullscreen view"
                        />

                        {/* Freccia Destra (Solo se > 1 img) */}
                        {images.length > 1 && (
                            <button 
                                onClick={nextImage} 
                                className="absolute right-4 md:right-8 p-4 text-white/50 hover:text-white hover:scale-110 transition-all duration-300"
                            >
                                <svg className="w-12 h-12 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>

                    {/* Thumbnails Strip (Sfumatura dal basso) */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-center pb-6 z-50">
                        {/* Container Scrollabile */}
                        <div className="flex gap-4 overflow-x-auto overflow-y-hidden px-6 max-w-full no-scrollbar w-full justify-center md:w-auto md:justify-start">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); changeIndex(idx); }}
                                    className={`
                                        relative w-14 h-14 md:w-20 md:h-20 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ease-out
                                        ${currentIndex === idx 
                                            ? 'border-red-600 scale-110 opacity-100 shadow-[0_0_10px_rgba(220,38,38,0.6)]' 
                                            : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-500 scale-100'}
                                    `}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                    
                    {/* COLONNA SINISTRA: IMMAGINI */}
                    <div className="lg:col-span-7 flex flex-col-reverse gap-6">
                        
                        {/* Thumbnail Grid (Main Page) */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => changeIndex(idx)}
                                        className={`relative aspect-square bg-brand-dark rounded-sm overflow-hidden cursor-pointer transition-all duration-300 ${currentIndex === idx ? 'ring-1 ring-white opacity-100 scale-95' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover object-center" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image Viewport */}
                        <div 
                            className="w-full aspect-[4/5] bg-brand-dark rounded-sm overflow-hidden relative group cursor-zoom-in"
                            onClick={() => setIsLightboxOpen(true)}
                        >
                             <img 
                                src={images[currentIndex]} 
                                alt={product.name} 
                                className={`w-full h-full object-cover object-center transition-all duration-500 ease-out 
                                    ${isTransitioning ? 'opacity-80 blur-sm scale-105' : 'opacity-100 blur-0 scale-100'}
                                    group-hover:scale-105
                                `} 
                            />
                            
                            {/* Overlay Sfumato per le frecce (appare solo in hover) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            {/* Frecce di navigazione (Visibili solo se > 1 immagine) */}
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage}
                                        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 drop-shadow-md"
                                    >
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-125 drop-shadow-md"
                                    >
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </>
                            )}

                             {product.sale_price && (
                                <span className="absolute top-4 left-4 bg-red-600/90 backdrop-blur text-white text-xs px-4 py-1.5 uppercase tracking-widest font-bold">
                                    In Saldo
                                </span>
                            )}
                        </div>
                    </div>

                    {/* COLONNA DESTRA: INFO */}
                    <div className="lg:col-span-5 mt-12 lg:mt-0 sticky top-32">
                        
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2 opacity-0 animate-enter">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-8 opacity-0 animate-enter delay-100">
                            {product.sale_price ? (
                                <>
                                    <p className="text-2xl font-bold text-red-500">€{product.sale_price}</p>
                                    <p className="text-lg text-gray-500 line-through">€{product.price}</p>
                                </>
                            ) : (
                                <p className="text-2xl font-bold text-white">€{product.price}</p>
                            )}
                        </div>

                        <div className="prose prose-invert prose-sm mb-10 text-gray-400 opacity-0 animate-enter delay-200 leading-relaxed border-l-2 border-gray-800 pl-4">
                            <p>{product.description}</p>
                        </div>

                        <div className="opacity-0 animate-enter delay-300">
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Seleziona Colore</h3>
                                    <div className="flex gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-6 py-3 text-xs font-bold uppercase border transition-all duration-300 ${selectedColor === color ? 'bg-white text-black border-white scale-105' : 'border-brand-gray text-gray-400 hover:border-white hover:text-white'}`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && (
                                <div className="mb-10">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Seleziona Taglia</h3>
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => { setSelectedSize(size); setError(null); }}
                                                className={`
                                                    py-3 text-sm font-bold uppercase tracking-widest border transition-all duration-200
                                                    ${selectedSize === size 
                                                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transform -translate-y-1' 
                                                        : 'bg-transparent text-gray-400 border-brand-gray hover:border-white hover:text-white'}
                                                `}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-900/20 border-l-4 border-red-500 text-red-400 text-xs font-bold uppercase tracking-wide animate-pulse">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-red-600 text-white py-5 text-sm font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all active:scale-95 duration-200 shadow-lg hover:shadow-red-900/50"
                            >
                                {auth.user ? 'Aggiungi al Carrello' : 'Accedi per Acquistare'}
                            </button>

                            <div className="mt-8 pt-6 border-t border-brand-gray flex flex-col gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Spedizione Immediata
                                </div>
                                <p>Resi facili entro 14 giorni</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}