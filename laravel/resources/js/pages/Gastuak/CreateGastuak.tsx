import React, { FormEvent } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    pisua: { id: number; izena: string };
    usuarios: User[];
}

export default function CreateGastuak({ pisua, usuarios = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        totala: '',
        oharrak: '',
        partaideak: usuarios?.map(u => u.id) || [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (data.partaideak.length === 0) {
            alert("Gutxienez partaide bat hautatu behar duzu.");
            return;
        }
        if (!data.izena || !data.totala) {
             alert("Mesedez, bete derrigorrezko eremuak.");
             return;
        }

        // Al hacer el POST, Inertia espera que el controlador responda con una redirección
        post(`/pisua/${pisua.id}/kudeatu/gastuak`, {
            onSuccess: () => {
                // Esto se ejecuta justo antes de cambiar de página si la respuesta es 200/302
                console.log("Gastua zuzen erregistratu da");
            },
            onError: () => {
                console.error("Errorea gastua gordetzean");
            }
        });
    };

    const handleCheckboxChange = (userId: number) => {
        const currentIds = [...data.partaideak];
        if (currentIds.includes(userId)) {
            if (currentIds.length > 1) {
                setData('partaideak', currentIds.filter(id => id !== userId));
            }
        } else {
            setData('partaideak', [...currentIds, userId]);
        }
    };

    const cuotaIndividual = React.useMemo(() => {
        const montoLimpio = data.totala.toString().replace(',', '.');
        const monto = parseFloat(montoLimpio);
        if (isNaN(monto) || data.partaideak.length === 0) return "0.00";
        return (monto / data.partaideak.length).toFixed(2);
    }, [data.totala, data.partaideak]);

    if (!pisua) return null;

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white font-sans">
            <Head title="Gastu Berria" />
            <AppHeader />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">Gastu Berria</h1>
                        <p className="text-[#5a4da1]/70 text-sm italic">{pisua.izena} pisuaren gastu komuna</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm ml-1">Zer erosi duzu? *</label>
                                <input
                                    type="text"
                                    value={data.izena}
                                    onChange={e => setData('izena', e.target.value)}
                                    placeholder="Adib: Garbiketa"
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm"
                                    required
                                />
                                {errors.izena && <div className="text-red-500 text-xs mt-1">{errors.izena}</div>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-medium text-sm ml-1">Zenbatekoa (€) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={data.totala}
                                    onChange={e => setData('totala', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full h-12 px-4 rounded-lg border border-[#5a4da1]/20 bg-white focus:outline-none focus:border-[#5a4da1] focus:ring-[#5a4da1]/20 transition-all text-sm font-bold text-[#5a4da1]"
                                    required
                                />
                                {errors.totala && <div className="text-red-500 text-xs mt-1">{errors.totala}</div>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[#5a4da1] font-medium text-sm ml-1">Noren artean banatu? *</label>
                                    <span className="text-xs text-gray-500">{data.partaideak.length} hautatuta</span>
                                </div>
                                <div className="max-h-40 overflow-y-auto p-4 bg-white rounded-lg border border-[#5a4da1]/20 shadow-inner">
                                    {usuarios.map((user) => (
                                        <label key={user.id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-50 rounded mb-2 last:mb-0">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-[#5a4da1] focus:ring-[#5a4da1]"
                                                checked={data.partaideak.includes(user.id)}
                                                onChange={() => handleCheckboxChange(user.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-[#5a4da1]/10 flex justify-between items-center shadow-sm">
                                <span className="text-xs font-bold text-[#5a4da1]/60 uppercase tracking-wider">Bakoitzak:</span>
                                <span className="text-xl font-black text-[#5a4da1]">{cuotaIndividual}€</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing || data.partaideak.length === 0}
                                className={`w-full h-12 text-white rounded-lg shadow-md transition-all flex items-center justify-center font-bold text-sm ${data.partaideak.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5a4da1] hover:bg-[#4a3c91]'}`}
                            >
                                {processing ? 'Gordetzen...' : 'Gastua Erregistratu'}
                            </button>

                            <div className="text-center">
                                <Link href={`/pisua/${pisua.id}/kudeatu/gastuak`} className="text-sm text-[#5a4da1] hover:underline">
                                    ← Atzera bueltatu
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <div className="h-10 w-full bg-transparent"></div>
        </div>
    );
}
