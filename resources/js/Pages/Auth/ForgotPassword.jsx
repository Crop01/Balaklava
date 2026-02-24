import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Password Dimenticata</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-4 leading-relaxed max-w-sm mx-auto">
                    Nessun problema. Inserisci la tua email e ti invieremo un link per sceglierne una nuova.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500 text-green-400 text-xs font-bold uppercase tracking-wide text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-400" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-8">
                    <PrimaryButton className="w-full justify-center py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em]" disabled={processing}>
                        Invia Link di Reset
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}