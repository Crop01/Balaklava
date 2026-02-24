import { Head, Link } from '@inertiajs/react'; 

export default function SizeGuide() {
    return (
        <div className="bg-brand-black min-h-screen text-brand-text selection:bg-red-600 selection:text-white font-sans">
            <Head title="Guida alle Taglie" />

            <nav className="w-full p-6 flex justify-between items-center border-b border-brand-gray">
                <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                    ← Torna allo Shop
                </Link>
                <div className="text-xl font-black tracking-tighter uppercase">
                    Guida Taglie
                </div>
                <div className="w-[100px]"></div> {/* Spacer per centrare il titolo */}
            </nav>

            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-brand-dark p-8 rounded-sm border border-brand-gray shadow-2xl">
                    
                    {/* Titolo */}
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-white">
                        Guida Taglie Felpa
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-8">
                        Trova la taglia perfetta per la tua Felpa BKLF Classic
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        
                        {/* Immagine Tabella */}
                        <div className="bg-white p-2 rounded-sm">
                            {/* Assicurati che il nome del file sia esatto nella cartella public/img/products/ */}
                            <img 
                                src="/img/products/taglie_felpe.jpeg" 
                                alt="Tabella Misure" 
                                className="w-full h-auto object-contain"
                                onError={(e) => { 
                                    e.target.onerror = null; 
                                    // Fallback visivo se l'immagine non viene trovata subito
                                    e.target.parentNode.innerHTML = '<div class="text-black text-center p-4 text-xs font-bold uppercase">Immagine Taglie<br/>(Carica taglie_felpe.jpeg)</div>'; 
                                }} 
                            />
                        </div>

                        {/* Testo Istruzioni */}
                        <div className="space-y-8 text-sm leading-relaxed text-gray-300">
                            
                            <div>
                                <h3 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-brand-gray pb-2">
                                    Come prendere le misure
                                </h3>
                                <p className="mb-4">Per trovare la taglia perfetta, misura il tuo corpo seguendo queste indicazioni:</p>
                                <ul className="space-y-2 list-disc list-inside marker:text-red-600">
                                    <li><strong className="text-white">A. Larghezza spalle:</strong> Misura da un'estremità della spalla all'altra.</li>
                                    <li><strong className="text-white">B. Larghezza torace:</strong> Misura la circonferenza del torace nel punto più ampio.</li>
                                    <li><strong className="text-white">C. Lunghezza maniche:</strong> Misura dalla spalla fino al polso con il braccio leggermente piegato.</li>
                                    <li><strong className="text-white">D. Lunghezza totale:</strong> Misura dalla parte superiore della spalla fino all'orlo inferiore.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-brand-gray pb-2">
                                    Consigli per la scelta
                                </h3>
                                <ul className="space-y-2">
                                    <li>La Felpa BKLF Classic ha una vestibilità <span className="text-white font-bold">baggy, leggermente oversize</span>.</li>
                                    <li>Se preferisci una vestibilità più aderente, considera di scegliere una taglia più piccola.</li>
                                    <li>Se sei tra due taglie, consigliamo di scegliere la taglia più grande per un comfort ottimale.</li>
                                    <li className="text-xs text-gray-500 mt-2 italic">Nota: Il tessuto potrebbe restringersi leggermente dopo il primo lavaggio (circa 5%).</li>
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-brand-gray">
                                <p className="text-xs uppercase tracking-widest mb-4">
                                    Dubbi? Contattaci su Instagram.
                                </p>
                                <Link 
                                    href="/" 
                                    className="inline-block bg-white text-black px-8 py-3 font-black uppercase tracking-widest hover:bg-gray-200 transition-colors text-xs"
                                >
                                    Torna allo Shop
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center text-xs text-gray-600 uppercase tracking-widest">
                    &copy; 2025 Balaklava. Tutti i diritti riservati.
                </footer>
            </div>
        </div>
    );
}