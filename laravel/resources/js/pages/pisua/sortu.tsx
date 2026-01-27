import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Sortu() {
    // useForm hook-ak formularioaren egoera, erroreak eta bidalketa kudeatzen ditu
    const { data, setData, post, processing, errors } = useForm({
        pisuaren_izena: '',
        pisuaren_kodigoa: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Hemen zure Laravel rutara egiten duzu deia.
        post('/pisua');
    };

    return (
        <AppLayout>
            <Head title="Sortu Pisua" />

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    
                    {/* Encabezado */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Sortu Pisua
                        </h1>
                        <p className="text-[#5a4da1]/70 text-sm">
                            Sartu pisu berriaren informazioa
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-5">
                            {/* Pisuaren Izena */}
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="izena" 
                                    className="text-[#5a4da1] font-medium"
                                >
                                    Pisuaren Izena
                                </Label>
                                <Input
                                    type="text"
                                    name="pisuaren_izena"
                                    id="izena"
                                    value={data.pisuaren_izena}
                                    onChange={(e) => setData('pisuaren_izena', e.target.value)}
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                    placeholder="Adibidez: Pisu Nagusia"
                                />
                                <InputError 
                                    message={errors.pisuaren_izena} 
                                    className="mt-2"
                                />
                            </div>

                            {/* Pisuaren Kodigoa */}
                            <div className="space-y-2">
                                <Label 
                                    htmlFor="kodigoa" 
                                    className="text-[#5a4da1] font-medium"
                                >
                                    Pisuaren Kodigoa
                                </Label>
                                <Input
                                    type="text"
                                    name="pisuaren_kodigoa"
                                    id="kodigoa"
                                    value={data.pisuaren_kodigoa}
                                    onChange={(e) => setData('pisuaren_kodigoa', e.target.value)}
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                    placeholder="Adibidez: A001"
                                />
                                <InputError 
                                    message={errors.pisuaren_kodigoa} 
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Botón de envío */}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4" />}
                            {processing ? 'Gordetzen...' : 'Gorde Odoon'}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}