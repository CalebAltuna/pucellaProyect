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
            <Head title="Saioa Hasi" />

            <div className="min-h-screen flex items-center justify-center p-4 ">

                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8 ">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Saioa hasi
                        </h1>
                        <p className="text-[#5a4da1]/70 text-sm">
                            Sartu zure kontua, pisuak kudeatu ahal izateko
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-3 rounded-lg bg-[#5a4da1]/10 text-[#5a4da1] text-sm text-center border border-[#5a4da1]/20">
                            {status}
                        </div>
                    )}

                    <Form {...store.form()} resetOnSuccess={['password']} className="space-y-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#5a4da1] font-medium">
                                            Helbide elektronikoa
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            placeholder="erab@adibidea.com"
                                            className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-[#5a4da1] font-medium">
                                            Pasahitza
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                        disabled={processing}
                                    >
                                        {processing ? <Spinner className="mr-2 h-4 w-4" /> : "Sartu"}
                                    </Button>

                                    {canRegister && (
                                        <p className="text-center text-[#5a4da1]/70 text-sm">
                                            Ez daukazu konturik?{' '}
                                            <TextLink
                                                href={register()}
                                                className="text-[#5a4da1] hover:text-[#4a3c91] font-medium"
                                            >
                                                Doanik erregistratu
                                            </TextLink>
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}