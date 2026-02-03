import React, { FormEvent } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';

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
    kideak: User[];
}

export default function CreateTask() {
    const { props } = usePage<ExtendedPageProps>();
    const { pisua, kideak = [] } = props;

    const gaur = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        izena: '',
        data: gaur,
        arduradunak: kideak?.map(u => u.id) || [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (data.arduradunak.length === 0) {
            alert("Gutxienez arduradun bat hautatu behar duzu.");
            return;
        }

        // LA CLAVE: La ruta según tu route:list debe llevar /kudeatu/
        post(`/pisua/${pisua.id}/kudeatu/atazak`);
    };

    const handleCheckboxChange = (userId: number) => {
        const egungoIdak = [...data.arduradunak];

        if (egungoIdak.includes(userId)) {
            if (egungoIdak.length > 1) {
                setData('arduradunak', egungoIdak.filter(id => id !== userId));
            }
        } else {
            setData('arduradunak', [...egungoIdak, userId]);
        }
    };

    const dataFormatua = React.useMemo(() => {
        if (!data.data) return "Ez da datarik hautatu";

        const [year, month, day] = data.data.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('eu-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [data.data]);

    if (!pisua) return (
        <AppLayout title="Ataza Berria">
            <div className="p-10 text-center text-[#5a4da1]">Datuak kargatzen...</div>
        </AppLayout>
    );

    return (
        <AppLayout 
            title="Ataza Berria"
            breadcrumbs={[
                { title: 'Nire Pisua', href: `/pisua/${pisua.id}/kudeatu` },
                { title: 'Atazak', href: `/pisua/${pisua.id}/kudeatu/atazak` },
                { title: 'Berria', href: '#' }
            ]}
        >
            <Head title="Ataza Berria" />
            
            <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4">
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
                                    placeholder="Adib: Sukaldea garbitu"
                                    className="w-full h-14 px-5 rounded-2xl border border-[#5a4da1]/10 bg-white focus:outline-none focus:border-[#5a4da1]/40 focus:ring-4 focus:ring-[#5a4da1]/5 transition-all text-sm placeholder:text-gray-300"
                                    required
                                />
                                {errors.izena && <div className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.izena}</div>}
                            </div>

                            {/* DATA */}
                            <div className="space-y-2">
                                <label className="block text-[#5a4da1] font-bold text-sm ml-1">
                                    Noizko egin behar da? *
                                </label>
                                <input
                                    type="date"
                                    value={data.data}
                                    onChange={e => setData('data', e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-[#5a4da1]/10 bg-white focus:outline-none focus:border-[#5a4da1]/40 focus:ring-4 focus:ring-[#5a4da1]/5 transition-all text-sm"
                                    required
                                    min={gaur}
                                />
                                {errors.data && <div className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.data}</div>}

                                {data.data && (
                                    <div className="mt-2 p-3 bg-white/50 rounded-xl border border-[#5a4da1]/5">
                                        <p className="text-xs text-[#5a4da1]/60 font-semibold text-center italic">
                                            {dataFormatua}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ARDURADUNAK */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-[#5a4da1] font-bold text-sm">
                                        Nork egingo du? *
                                    </label>
                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                        {data.arduradunak.length} hautatuta
                                    </span>
                                </div>
                                <div className="max-h-48 overflow-y-auto p-4 bg-white rounded-2xl border border-[#5a4da1]/10 shadow-sm divide-y divide-gray-50">
                                    {kideak && kideak.length > 0 ? (
                                        kideak.map((user) => (
                                            <label
                                                key={user.id}
                                                className="flex items-center space-x-4 cursor-pointer py-3 group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded border-gray-200 text-[#5a4da1] focus:ring-[#5a4da1] cursor-pointer transition-all"
                                                    checked={data.arduradunak.includes(user.id)}
                                                    onChange={() => handleCheckboxChange(user.id)}
                                                />
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-bold transition-colors ${data.arduradunak.includes(user.id) ? 'text-[#5a4da1]' : 'text-gray-600'}`}>
                                                        {user.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-gray-400 font-medium italic">
                                                Ez dago kiderik pisuan
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.arduradunak && <div className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.arduradunak}</div>}
                            </div>

                            {/* LABURPENA */}
                            <div className="bg-white p-5 rounded-2xl border border-[#5a4da1]/10 flex justify-between items-center shadow-sm">
                                <span className="text-xs font-bold text-[#5a4da1]/60 uppercase tracking-wider">Hautatutako arduradun kopurua:</span>
                                <span className="text-xl font-black text-[#5a4da1]">{data.arduradunak.length}</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={processing || data.arduradunak.length === 0}
                                className={`w-full h-14 text-white rounded-2xl shadow-lg transition-all flex items-center justify-center font-bold text-base active:scale-[0.98] ${data.arduradunak.length === 0 || processing
                                    ? 'bg-[#94a3b8] cursor-not-allowed shadow-none'
                                    : 'bg-[#5a4da1] hover:bg-[#4a3c91]'
                                    }`}
                            >
                                {processing ? 'Gordetzen...' : 'Ataza Gorde'}
                            </button>

                            <div className="text-center">
                                <Link
                                    href={`/pisua/${pisua.id}/kudeatu/atazak`}
                                    className="text-sm text-[#5a4da1]/70 hover:text-[#5a4da1] hover:underline font-bold transition-colors"
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