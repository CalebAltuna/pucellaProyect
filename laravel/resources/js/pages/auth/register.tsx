import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';

export default function Register() {
    return (
        <AppLayout>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    
                    {/* Encabezado */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Sortu kontu bat
                        </h1>
                        <p className="text-[#5a4da1]/70 text-sm">
                            Sartu zure datuak kontua sortzeko
                        </p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-5">
                                    {/* Izena */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[#5a4da1] font-medium">
                                            Izena
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Izen osoa"
                                            className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#5a4da1] font-medium">
                                            Email helbidea
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@adibidea.eus"
                                            className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Pasahitza */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#5a4da1] font-medium">
                                            Pasahitza
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Pasahitza"
                                            className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Pasahitza konfirmatu */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-[#5a4da1] font-medium">
                                            Pasahitza konfirmatu
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Pasahitza konfirmatu"
                                            className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                        tabIndex={5}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner className="mr-2 h-4 w-4" />}
                                        Create account
                                    </Button>

                                    <div className="text-center text-[#5a4da1]/70 text-sm">
                                        Baduzu kontu bat?{' '}
                                        <TextLink 
                                            href={login()} 
                                            tabIndex={6}
                                            className="text-[#5a4da1] hover:text-[#4a3c91] font-medium"
                                        >
                                            Hasi saioa
                                        </TextLink>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}