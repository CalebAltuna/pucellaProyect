import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@//components/ui/input';
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

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    return (
        <AppLayout>
            <Head title="Iniciar Sesión" />

            {/* Contenedor sin fondo y centrado */}
            <div className="min-h-screen flex items-center justify-center px-4">
                <AuthLayout title="" description="">
                    {/* Tarjeta: más ancha en desktop, se estrecha solo en móvil */}
                    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-900/10 p-6 sm:p-8 md:p-10 space-y-8">

                        {/* Header */}
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">
                                Iniciar Sesión
                            </h1>
                            <p className="text-sm text-purple-900/60 mt-2">Accede para continuar</p>
                        </div>

                        <Form {...store.form()} resetOnSuccess={['password']} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-purple-900 font-medium">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            placeholder="tucorreo@ejemplo.com"
                                            className="h-12 rounded-2xl border-purple-300 bg-purple-50/50 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-400/80"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Contraseña */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-purple-900 font-medium">Contraseña</Label>
                                            {canResetPassword && (
                                                <TextLink href={request()} className="text-xs text-purple-700 hover:underline">
                                                    ¿Olvidaste tu contraseña?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="h-12 rounded-2xl border-purple-300 bg-purple-50/50 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-400/80"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Recordarme */}
                                    <div className="flex items-center justify-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            className="border-purple-400 data-[state=checked]:bg-purple-600"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-purple-900/80">Recordarme</Label>
                                    </div>

                                    {/* Botón */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg shadow-purple-500/20 transition-all duration-300 disabled:opacity-70"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Iniciar sesión
                                    </Button>

                                    {/* Registro */}
                                    {canRegister && (
                                        <div className="text-center text-sm">
                                            <span className="text-purple-900/70">¿No tienes cuenta?</span>{' '}
                                            <TextLink href={register()} className="font-semibold text-purple-700 hover:underline">
                                                Regístrate
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
