import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Nuova Password</h2>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-400" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm opacity-50 cursor-not-allowed"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        disabled
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nuova Password" className="text-gray-400" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-[#050505] border-gray-800 text-white focus:border-red-600 focus:ring-red-600 rounded-sm"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
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
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-8">
                    <PrimaryButton className="w-full justify-center py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em]" disabled={processing}>
                        Reimposta Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}