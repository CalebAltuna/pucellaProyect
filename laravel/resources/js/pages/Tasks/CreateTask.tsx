import React, { FormEvent } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import { AppHeader, PageProps } from '@/components/app-header';

// 1. Definimos qué es un "Pisua" para que TS lo reconozca
interface Pisua {
    id: number;
    izena: string;
    // otros campos si los necesitas...
}

interface User {
    id: number;
    name: string;
    email: string;
}

// 2. Corregimos la Interfaz:
// - Quitamos el [key: any] que daba error.
// - Definimos 'pisua' explícitamente como obligatorio (sin ?).
interface ExtendedPageProps extends PageProps {
    pisua: Pisua;
    usuarios: User[];
}

export default function Tasks_Create() {
    // TypeScript ahora sabe que pisua y usuarios SON obligatorios
    const { props } = usePage<ExtendedPageProps>();
    const { pisua, usuarios } = props;

    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        arduradunak: [] as number[],
        data: '',
    });

    // 3. Pequeña protección extra: Si por algún error raro pisua no llega, no renderizamos nada
    // Esto calla definitivamente cualquier queja de "possibly null"
    if (!pisua) return null;

    const handleCheckboxChange = (userId: number) => {
        const currentIds = [...data.arduradunak];
        if (currentIds.includes(userId)) {
            setData('arduradunak', currentIds.filter(id => id !== userId));
        } else {
            setData('arduradunak', [...currentIds, userId]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Como hemos validado arriba que pisua existe, aquí TS ya no se queja
        post(`/pisua/${pisua.id}/kudeatu/atazak`, {
            onSuccess: () => {
                window.location.href = `/pisua/${pisua.id}/kudeatu/atazak`;
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
                            Hautatu arduradun bat edo batzuk
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* IZENA */}
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
                                    required
                                />
                                {errors.izena && <div className="text-red-500 text-xs mt-1">{errors.izena}</div>}
                            </div>

                            {/* ARDURADUNAK (CHECKBOXES) */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Arduradunak
                                </label>
                                <div className="max-h-48 overflow-y-auto p-4 bg-white rounded-lg border border-[#5a4da1]/20">
                                    {/* Añadimos '?' y protección de length para evitar errores si el array está vacío */}
                                    {usuarios && usuarios.length > 0 ? (
                                        usuarios.map((user) => (
                                            <label key={user.id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded mb-2 last:mb-0">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-[#5a4da1] focus:ring-[#5a4da1]"
                                                    checked={data.arduradunak.includes(user.id)}
                                                    onChange={() => handleCheckboxChange(user.id)}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                                    <span className="text-xs text-gray-500">{user.email}</span>
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 text-center py-2">Ez dago kiderik pisuan</p>
                                    )}
                                </div>
                                {errors.arduradunak && <div className="text-red-500 text-xs mt-1">{errors.arduradunak}</div>}
                            </div>

                            {/* DATA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Muga-eguna
                                </label>
                                <input
                                    type="date"
                                    value={data.data}
                                    onChange={e => setData('data', e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm"
                                    required
                                />
                                {errors.data && <div className="text-red-500 text-xs mt-1">{errors.data}</div>}
                            </div>
                        </div>

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
