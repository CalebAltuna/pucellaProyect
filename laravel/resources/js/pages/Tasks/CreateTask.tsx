import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Pisua {
    id: number;
    izena: string;
}

interface PageProps {
    [key: string]: any;
    auth: { user: User };
    pisua?: Pisua;
}

interface AtazaFormData {
    izena: string;
    arduradunak: string[];
    data: string;
    pisua_id: number;
}

export default function Tasks_Create() {
    const { props } = usePage<PageProps>();
    const { pisua } = props;

    const { data, setData, post, processing, errors } = useForm<AtazaFormData>({
        izena: '',
        arduradunak: [],
        data: '',
        pisua_id: pisua?.id || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!pisua?.id) {
            alert("Error: No se encontró el ID del piso.");
            return;
        }

        const url = `/pisua/${pisua.id}/kudeatu/atazak`;

        post(url, {
            onSuccess: () => {
                console.log("Ataza creada correctamente");
            },
            onError: (serverErrors: Record<string, string>) => {
                console.error("Error de validación:", serverErrors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Sortu Ataza" />

            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Ataza Berria
                        </h1>
                        <p className="text-[#5a4da1]/70 text-sm">
                            Bete datuak ataza berria sortzeko
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">

                            {/* CAMPO IZENA */}
                            <div className="space-y-2">
                                <Label htmlFor="izena" className="text-[#5a4da1] font-medium">
                                    Izena
                                </Label>
                                <Input
                                    id="izena"
                                    type="text"
                                    name="izena"
                                    value={data.izena}
                                    onChange={e => setData('izena', e.target.value)}
                                    placeholder="Atazaren izena"
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                />
                                <InputError message={errors.izena} />
                            </div>

                            {/* CAMPO ARDURADUNA */}
                            <div className="space-y-2">
                                <Label htmlFor="arduradunak" className="text-[#5a4da1] font-medium">
                                    Arduraduna
                                </Label>
                                <Input
                                    id="arduradunak"
                                    type="text"
                                    name="arduradunak"
                                    value={data.arduradunak.join(', ')}
                                    onChange={e => setData('arduradunak', e.target.value.split(',').map(id => id.trim()).filter(id => id))}
                                    placeholder="IDs separados por comas (p.ej: 1, 2, 3)"
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                />
                                <InputError message={errors.arduradunak} />
                            </div>

                            {/* CAMPO DATA */}
                            <div className="space-y-2">
                                <Label htmlFor="data" className="text-[#5a4da1] font-medium">
                                    Data
                                </Label>
                                <Input
                                    id="data"
                                    type="date"
                                    name="data"
                                    value={data.data}
                                    onChange={e => setData('data', e.target.value)}
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20"
                                    required
                                />
                                <InputError message={errors.data} />
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
                                        Sortzen...
                                    </>
                                ) : (
                                    "Sortu Ataza"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
