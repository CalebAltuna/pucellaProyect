import React from 'react';
import { useForm } from '@inertiajs/react';

// SOLUCIÓN AQUÍ:
// 1. Usamos llaves { } porque tu header usa "export function" y no "default".
// 2. Usamos minúsculas "app-header" porque así se llama tu archivo según el error.
import { AppHeader } from '@/components/app-header'; 

export default function Tasks_Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        responsable: '',
        nota: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Asegúrate de que esta ruta exista en tu web.php
        post(route('pisua.store')); 
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            {/* Header importado correctamente */}
            <AppHeader />

            {/* Tarjeta Central (Estilo lila) */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-[#EFE7FB] rounded-[30px] shadow-xl p-8 border border-purple-100">
                    
                    <h1 className="text-2xl font-bold text-[#6B5B95] text-center mb-6">
                        Nueva tarea
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-[#6B5B95] font-medium mb-1 ml-1">Nombre</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                                className="w-full bg-[#F8F0FF] border-2 border-[#D6BCFA] text-purple-900 rounded-xl px-4 py-2 focus:outline-none focus:border-[#6B5B95] focus:ring-1 focus:ring-[#6B5B95]"
                            />
                            {errors.nombre && <div className="text-red-500 text-sm mt-1">{errors.nombre}</div>}
                        </div>

                        {/* Campo Responsable */}
                        <div>
                            <label className="block text-[#6B5B95] font-medium mb-1 ml-1">Responsable</label>
                            <input
                                type="text"
                                value={data.responsable}
                                onChange={e => setData('responsable', e.target.value)}
                                className="w-full bg-[#F8F0FF] border-2 border-[#D6BCFA] text-purple-900 rounded-xl px-4 py-2 focus:outline-none focus:border-[#6B5B95] focus:ring-1 focus:ring-[#6B5B95]"
                            />
                        </div>

                        {/* Campo Nota */}
                        <div>
                            <label className="block text-[#6B5B95] font-medium mb-1 ml-1">Nota</label>
                            <textarea
                                rows={4}
                                value={data.nota}
                                onChange={e => setData('nota', e.target.value)}
                                className="w-full bg-[#F8F0FF] border-2 border-[#D6BCFA] text-purple-900 rounded-xl px-4 py-2 focus:outline-none focus:border-[#6B5B95] focus:ring-1 focus:ring-[#6B5B95] resize-none"
                            />
                        </div>

                        {/* Botón Crear */}
                        <div className="flex justify-center mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#6B5B95] hover:bg-[#5a4b80] text-white font-bold py-2 px-12 rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer morado */}
            <div className="h-16 bg-[#6B5B95] w-full"></div>
        </div>
    );
}