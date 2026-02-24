import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifica Email" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Verifica Email</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-4 leading-relaxed">
                    Grazie per esserti registrato! Prima di iniziare, verifica il tuo indirizzo email cliccando sul link che ti abbiamo appena inviato.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500 text-green-400 text-xs font-bold uppercase tracking-wide text-center">
                    Un nuovo link di verifica è stato inviato al tuo indirizzo email.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="mt-8">
                    <PrimaryButton className="w-full justify-center py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em]" disabled={processing}>
                        Reinvia Email di Verifica
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-red-600"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}