import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Sortu() {
    // useForm hook-ak formularioaren egoera eta bidalketa kudeatzen ditu
    const { data, setData, post, processing, errors } = useForm({
        pisuaren_izena: '',
        pisuaren_kodigoa: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Zure Laravel rutara egiten du deia
        post('/pisua');
    };

    return (
        <AppLayout>
            <Head title="Sortu Pisua" />

            <div className="min-h-screen flex items-center justify-center p-4">
                {/* Kontainerra: Login-aren estilo bera (faur4f2ff hondoa eta ertz moreak) */}
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Sortu Pisua
                        </h1>
                        <p className="text-[#5a4da1]/70 text-sm">
                            Sartu pisu berriaren datuak Odoon gordetzeko
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-5">

                            {/* Pisuaren Izena */}
                            <div className="space-y-2">
                                <Label htmlFor="izena" className="text-[#5a4da1] font-medium">
                                    Pisuaren Izena
                                </Label>
                                <Input
                                    id="izena"
                                    type="text"
                                    name="pisuaren_izena"
                                    value={data.pisuaren_izena}
                                    onChange={(e) => setData('pisuaren_izena', e.target.value)}
                                    placeholder="Adib: Erribera 4, 2.A"
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                />
                                <InputError message={errors.pisuaren_izena} />
                            </div>

                            {/* Pisuaren Kodigoa */}
                            <div className="space-y-2">
                                <Label htmlFor="kodigoa" className="text-[#5a4da1] font-medium">
                                    Pisuaren Kodigoa
                                </Label>
                                <Input
                                    id="kodigoa"
                                    type="text"
                                    name="pisuaren_kodigoa"
                                    value={data.pisuaren_kodigoa}
                                    onChange={(e) => setData('pisuaren_kodigoa', e.target.value)}
                                    placeholder="Adib: P-2024-001"
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                />
                                <InputError message={errors.pisuaren_kodigoa} />
                            </div>

                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2 h-4 w-4" />
                                        Gordetzen...
                                    </>
                                ) : (
                                    "Pisua gorde"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
