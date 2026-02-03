import React, { FormEvent } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Pisua {
    id: number;
    izena: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    pisua: Pisua;
    usuarios: User[];
}

export default function CreateTask() {
    const { props } = usePage<any>();
    const { pisua, usuarios = [] } = props;

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        data: today,
        arduradunak: [] as number[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (data.arduradunak.length === 0) {
            alert("Gutxienez arduradun bat hautatu behar duzu.");
            return;
        }
        post(`/pisua/${pisua.id}/atazak`);
    };

    const handleCheckboxChange = (userId: number) => {
        const currentIds = [...data.arduradunak];
        if (currentIds.includes(userId)) {
            setData('arduradunak', currentIds.filter(id => id !== userId));
        } else {
            setData('arduradunak', [...currentIds, userId]);
        }
    };

    if (!pisua) return null;

    return (
        <AppLayout>
            <Head title="Ataza Berria" />
            
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-[2rem] border border-[#5a4da1]/10 shadow-lg p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#5a4da1] mb-2">
                            Ataza Berria
                        </h1>
                        <p className="text-[#5a4da1]/60 text-sm italic font-medium">
                            {pisua.izena} pisuaren zeregina
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* IZENA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-bold text-sm ml-1">
                                    Zer egin behar da? *
                                </label>
                                <input
                                    type="text"
                                    value={data.izena}
                                    onChange={e => setData('izena', e.target.value)}
                                    placeholder="Adib: Zaborra atera"
                                    className="w-full h-14 px-5 rounded-2xl border border-[#5a4da1]/10 bg-white focus:outline-none focus:border-[#5a4da1]/40 focus:ring-4 focus:ring-[#5a4da1]/5 transition-all text-sm"
                                    required
                                />
                                {errors.izena && <div className="text-red-500 text-xs mt-1 ml-1">{errors.izena}</div>}
                            </div>

                            {/* DATA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-bold text-sm ml-1">
                                    Noiz egin behar da? *
                                </label>
                                <input
                                    type="date"
                                    value={data.data}
                                    onChange={e => setData('data', e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-[#5a4da1]/10 bg-white focus:outline-none focus:border-[#5a4da1]/40 focus:ring-4 focus:ring-[#5a4da1]/5 transition-all text-sm"
                                    required
                                    min={today}
                                />
                                {errors.data && <div className="text-red-500 text-xs mt-1 ml-1">{errors.data}</div>}
                            </div>

                            {/* ARDURADUNAK */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-bold text-sm ml-1">
                                    Nork egingo du? *
                                </label>
                                <div className="max-h-48 overflow-y-auto p-4 bg-white rounded-2xl border border-[#5a4da1]/10 shadow-sm divide-y divide-gray-50">
                                    {usuarios.map((user) => (
                                        <label key={user.id} className="flex items-center space-x-4 cursor-pointer py-3">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 rounded border-gray-200 text-[#5a4da1] focus:ring-[#5a4da1] cursor-pointer"
                                                checked={data.arduradunak.includes(user.id)}
                                                onChange={() => handleCheckboxChange(user.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold ${data.arduradunak.includes(user.id) ? 'text-[#5a4da1]' : 'text-gray-600'}`}>
                                                    {user.name}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.arduradunak && <div className="text-red-500 text-xs mt-1 ml-1">{errors.arduradunak}</div>}
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={processing || data.arduradunak.length === 0}
                                className={`w-full h-14 text-white rounded-2xl shadow-lg transition-all font-bold active:scale-[0.98] ${
                                    data.arduradunak.length === 0 || processing 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#5a4da1] hover:bg-[#4a3c91]'
                                }`}
                            >
                                {processing ? 'Gordetzen...' : 'Ataza Sortu'}
                            </button>

                            <div className="text-center">
                                <Link
                                    href={`/pisua/${pisua.id}/atazak`}
                                    className="text-sm text-[#5a4da1]/70 hover:underline font-bold"
                                >
                                    ← Atzera bueltatu
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}