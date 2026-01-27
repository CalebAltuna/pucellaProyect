import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Usamos el Layout como en tu Login
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';

export default function Tasks_Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        responsable: '',
        nota: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Asegúrate de que esta ruta es correcta en tu web.php
        post(route('pisua.store')); 
    };

    return (
        <AppLayout>
            <Head title="Sortu Ataza" />

            <div className="min-h-screen flex items-center justify-center p-4">
                {/* Tarjeta con el estilo del Login: Fondo lila claro, borde suave */}
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    
                    {/* Encabezado */}
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
                            
                            {/* Campo: Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="nombre" className="text-[#5a4da1] font-medium">
                                    Izena
                                </Label>
                                <Input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Atazaren izena"
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 bg-white"
                                />
                                <InputError message={errors.nombre} />
                            </div>

                            {/* Campo: Responsable */}
                            <div className="space-y-2">
                                <Label htmlFor="responsable" className="text-[#5a4da1] font-medium">
                                    Arduraduna
                                </Label>
                                <Input
                                    id="responsable"
                                    type="text"
                                    value={data.responsable}
                                    onChange={(e) => setData('responsable', e.target.value)}
                                    placeholder="Nor arduratuko da?"
                                    className="h-12 px-4 rounded-lg border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 bg-white"
                                />
                                <InputError message={errors.responsable} />
                            </div>

                            {/* Campo: Nota (Textarea simulando estilo Input) */}
                            <div className="space-y-2">
                                <Label htmlFor="nota" className="text-[#5a4da1] font-medium">
                                    Oharra
                                </Label>
                                <textarea
                                    id="nota"
                                    rows={4}
                                    value={data.nota}
                                    onChange={(e) => setData('nota', e.target.value)}
                                    placeholder="Xehetasunak idatzi..."
                                    className="w-full px-4 py-3 rounded-lg border border-[#5a4da1]/20 focus:border-[#5a4da1] focus:ring focus:ring-[#5a4da1]/20 bg-white text-sm outline-none resize-none"
                                />
                                <InputError message={errors.nota} />
                            </div>
                        </div>

                        {/* Botón de Acción */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                disabled={processing}
                            >
                                {processing ? <Spinner className="mr-2 h-4 w-4" /> : "Sortu Ataza"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}