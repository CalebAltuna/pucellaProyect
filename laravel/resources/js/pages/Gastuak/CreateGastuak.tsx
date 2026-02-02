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
    Users, 
    CheckCircle2, 
    Circle
} from 'lucide-react';

interface Kidea {
    id: number;
    name: string; 
}

interface Props {
    pisua: { id: number; izena: string };
    kideak: Kidea[];
}

export default function CreateGastuak({ pisua, kideak = [] }: Props) {
    // 1. Funcionalidad de Formulario: Mantenemos oharrak y el array de partaideak
    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        totala: '',
        oharrak: '',
        partaideak: kideak?.map(k => k.id) || [], 
    });

    // 2. Funcionalidad de Envío: Dirección correcta según tu controlador
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/pisua/${pisua.id}/kudeatu/gastuak`);
    };

    // 3. Funcionalidad de Selección: Toggle de miembros con validación de mínimo 1
    const togglePartaide = (id: number) => {
        const current = [...data.partaideak];
        if (current.includes(id)) {
            if (current.length > 1) {
                setData('partaideak', current.filter(itemId => itemId !== id));
            }
        } else {
            setData('partaideak', [...current, id]);
        }
    };

    // 4. Funcionalidad de Cálculo: Cuota en tiempo real
    const cuotaIndividual = data.totala && data.partaideak.length > 0 
        ? (parseFloat(data.totala) / data.partaideak.length).toFixed(2) 
        : "0.00";

    return (
        <div className="min-h-screen bg-white font-sans">
            <Head title="Gastu Berria" />
            <AppHeader />

            <main className="max-w-2xl mx-auto py-12 px-4">
                <Link 
                    href={`/pisua/${pisua?.id}/kudeatu/gastuak`}
                    className="flex items-center gap-2 text-[#5a4da1]/60 font-medium mb-8 hover:text-[#5a4da1] transition-colors w-fit"
                >
                    <ArrowLeft size={18} />
                    Atzera bueltatu
                </Link>

                <div className="w-full bg-[#f4f2ff] rounded-2xl border border-[#5a4da1]/10 shadow-lg p-8">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-[#5a4da1] mb-2">
                            Gastu berria gehitu
                        </h1>
                        <p className="text-[#5a4da1]/70 text-sm">
                            Bete formularioa gastua kideen artean banatzeko
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <LabelCustom>Zer erosi duzu?</LabelCustom>
                                <div className="relative">
                                    <Type className="absolute left-3 top-3.5 text-[#5a4da1]/40" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={data.izena}
                                        onChange={e => setData('izena', e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-white border border-[#5a4da1]/20 rounded-lg focus:border-[#5a4da1] focus:ring-1 focus:ring-[#5a4da1]/20 outline-none transition-all"
                                        placeholder="Adib: Garbiketa"
                                    />
                                </div>
                                {errors.izena && <p className="text-red-500 text-xs mt-1 font-medium">{errors.izena}</p>}
                            </div>

                            <div className="space-y-2">
                                <LabelCustom>Zenbatekoa (€)</LabelCustom>
                                <div className="relative">
                                    <Euro className="absolute left-3 top-3.5 text-[#5a4da1]/40" size={18} />
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.totala}
                                        onChange={e => setData('totala', e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 bg-white border border-[#5a4da1]/20 rounded-lg focus:border-[#5a4da1] focus:ring-1 focus:ring-[#5a4da1]/20 outline-none transition-all font-bold text-[#5a4da1]"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.totala && <p className="text-red-500 text-xs mt-1 font-medium">{errors.totala}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <LabelCustom>Oharrak (Aukerakoa)</LabelCustom>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3 text-[#5a4da1]/40" size={18} />
                                <textarea
                                    value={data.oharrak}
                                    onChange={e => setData('oharrak', e.target.value)}
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#5a4da1]/20 rounded-lg focus:border-[#5a4da1] focus:ring-1 focus:ring-[#5a4da1]/20 outline-none transition-all"
                                    placeholder="Gehitu xehetasunak..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <LabelCustom className="flex items-center gap-2">
                                <Users size={16} /> Noren artean banatu?
                            </LabelCustom>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {kideak.map((kide) => (
                                    <button
                                        key={kide.id}
                                        type="button" // IMPORTANTE: Evita que el botón haga submit
                                        onClick={() => togglePartaide(kide.id)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                            data.partaideak.includes(kide.id)
                                            ? 'bg-[#5a4da1] border-[#5a4da1] text-white shadow-md translate-y-[-2px]'
                                            : 'bg-white border-[#5a4da1]/10 text-[#5a4da1]/60 hover:border-[#5a4da1]/30'
                                        }`}
                                    >
                                        <span className="font-semibold">{kide.name}</span>
                                        {data.partaideak.includes(kide.id) 
                                            ? <CheckCircle2 size={20} className="text-white" /> 
                                            : <Circle size={20} className="opacity-20" />
                                        }
                                    </button>
                                ))}
                            </div>
                            {errors.partaideak && <p className="text-red-500 text-xs font-medium">{errors.partaideak}</p>}
                        </div>

                        <div className="bg-[#5a4da1]/5 p-4 rounded-xl border border-[#5a4da1]/10 flex justify-between items-center mt-2 shadow-sm">
                            <span className="text-sm font-medium text-[#5a4da1]/70">Bakoitzak ordainduko duena:</span>
                            <span className="text-xl font-black text-[#5a4da1]">{cuotaIndividual}€</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-[#5a4da1] hover:bg-[#4a3c91] text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50 active:scale-[0.98]"
                        >
                            {processing ? <Spinner className="h-5 w-5" /> : (
                                <>
                                    <Save size={20} />
                                    Gastua erregistratu
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

// Sub-componente simple para mantener el estilo del Label de Login
function LabelCustom({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <label className={`text-[#5a4da1] font-medium text-sm ml-1 ${className}`}>
            {children}
        </label>
    );
}