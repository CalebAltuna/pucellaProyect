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
    auth: { user: User };
    pisua: Pisua;
    usuarios: User[]; // Usuarios del piso que vienen del controlador
}

interface AtazaFormData {
    izena: string;
    arduradunak: number[]; // Array de IDs numéricos
    data: string;
}

export default function Tasks_Create() {
    const { props } = usePage<PageProps>();
    const { pisua, usuarios } = props;

    const { data, setData, post, processing, errors } = useForm<AtazaFormData>({
        izena: '',
        arduradunak: [], // Inicializado como array vacío
        data: '',
    });

    const handleCheckboxChange = (userId: number) => {
        const currentIds = [...data.arduradunak];
        if (currentIds.includes(userId)) {
            setData('arduradunak', currentIds.filter(id => id !== userId));
        } else {
            setData('arduradunak', [...currentIds, userId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pisua/${pisua.id}/kudeatu/atazak`);
    };

    return (
        <AppLayout>
            <Head title="Sortu Ataza" />
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">Ataza Berria</h1>
                        <p className="text-[#5a4da1]/70 text-sm">Hautatu arduradun bat edo batzuk</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* IZENA */}
                        <div className="space-y-2">
                            <Label htmlFor="izena">Atazaren Izena</Label>
                            <Input
                                id="izena"
                                value={data.izena}
                                onChange={e => setData('izena', e.target.value)}
                                required
                            />
                            <InputError message={errors.izena} />
                        </div>

                        {/* MULTI-SELECTOR DE USUARIOS (Checkboxes) */}
                        <div className="space-y-2">
                            <Label className="text-[#5a4da1] font-medium">Arduradunak</Label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-4 bg-white rounded-lg border border-[#5a4da1]/20">
                                {usuarios?.map((user) => (
                                    <label key={user.id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#5a4da1] focus:ring-[#5a4da1]"
                                            checked={data.arduradunak.includes(user.id)}
                                            onChange={() => handleCheckboxChange(user.id)}
                                        />
                                        <span className="text-sm text-gray-700">{user.name}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.arduradunak} />
                        </div>

                        {/* DATA */}
                        <div className="space-y-2">
                            <Label htmlFor="data">Muga-eguna (Fecha)</Label>
                            <Input
                                id="data"
                                type="date"
                                value={data.data}
                                onChange={e => setData('data', e.target.value)}
                                required
                            />
                            <InputError message={errors.data} />
                        </div>

                        <Button type="submit" className="w-full bg-[#5a4da1]" disabled={processing}>
                            {processing ? <Spinner /> : "Sortu Ataza"}
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
