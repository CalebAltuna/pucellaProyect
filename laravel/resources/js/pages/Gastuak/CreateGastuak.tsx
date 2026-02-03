import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { Spinner } from '@/components/ui/spinner';
import {
    ArrowLeft,
    Save,
    Euro,
    Type,
    AlignLeft,
    Users
} from 'lucide-react';

// Definición estricta del tipo Usuario
interface User {
    id: number;
    name: string;
    email: string;
}

// Definición estricta de las Props
interface Props {
    pisua: { id: number; izena: string };
    usuarios: User[];
}

function LabelCustom({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <label className={`block text-[#5a4da1] font-medium text-sm ml-1 ${className}`}>
            {children}
        </label>
    );
}

export default function CreateGastuak({ pisua, usuarios = [] }: Props) {
    // FORMULARIO: Inicializamos 'partaideak' con todos los usuarios si existen
    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        totala: '',
        oharrak: '',
        partaideak: usuarios?.map(u => u.id) || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación Frontend antes de enviar
        if (data.partaideak.length === 0) {
            alert("Gutxienez partaide bat hautatu behar duzu.");
            return;
        }
        if (!data.izena || !data.totala) {
             alert("Mesedez, bete derrigorrezko eremuak.");
             return;
        }

        // Enviamos a la ruta del backend
        post(`/pisua/${pisua.id}/kudeatu/gastuak`);
    };

    // Lógica para marcar/desmarcar checkboxes
    const handleCheckboxChange = (userId: number) => {
        const currentIds = [...data.partaideak];
        if (currentIds.includes(userId)) {
            // Impedimos desmarcar si solo queda uno (opcional, pero recomendable)
            if (currentIds.length > 1) {
                setData('partaideak', currentIds.filter(id => id !== userId));
            }
        } else {
            setData('partaideak', [...currentIds, userId]);
        }
    };

    // Cálculo dinámico de la cuota visual
    const cuotaIndividual = React.useMemo(() => {
        const montoLimpio = data.totala.toString().replace(',', '.');
        const monto = parseFloat(montoLimpio);
        if (isNaN(monto) || data.partaideak.length === 0) return "0.00";
        return (monto / data.partaideak.length).toFixed(2);
    }, [data.totala, data.partaideak]);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Head title="Gastu Berria" />
            <AppHeader />

            <main className="max-w-2xl mx-auto py-12 px-4">
                <Link
                    href={`/pisua/${pisua?.id}/kudeatu/gastuak`}
                    className="flex items-center gap-2 text-[#5a4da1]/60 font-medium mb-8 hover:text-[#5a4da1] transition-all w-fit group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Atzera bueltatu
                </Link>

                <div className="w-full bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex p-3 bg-white rounded-full mb-4 shadow-sm border border-purple-50">
                            <Euro className="text-[#5a4da1]" size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">Gastu berria gehitu</h1>
                        <p className="text-[#5a4da1]/70 text-sm italic">{pisua?.izena || 'PisuKide'} pisuaren gastu komuna</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* INPUTS: Concepto y Cantidad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <LabelCustom>Zer erosi duzu?</LabelCustom>
                                <div className="relative group">
                                    <Type className="absolute left-3 top-3.5 text-[#5a4da1]/40 group-focus-within:text-[#5a4da1] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={data.izena}
                                        onChange={e => setData('izena', e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-white border border-[#5a4da1]/20 rounded-lg focus:border-[#5a4da1] outline-none transition-all"
                                        placeholder="Adib: Garbiketa"
                                    />
                                </div>
                                {errors.izena && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.izena}</p>}
                            </div>

                            <div className="space-y-2">
                                <LabelCustom>Zenbatekoa (€)</LabelCustom>
                                <div className="relative group">
                                    <Euro className="absolute left-3 top-3.5 text-[#5a4da1]/40 group-focus-within:text-[#5a4da1] transition-colors" size={18} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        inputMode="decimal"
                                        required
                                        value={data.totala}
                                        onChange={e => setData('totala', e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-white border border-[#5a4da1]/20 rounded-lg focus:border-[#5a4da1] outline-none transition-all font-bold text-[#5a4da1]"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.totala && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.totala}</p>}
                            </div>
                        </div>

                        {/* INPUT: Oharrak */}
                        <div className="space-y-2">
                            <LabelCustom>Oharrak (Aukerakoa)</LabelCustom>
                            <div className="relative group">
                                <AlignLeft className="absolute left-3 top-3 text-[#5a4da1]/40 group-focus-within:text-[#5a4da1] transition-colors" size={18} />
                                <textarea
                                    value={data.oharrak}
                                    onChange={e => setData('oharrak', e.target.value)}
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#5a4da1]/20 rounded-lg focus:border-[#5a4da1] outline-none transition-all"
                                    placeholder="Gehitu xehetasunak..."
                                />
                            </div>
                        </div>

                        {/* SELECTOR DE USUARIOS */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <LabelCustom className="flex items-center gap-2">
                                    <Users size={16} /> Noren artean banatu? *
                                </LabelCustom>
                                <span className="text-xs text-gray-500 font-medium">{data.partaideak.length} hautatuta</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto p-4 bg-white rounded-lg border border-[#5a4da1]/20 shadow-sm">
                                {usuarios && usuarios.length > 0 ? (
                                    usuarios.map((user) => (
                                        <label key={user.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-[#f4f2ff] rounded-lg transition-colors mb-1">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 rounded border-gray-300 text-[#5a4da1] focus:ring-[#5a4da1]"
                                                checked={data.partaideak.includes(user.id)}
                                                onChange={() => handleCheckboxChange(user.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-700">{user.name}</span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-center py-4 text-xs text-gray-400 italic">Ez dago kiderik pisuan</p>
                                )}
                            </div>
                            {errors.partaideak && <p className="text-red-500 text-xs mt-1">{errors.partaideak}</p>}
                        </div>

                        {/* RESUMEN CUOTA */}
                        <div className="bg-white p-5 rounded-xl border-2 border-dashed border-[#5a4da1]/20 flex justify-between items-center mt-2 shadow-inner">
                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase font-black text-[#5a4da1]/50 tracking-widest">Bakoitzak</span>
                                <span className="text-sm font-medium text-[#5a4da1]/80">Ordainduko duena:</span>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-[#5a4da1]">{cuotaIndividual}€</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || data.partaideak.length === 0}
                            className="w-full h-14 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 font-bold disabled:opacity-50 active:scale-[0.97]"
                        >
                            {processing ? <Spinner className="h-6 w-6 border-white/30 border-t-white" /> : (
                                <><Save size={22} /> Gastua erregistratu</>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
