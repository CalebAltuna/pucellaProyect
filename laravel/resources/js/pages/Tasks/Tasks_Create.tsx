import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AppHeader, PageProps } from '@/components/app-header'; 

interface Ataza {
    id: number;
    izena: string;
    egoera: string;
    user?: { name: string };
    arduraduna?: { name: string };
    created_at: string;
}

interface Props {
    atazak: Ataza[];
}

export default function Tasks_Create({ atazak = [] }: Props) {

    const { props } = usePage<PageProps>();
    const { pisua } = props; // Aquí obtenemos el piso actual compartido por el Middleware
    
    const [localTasks, setLocalTasks] = useState<Ataza[]>(atazak);
    

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        responsable: '',
        nota: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/atazak/store'); 
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white font-sans">
            <AppHeader />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    
                    {/* ENCABEZADO */}
                    <div className="text-center mb-8">
                        {/* Reducido a text-2xl */}
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Ataza Berria
                        </h1>
                        {/* Reducido a text-sm */}
                        <p className="text-[#5a4da1]/70 text-sm">
                            Bete datuak ataza berria sortzeko
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            
                            {/* CAMPO IZENA */}
                            <div className="space-y-2">
                                {/* Label: text-sm */}
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Izena
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Atazaren izena"
                                    // Input: text-sm para que se vea más fino
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm"
                                />
                                {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                            </div>

                            {/* CAMPO ARDURADUNA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Arduraduna
                                </label>
                                <input
                                    type="text"
                                    value={data.responsable}
                                    onChange={e => setData('responsable', e.target.value)}
                                    placeholder="Nor arduratuko da?"
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm"
                                />
                            </div>

                            {/* CAMPO OHARRA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Oharra
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.nota}
                                    onChange={e => setData('nota', e.target.value)}
                                    placeholder="Xehetasunak idatzi..."
                                    className="w-full p-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all resize-none text-sm"
                                />
                            </div>
                        </div>

                        {/* BOTÓN */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                // Botón: text-sm y font-bold
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