import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canRegister: boolean;
}

export default function Login({ status, canRegister }: LoginProps) {
    return (
        <AppLayout>
            <Head title="Iniciar Sesión" />

            {/* main container, general */}
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50/50">

                {/* tarjeta de login*/}
                <div className="w-full max-w-md lg:max-w-6xl bg-purple rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100 transition-all duration-500 border hover:border-[#5a4da1]/30">

                    <div className="p-8 sm:p-12 lg:p-20 flex flex-col items-center">

                        {/* header de tarjeta */}
                        <div className="text-center mb-12 max-w-2xl">
                            <h1 className="text-4xl lg:text-6xl font-bold text-[#5a4da1] tracking-tight mb-4">
                                Saioa hasi
                            </h1>
                            <p className="text-[#5a4da1]/60 text-lg lg:text-xl">
                                Sartu zure kontua, pisuak kudeatu ahal izateko!
                            </p>
                        </div>

                        {status && (
                            <div className="w-full max-w-md mb-8 p-4 rounded-2xl bg-[#5a4da1]/5 text-[#5a4da1] text-sm text-center border border-[#5a4da1]/10">
                                {status}
                            </div>
                        )}

                        {/* Contenedor del Formulario limitado a max-w-md para que los inputs no se estiren infinitamente */}
                        <div className="w-full max-w-md">
                            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-8">
                                {({ processing, errors }) => (
                                    <>
                                        {/* input a partir de aquí */}
                                        <div className="flex flex-col gap-y-6">

                                            {/* Email*/}
                                            <div className="space-y-3">
                                                <Label htmlFor="email" className="text-[#5a4da1] font-semibold ml-1">
                                                    Helbide elektronikoa
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    placeholder="erab@adibidea.com"
                                                    className="h-14 px-6 rounded-2xl border hover:border-[#5a4da1]/20 bg-white focus:ring-4 focus:ring-[#5a4da1]/10 focus:border-[#5a4da1] transition-all text-base shadow-sm "
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            {/* Contraseña (Abajo) */}
                                            <div className="space-y-3">
                                                <Label htmlFor="password" className="text-[#5a4da1] font-semibold ml-1">
                                                    Pasahitza
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    placeholder="••••••••"
                                                    className="h-14 px-6 rounded-2xl border hover:border-[#5a4da1]/20 bg-white focus:ring-4 focus:ring-[#5a4da1]/10 focus:border-[#5a4da1] transition-all text-base shadow-sm "
                                                />
                                                <InputError message={errors.password} />
                                            </div>
                                        </div>

                                        {/* Acciones de envío */}
                                        <div className="flex flex-col items-center pt-4 space-y-6">
                                            <Button
                                                type="submit"
                                                className="w-full h-14 text-lg font-bold bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-2xl shadow-xl shadow-[#5a4da1]/20 hover:shadow-[#5a4da1]/30 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
                                                disabled={processing}
                                            >
                                                {processing ? <Spinner className="mr-2 h-5 w-5" /> : "Sartu"}
                                            </Button>

                                            {canRegister && (
                                                <div className="text-[#5a4da1]/70 font-medium">
                                                    Ez daukazu konturik?{' '}
                                                    <TextLink
                                                        href={register()}
                                                        className="text-[#5a4da1] hover:text-[#4a3c91] font-bold transition-colors ml-1"
                                                    >
                                                        Doanik erregistratu
                                                    </TextLink>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
