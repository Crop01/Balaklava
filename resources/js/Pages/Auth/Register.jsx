import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrati" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Join the Movement</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Crea il tuo account Balaklava</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nome Completo" className="text-gray-400" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm placeholder-gray-600"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-400" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-gray-400" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Conferma Password" className="text-gray-400" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-8">
                    <PrimaryButton className="w-full justify-center py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em]" disabled={processing}>
                        Registrati
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <Link
                        href={route('login')}
                        className="text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-red-600"
                    >
                        Hai già un account? Accedi
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}