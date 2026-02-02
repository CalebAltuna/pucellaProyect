import React, { FormEvent } from 'react';
import { useForm, usePage, Head } from '@inertiajs/react';
import { AppHeader, PageProps } from '@/components/app-header';

interface Pisua {
    id: number;
    izena: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ExtendedPageProps extends PageProps {
    pisua: Pisua;
    usuarios: User[];
}

export default function Tasks_Create() {
    const { props } = usePage<ExtendedPageProps>();
    const { pisua, usuarios } = props;

    // Obtener fecha actual en formato YYYY-MM-DD para el min del input date
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        arduradunak: [] as number[],
        data: today, // Establecemos la fecha actual por defecto
    });

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

        // Validación adicional en el frontend
        if (data.data < today) {
            alert('Ezin da ataza bat atzera data batekin sortu. Mesedez, aukeratu gaurko data edo etorkizuneko bat.');
            return;
        }

        if (data.arduradunak.length === 0) {
            alert('Mesedez, hautatu gutxienez arduradun bat.');
            return;
        }

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
                                    Izena *
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
                                <div className="flex justify-between items-center">
                                    <label className="block text-[#5a4da1] font-medium text-sm">
                                        Arduradunak *
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        {data.arduradunak.length} hautatuta
                                    </span>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-4 bg-white rounded-lg border border-[#5a4da1]/20">
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
                                        <div className="text-center py-2">
                                            <p className="text-xs text-gray-400">Ez dago kiderik pisuan</p>
                                            <p className="text-xs text-gray-300 mt-1">
                                                Lehenik pisoan kideak gehitu behar dituzu
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.arduradunak && <div className="text-red-500 text-xs mt-1">{errors.arduradunak}</div>}
                            </div>

                            {/* DATA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm">
                                    Muga-eguna *
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={data.data}
                                        onChange={e => setData('data', e.target.value)}
                                        min={today}
                                        className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.data && <div className="text-red-500 text-xs mt-1">{errors.data}</div>}
                                <p className="text-xs text-gray-500 mt-1">
                                    Ezin da atzera data bat aukeratu. Gaur: {new Date().toLocaleDateString('eu-ES')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing || data.arduradunak.length === 0}
                                className={`w-full h-12 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center font-bold text-sm ${data.arduradunak.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5a4da1] hover:bg-[#4a3c91]'}`}
                            >
                                {processing ? 'Sortzen...' : 'Sortu Ataza'}
                            </button>

                            <div className="text-center">
                                <a
                                    href={`/pisua/${pisua.id}/kudeatu/atazak`}
                                    className="text-sm text-[#5a4da1] hover:text-[#4a3c91] hover:underline"
                                >
                                    ← Atzera ataza zerrendara
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <div className="h-10 w-full bg-transparent"></div>
        </div>
    );
}