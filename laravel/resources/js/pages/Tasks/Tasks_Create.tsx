import React, { FormEvent } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import { AppHeader, PageProps } from '@/components/app-header';

// Definimos qué forma tiene un usuario (kidea)
interface User {
    id: number;
    name: string;
}

// Extendemos las props para incluir la lista de miembros del piso
interface ExtendedPageProps extends PageProps {
    kideak: User[];
    [key: string]: any;
}

export default function Tasks_Create() {
    // 1. Recibimos 'kideak' (compañeros) desde el backend
    const { props } = usePage<ExtendedPageProps>();
    const { pisua, kideak } = props;

    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        arduraduna_id: '', // CAMBIO: Ahora guardamos el ID, no el nombre
        oharra: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        post(`/pisua/${pisua.id}/kudeatu/atazak`, {
            onSuccess: () => {
                // Éxito
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white font-sans">
            <Head title="Ataza Berria" />
            <AppHeader />

            <main className="flex-grow flex items-center justify-center p-4">
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
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Izena
                                </label>
                                <input
                                    type="text"
                                    value={data.izena}
                                    onChange={e => setData('izena', e.target.value)}
                                    placeholder="Atazaren izena"
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm"
                                />
                                {errors.izena && <div className="text-red-500 text-xs mt-1">{errors.izena}</div>}
                            </div>

                            {/* CAMPO ARDURADUNA (SELECT) */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Arduraduna
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.arduraduna_id}
                                        onChange={e => setData('arduraduna_id', e.target.value)}
                                        className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">Aukeratu arduraduna...</option>
                                        {/* Iteramos sobre los miembros del piso */}
                                        {kideak && kideak.map((kidea) => (
                                            <option key={kidea.id} value={kidea.id}>
                                                {kidea.name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    {/* Icono de flecha para el select (estético) */}
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5a4da1]">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Nota: Asegúrate de que en tu Request de Laravel valides 'arduraduna_id' */}
                                {errors.arduraduna_id && <div className="text-red-500 text-xs mt-1">{errors.arduraduna_id}</div>}
                            </div>

                            {/* CAMPO OHARRA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Oharra
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.oharra}
                                    onChange={e => setData('oharra', e.target.value)}
                                    placeholder="Xehetasunak idatzi..."
                                    className="w-full p-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all resize-none text-sm"
                                />
                                {errors.oharra && <div className="text-red-500 text-xs mt-1">{errors.oharra}</div>}
                            </div>
                        </div>

                        {/* BOTÓN */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-70 flex items-center justify-center font-bold text-sm"
                            >
                                {processing ? 'Sortzen...' : 'Sortu Ataza'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <div className="h-10 w-full bg-transparent"></div>
        </div>
    );
}