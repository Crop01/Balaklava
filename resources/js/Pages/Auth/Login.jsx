import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Login</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Accedi al tuo account</p>
            </div>

            {status && <div className="mb-6 p-4 bg-green-900/20 border border-green-500 text-green-400 text-xs font-bold uppercase tracking-wide text-center">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-400" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="bg-black border-gray-700 text-red-600 focus:ring-red-600 rounded-sm"
                        />
                        <span className="ms-2 text-xs text-gray-400 uppercase tracking-wide">Ricordami</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-gray-500 hover:text-white uppercase tracking-wide transition-colors"
                        >
                            Password dimenticata?
                        </Link>
                    )}
                </div>

                <div className="mt-8">
                    <PrimaryButton className="w-full justify-center py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em]" disabled={processing}>
                        Accedi
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <Link href={route('register')} className="text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-red-600">
                        Non hai un account? Registrati
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}