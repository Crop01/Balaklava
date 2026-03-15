import { Link, Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/Components/Navbar';

// --- COMPONENTE EFFETTO SCROLL ---
const RevealOnScroll = ({ children, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${className}`}
        >
            {children}
        </div>
    );
};

// --- PRODUCT CARD ---
const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const images = product.images || [];
    const hasMultipleImages = images.length > 1;

    useEffect(() => {
        if (!hasMultipleImages || !isHovered) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 1200);
        return () => clearInterval(interval);
    }, [hasMultipleImages, images.length, isHovered]);

    return (
        <Link 
            href={route('product.show', product.slug)} 
            className="group relative cursor-pointer block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
        >
            <div className="aspect-[4/5] w-full overflow-hidden bg-brand-gray rounded-sm relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                
                {images.length > 0 ? (
                    <img 
                        src={images[currentImageIndex]} 
                        alt={`${product.name}`} 
                        className="h-full w-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-110" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/333/999?text=Img+Not+Found'; }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500 border border-gray-800">
                        <span className="text-[10px] uppercase tracking-widest">Nessuna Immagine</span>
                    </div>
                )}

                {product.sale_price && (
                    <span className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm text-white text-[10px] px-3 py-1 uppercase tracking-widest font-black z-20">
                        Sale
                    </span>
                )}
            </div>

            <div className="mt-5 flex justify-between items-start opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-red-500 transition-colors">
                        {product.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-gray-500 uppercase tracking-widest">
                        {product.colors ? `${product.colors.length} Variant${product.colors.length > 1 ? 's' : ''}` : 'Single Color'}
                    </p>
                </div>
                <div className="text-right font-mono text-sm">
                    {product.sale_price ? (
                        <>
                            <p className="font-bold text-red-500">€{product.sale_price}</p>
                            <p className="text-[10px] text-gray-600 line-through">€{product.price}</p>
                        </>
                    ) : (
                        <p className="font-bold text-white">€{product.price}</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default function Welcome({ auth, collections, galleryImages = [] }) {
    const collectionsArray = Object.entries(collections || {});
    const { social } = usePage().props;

    return (
        <div className="bg-brand-black min-h-screen text-brand-text selection:bg-red-600 selection:text-white font-sans">
            <Head title="Home" />
            <Navbar auth={auth} />

            {/* HERO SECTION */}
            <section className="relative h-screen w-full overflow-hidden bg-brand-black flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <video 
                        className="w-full h-full object-cover opacity-50 scale-105 animate-[pulse-slow_10s_infinite]" 
                        autoPlay loop muted playsInline
                    >
                        <source src="/videos/bala2.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-black/30"></div>
                </div>

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-6xl md:text-[10rem] leading-none font-black uppercase tracking-tighter text-white mix-blend-overlay opacity-0 animate-enter">
                        Balaklava
                    </h1>
                    <p className="mt-4 text-sm md:text-base font-bold uppercase tracking-[0.5em] text-gray-300 opacity-0 animate-enter delay-200">
                        Urban Culture & Motorsport
                    </p>
                </div>
            </section>

            {/* MARQUEE */}
            <div className="bg-red-600 text-black py-4 overflow-hidden border-y border-brand-gray relative z-20">
                <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs md:text-sm font-black uppercase tracking-[0.2em]">
                    <span>Spedizione Gratuita sopra i 100€</span> • <span>New Collection Drop</span> • <span>Balaklava Worldwide</span> • <span>Shop Now</span> • 
                    <span>Spedizione Gratuita sopra i 100€</span> • <span>New Collection Drop</span> • <span>Balaklava Worldwide</span> • <span>Shop Now</span> •
                </div>
            </div>

            {/* SEZIONI DINAMICHE */}
            {collectionsArray.map(([categoryName, products], index) => (
                <section 
                    key={categoryName}
                    id={categoryName.toLowerCase()} 
                    // MODIFICA SPAZI: Ridotto py-32 a py-20 per meno spazio vuoto
                    className={`py-20 px-6 ${index % 2 !== 0 ? 'bg-[#0a0a0a]' : 'bg-brand-black'}`}
                >
                    <RevealOnScroll className="max-w-7xl mx-auto">
                        
                        {/* Header Sezione Pulito */}
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-red-600">
                                {categoryName}
                            </h2>
                        </div>

                        {/* Griglia Prodotti */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </RevealOnScroll>
                </section>
            ))}

            {/* FASCIA FOTO SCORREVOLI (MARQUEE GALLERY) */}
            <section className="py-12 border-t border-brand-gray bg-[#0a0a0a] overflow-hidden">
                <div className="mb-8 px-6 text-center">
                    <h2 className="text-xl font-black uppercase tracking-[0.2em] text-gray-500">
                        Balaklava Lifestyle
                    </h2>
                </div>
                
                {/* Contenitore scorrevole */}
                <div className="relative flex overflow-x-hidden w-full">
                    {/* RIMOSSO: group-hover:[animation-play-state:paused] */}
                    <div className="animate-marquee whitespace-nowrap flex gap-1 items-center">
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((src, index) => (
                            <img 
                                key={index} 
                                src={src} 
                                alt="Balaklava Gallery" 
                                // RIMOSSO: grayscale, hover:grayscale-0 e cursor-pointer
                                className="h-64 sm:h-80 w-auto object-cover rounded-sm border border-gray-800 transition-all duration-500"
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* NUOVA SEZIONE MANIFESTO */}
            <section className="py-24 px-6 bg-brand-black border-t border-brand-gray relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                
                <RevealOnScroll className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-8">
                    <img 
                        src="/img/logo-registrato.png" 
                        alt="Balaklava Logo" 
                        className="w-24 md:w-32 h-auto object-contain brightness-0 invert opacity-80"
                        onError={(e) => e.target.src = '/img/site/logo-registrato.png'}
                    />
                    
                    <p className="text-lg md:text-xl font-bold uppercase leading-relaxed tracking-widest text-gray-400">
                        Balaklava è più di un brand di streetwear. <br className="hidden md:block" />
                        È un movimento, uno stile di vita, un'attitudine. <br className="hidden md:block" />
                        <span className="text-white">Nato dalla passione per la cultura urbana e il motorsport</span>, <br className="hidden md:block" />
                        il nostro brand rappresenta chi non ha paura di <br className="hidden md:block" />
                        distinguersi e vivere al limite.
                    </p>
                </RevealOnScroll>
            </section>

            {/* MODIFICA: FOOTER A GRIGLIA PIENO */}
            <footer className="bg-[#050505] border-t border-brand-gray text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-brand-gray">
                    
                    {/* COLONNA 1: INFO */}
                    <div className="p-12 flex flex-col justify-between items-start h-full">
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tighter mb-4">Balaklava.</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                                Engineered for the streets.<br/>
                                Designed in Italy.<br/>
                                Worldwide Shipping.
                            </p>
                        </div>
                        {social && social.instagram && (
                            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                Segui su Instagram
                            </a>
                        )}
                    </div>

                    {/* COLONNA 2: NAVIGAZIONE */}
                    <div className="p-12">
                        <h4 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">Supporto</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-wide">
                            <li><Link href="/dashboard" className="hover:text-red-500 transition-colors">Il mio Account</Link></li>
                            <li><Link href={route('size-guide')} className="hover:text-red-500 transition-colors">Guida alle Taglie</Link></li>
                            <li><Link href="/cart" className="hover:text-red-500 transition-colors">Carrello</Link></li>
                        </ul>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="border-t border-brand-gray py-6 text-center">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Balaklava. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}