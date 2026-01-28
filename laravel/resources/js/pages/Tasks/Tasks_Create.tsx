import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';

interface PageProps extends Record<string, any> {
    auth: { user: any };
    pisua?: { id: number; izena: string };
}

export default function Tasks_Create() {
    const { props } = usePage<PageProps>();
    const { pisua } = props;

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        responsable: '',
        nota: '',
        pisua_id: pisua?.id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("1. Botón pulsado. Intentando enviar..."); // DEBUG

        // OJO: Es muy probable que tu ruta no sea 'pisua.store' (eso crea pisos),
        // sino algo como 'atazak.store' o 'pisua.atazak.store'.
        // Revisa tu archivo routes/web.php
        
        const routeName = 'pisua.store'; // <--- CAMBIA ESTO SI TU RUTA TIENE OTRO NOMBRE
        
        try {
            // Preparamos la URL. Si el piso existe, pasamos el ID.
            // Si la ruta no necesita ID, Laravel lo ignorará o lo pondrá en query string.
            const url = pisua?.id 
                ? route(routeName, pisua.id) 
                : route(routeName);

            console.log("2. URL generada:", url); // DEBUG

            post(url, {
                onSuccess: () => {
                    console.log("3. Éxito: Ataza creada");
                },
                onError: (errors) => {
                    console.error("3. Error de validación del servidor:", errors);
                    alert("Hay errores en el formulario. Revisa la consola (F12).");
                },
                onFinish: () => {
                    console.log("4. Proceso finalizado");
                }
            });
        } catch (error) {
            console.error("ERROR CRÍTICO EN ROUTE():", error);
            alert("Error: La ruta '" + routeName + "' no existe en Laravel o faltan parámetros.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white font-sans">
            <Head title="Sortu Ataza" />
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
                                <label className="block text-[#5a4da1] font-medium text-sm">Izena</label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Atazaren izena"
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#5a4da1]/20 transition-all text-sm text-gray-800"
                                />
                                {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
                            </div>

                            {/* CAMPO ARDURADUNA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">Arduraduna</label>
                                <input
                                    type="text"
                                    value={data.responsable}
                                    onChange={e => setData('responsable', e.target.value)}
                                    placeholder="Nor arduratuko da?"
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#5a4da1]/20 transition-all text-sm text-gray-800"
                                />
                                {errors.responsable && <div className="text-red-500 text-xs mt-1">{errors.responsable}</div>}
                            </div>

                            {/* CAMPO OHARRA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">Oharra</label>
                                <textarea
                                    rows={4}
                                    value={data.nota}
                                    onChange={e => setData('nota', e.target.value)}
                                    placeholder="Xehetasunak idatzi..."
                                    className="w-full p-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#5a4da1]/20 transition-all resize-none text-sm text-gray-800"
                                />
                                {errors.nota && <div className="text-red-500 text-xs mt-1">{errors.nota}</div>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center font-bold text-sm"
                        >
                            {processing ? 'Sortzen...' : 'Sortu Ataza'}
                        </button>
                    </form>
                </div>
            </main>

            <div className="h-10 w-full bg-transparent"></div>
        </div>
    );
}