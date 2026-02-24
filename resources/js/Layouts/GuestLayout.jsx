import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-black text-gray-100 selection:bg-red-600 selection:text-white">
            <div className="mb-8">
                <Link href="/">
                    {/* Logo: Invertiamo i colori per renderlo bianco su sfondo nero */}
                    <img 
                        src="/img/logo-registrato.png" 
                        className="w-40 h-auto object-contain brightness-0 invert drop-shadow-lg" 
                        alt="Logo"
                        onError={(e) => e.target.src = '/img/site/logo-registrato.png'}
                    />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-[#121212] border border-gray-800 shadow-2xl overflow-hidden sm:rounded-sm">
                {children}
            </div>
        </div>
    );
}