import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AppLayout>
            <Head title="Iniciar Sesión" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
                <AuthLayout
                    title=""
                    description=""
                >
                    {/* Contenedor tipo Tarjeta (el recuadro lila de la imagen) */}
                    <div className="mx-auto w-full max-w-md bg-white rounded-[24px] shadow-xl p-10 border border-white/20">
                        <h1 className="text-3xl font-normal text-center text-[#6A1B9A] mb-10">
                            Iniciar Sesión
                        </h1>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        {/* Email */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-[#6A1B9A] text-lg">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                className="h-12 rounded-2xl border-purple-400 bg-[#F3E5F5] shadow-sm focus-visible:ring-purple-500"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Contraseña */}
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password" className="text-[#6A1B9A] text-lg">Contraseña</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="ml-auto text-xs text-purple-700 opacity-80"
                                                        tabIndex={5}
                                                    >
                                                        ¿Olvidaste la clave?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                className="h-12 rounded-2xl border-purple-400 bg-[#F3E5F5] shadow-sm focus-visible:ring-purple-500"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Checkbox Recordarme */}
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-purple-400 data-[state=checked]:bg-purple-600"
                                            />
                                            <Label htmlFor="remember" className="text-[#6A1B9A] text-sm">Recordarme</Label>
                                        </div>

                                        {/* Botón Enviar */}
                                        <div className="flex justify-center mt-2">
                                            <Button
                                                type="submit"
                                                className="w-32 h-11 bg-[#6B5BAE] hover:bg-[#5a4a9c] text-white rounded-xl text-lg shadow-md transition-colors"
                                                tabIndex={4}
                                                disabled={processing}
                                            >
                                                {processing && <Spinner />}
                                                Enviar
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Registro */}
                                    {canRegister && (
                                        <div className="text-center text-lg mt-4">
                                            <span className="text-[#4A148C]">¿No tienes cuenta? </span>
                                            <TextLink
                                                href={register()}
                                                tabIndex={5}
                                                className="text-blue-600 font-bold hover:underline"
                                            >
                                                REGÍSTRATE
                                            </TextLink>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </AuthLayout>
            </div>
        </AppLayout>
    );
}
