import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/components/app-header';
import { Wallet, Plus, Trash2, Euro } from 'lucide-react';

interface Gastua {
    id: number;
    izena: string;
    kantitatea: number; // El importe del gasto
    egoera: 'ordaindua' | 'ordaintzeko'; // Pagado o pendiente
    user?: { name: string };
    created_at: string;
}

interface Props {
    gastuak: Gastua[];
}

export default function MyExpenses({ gastuak = [] }: Props) {
    const { props } = usePage<PageProps>();
    const { pisua } = props;

    const [localExpenses, setLocalExpenses] = useState<Gastua[]>(gastuak);

    useEffect(() => {
        setLocalExpenses(gastuak);
    }, [gastuak]);

    const baseUrl = `/pisua/${pisua?.id}/kudeatu/gastuak`;

    const toggleExpenseStatus = (gasto: Gastua) => {
        const newEgoera = gasto.egoera === 'ordaindua' ? 'ordaintzeko' : 'ordaindua';

        router.put(`${baseUrl}/${gasto.id}`, {
            egoera: newEgoera
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalExpenses(localExpenses.map(g =>
                    g.id === gasto.id ? { ...g, egoera: newEgoera } : g
                ));
            }
        });
    };

    const deleteExpense = (id: number) => {
        if (confirm('Ziur zaude gastu hau ezabatu nahi duzula?')) {
            router.delete(`${baseUrl}/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Nire Pisua', href: `/pisua/${pisua?.id}/kudeatu` },
            { title: 'Gastuak', href: baseUrl }
        ]}>
            <Head title="Gastuak" />

            <div className="py-8 font-sans">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header de la sección */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Wallet className="text-[#534595] w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#534595]">
                                {pisua ? `Gastuak: ${pisua.izena}` : 'Gastu Zerrenda'}
                            </h1>
                        </div>
                        <Link
                            href={`${baseUrl}/create`}
                            className="bg-[#5a4da1] hover:bg-[#4c418a] text-white px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 font-medium"
                        >
                            <Plus size={20} />
                            Gastu berria
                        </Link>
                    </div>

                    {/* Listado de Gastos */}
                    <div className="grid gap-4">
                        {localExpenses.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-purple-50">
                                <p className="text-purple-300 font-medium">Ez dago gasturik erregistratuta.</p>
                            </div>
                        ) : (
                            localExpenses.map((gasto) => {
                                const isPaid = gasto.egoera === 'ordaindua';
                                return (
                                    <div
                                        key={gasto.id}
                                        className="bg-white rounded-2xl p-5 border border-purple-50 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-5">
                                            {/* Indicador de precio/icono */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                <Euro size={24} />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-[#3b326b]">{gasto.izena}</h3>
                                                <p className="text-[#534595]/60 text-sm">
                                                    Nork: {gasto.user?.name || 'Ezezaguna'} • {gasto.created_at}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            {/* Cantidad y Estado */}
                                            <div className="text-right">
                                                <p className="text-xl font-black text-[#534595]">{gasto.kantitatea}€</p>
                                                <button
                                                    onClick={() => toggleExpenseStatus(gasto)}
                                                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-colors ${
                                                        isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                    }`}
                                                >
                                                    {isPaid ? 'Ordaindua' : 'Ordaintzeko'}
                                                </button>
                                            </div>

                                            {/* Acciones */}
                                            <button
                                                onClick={() => deleteExpense(gasto.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
