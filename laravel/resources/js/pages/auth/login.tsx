import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input'; // Corregido path
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
// Nota: He removido AuthLayout para tener control total del ancho y el grid
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

            {/* Fondo general con elementos decorativos sutiles */}
            <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 relative overflow-hidden">

                {/* Decoración de fondo (Orbs/Blobs) para darle vida al espacio negativo */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/30 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

                {/* TARJETA PRINCIPAL */}
                {/* - w-full max-w-md: En móvil es estrecho y centrado.
                   - lg:max-w-5xl: En desktop es MUCHO más amplio (Wide).
                   - grid lg:grid-cols-2: Divide la tarjeta en dos columnas en pantallas grandes.
                */}
                <div className="w-full max-w-md lg:max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-2 transition-all duration-500 border border-white/50">

                    {/* COLUMNA IZQUIERDA (Visual - Solo Desktop) */}
                    {/* Esta sección le da la amplitud visual y estética sin deformar el formulario */}
                    <div className="hidden lg:flex flex-col justify-center items-center p-12 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 text-white">
                        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div> {/* Opcional: Patrón de fondo */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        <div className="relative z-10 text-center space-y-6 max-w-sm">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6">
                                {/* Icono o Logo aquí */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Bienvenido de nuevo</h2>
                            <p className="text-indigo-100 text-lg font-light leading-relaxed">
                                Accede a tu panel de control y gestiona tus proyectos con la mejor experiencia visual.
                            </p>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA (Formulario) */}
                    <div className="p-8 sm:p-10 lg:p-16 bg-white flex flex-col justify-center relative">

                        {/* Header Móvil / Desktop */}
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                                Iniciar Sesión
                            </h1>
                            <p className="text-slate-500">
                                Por favor ingresa tus credenciales para entrar.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-100 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {status}
                            </div>
                        )}

                        <Form {...store.form()} resetOnSuccess={['password']} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    {/* Email */}
                                    <div className="space-y-2 group">
                                        <Label htmlFor="email" className="text-slate-700 font-semibold pl-1 transition-colors group-focus-within:text-indigo-600">
                                            Correo electrónico
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="nombre@ejemplo.com"
                                                className="h-14 pl-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2 group">
                                        <div className="flex items-center justify-between pl-1">
                                            <Label htmlFor="password" className="text-slate-700 font-semibold transition-colors group-focus-within:text-indigo-600">
                                                Contraseña
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink href={request()} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                                    ¿Olvidaste la contraseña?
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
                                            className="h-14 pl-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember & Submit */}
                                    <div className="pt-2 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                className="border-slate-300 text-indigo-600 rounded-md w-5 h-5 focus:ring-indigo-500"
                                            />
                                            <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">Recordarme</Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2 h-5 w-5 text-white" />
                                        ) : (
                                            "Iniciar Sesión"
                                        )}
                                    </Button>

                                    {/* Register Footer */}
                                    {canRegister && (
                                        <div className="pt-4 text-center">
                                            <p className="text-slate-500 text-sm">
                                                ¿Aún no tienes cuenta?{' '}
                                                <TextLink href={register()} className="font-bold text-indigo-600 hover:text-indigo-500 ml-1 transition-colors">
                                                    Crear cuenta gratis
                                                </TextLink>
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
