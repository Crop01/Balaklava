import { Link, usePage, router } from '@inertiajs/react';
import { useCart } from '../Context/CartContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar({ auth, isFixed = true }) {
    const { getCartCount } = useCart();
    
    // Stati esistenti
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // NUOVO: Stato per il dropdown utente (Desktop)
    const [isUserOpen, setIsUserOpen] = useState(false);
    const userMenuRef = useRef(null);

    const { globalCollections } = usePage().props;

    // Chiudi il menu utente se clicchi fuori
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Smart Scroll Logic
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;
                if (isMenuOpen) { setIsVisible(true); return; }
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setIsVisible(false);
                    setIsUserOpen(false); // Chiude dropdown se scrolli
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(currentScrollY);
            }
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY, isMenuOpen]);

    const handleHomeClick = (e) => {
        e.preventDefault(); 
        setIsTransitioning(true);
        setTimeout(() => {
            router.visit('/', {
                onFinish: () => { setIsTransitioning(false); }
            });
        }, 800);
    };

    return (
        <>
            {/* SIPARIO NERO */}
            <div className={`page-transition-curtain ${isTransitioning ? 'active' : ''}`}>
                <img 
                    src="/img/logo-registrato.png" 
                    className="w-64 md:w-96 h-auto brightness-0 invert loading-logo"
                    alt="Loading..."
                />
            </div>

            {/* NAVBAR */}
            <nav 
                className={`
                    ${isFixed ? 'fixed' : 'sticky'} 
                    top-0 w-full z-50 transition-transform duration-500 ease-in-out nav-glass
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'} 
                `}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
                    
                    {/* 1. MENU TOGGLE */}
                    <div className="flex-1 flex justify-start">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="group flex items-center gap-2 focus:outline-none"
                        >
                            <div className="flex flex-col gap-1.5 w-6">
                                <span className={`h-0.5 bg-white transition-all duration-300 w-full ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`h-0.5 bg-white transition-all duration-300 w-3/4 group-hover:w-full ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`h-0.5 bg-white transition-all duration-300 w-1/2 group-hover:w-full ${isMenuOpen ? '-rotate-45 -translate-y-2 w-full' : ''}`}></span>
                            </div>
                            <span className="hidden md:block text-xs font-black uppercase tracking-[0.2em] text-white group-hover:text-red-600 transition-colors">
                                {isMenuOpen ? 'Chiudi' : 'Menu'}
                            </span>
                        </button>
                    </div>

                    {/* 2. LOGO */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-24 md:w-32 z-50">
                        <a href="/" onClick={handleHomeClick} className="block group">
                            <img 
                                src="/img/logo-registrato.png" 
                                alt="Balaklava" 
                                className="w-full h-auto object-contain brightness-0 invert logo-glitch transition-transform duration-300 group-hover:scale-105" 
                                onError={(e) => e.target.src = '/img/site/logo-registrato.png'}
                            />
                        </a>
                    </div>

                    {/* 3. DESTRA: UTENTE & CARRELLO */}
                    <div className="flex-1 flex justify-end gap-6 text-xs font-black uppercase tracking-[0.2em] items-center text-white">
                        
                        {/* --- DROPDOWN UTENTE (MODIFICATO) --- */}
                        {auth?.user ? (
                            <div className="relative hidden md:block" ref={userMenuRef}>
                                <button 
                                    onClick={() => setIsUserOpen(!isUserOpen)}
                                    className="flex items-center gap-2 hover:text-red-500 transition-colors focus:outline-none"
                                >
                                    ACCOUNT
                                    <svg className={`w-3 h-3 transition-transform duration-300 ${isUserOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {/* Menu a tendina */}
                                <div className={`absolute right-0 mt-4 w-48 bg-[#050505] border border-gray-800 shadow-2xl transition-all duration-200 origin-top-right ${isUserOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-[10px] text-gray-500 border-b border-gray-800 mb-2">
                                            CIAO, {auth.user.name.toUpperCase()}
                                        </div>
                                        <Link href="/dashboard" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                                            DASHBOARD
                                        </Link>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            className="block w-full text-left px-4 py-3 text-red-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                                        >
                                            LOGOUT
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href={route('login')} className="hidden md:block hover:text-red-500 transition-colors">
                                LOGIN
                            </Link>
                        )}

                        <Link href="/cart" className="relative hover:text-red-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* MEGA MENU OVERLAY */}
            <div className={`fixed inset-0 bg-brand-black/95 z-40 flex flex-col items-center justify-center mega-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="flex flex-col items-center space-y-8 relative z-50">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mb-4">Seleziona Collezione</p>
                    
                    {globalCollections && globalCollections.map((collectionName) => (
                        <a 
                            key={collectionName}
                            href={`/#${collectionName.toLowerCase()}`}
                            onClick={() => setIsMenuOpen(false)} 
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 hover:to-red-600 hover:from-red-500 transition-all duration-300 transform hover:scale-110 hover:skew-x-[-10deg]"
                        >
                            {collectionName}
                        </a>
                    ))}

                    <div className="flex flex-col md:flex-row gap-8 mt-12 pt-12 border-t border-gray-800 items-center">
                        {/* Se loggato, mostra Logout anche nel menu mobile/mega */}
                        {auth?.user ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white">Dashboard</Link>
                                <Link href={route('logout')} method="post" as="button" className="text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400">Logout</Link>
                            </>
                        ) : (
                            <Link href={route('login')} className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white">Login</Link>
                        )}
                        
                        <Link href={route('size-guide')} className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white">Size Guide</Link>
                    </div>
                </div>
            </div>
        </>
    );
}