import React, { useState, useMemo } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { Plus, Trash2, Euro, User as UserIcon, Pencil, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface User {
    id: number;
    name: string;
    izena?: string;
}

interface Ordaintzailea extends User {
    pivot: {
        kopurua: number;
        egoera: 'ordaindua' | 'ordaintzeko';
    };
}

interface Gastua {
    id: number;
    izena: string;
    totala: number;
    egoera: 'ordaindua' | 'ordaintzeko';
    created_at: string;
    user_erosle_id: number;
    erosle?: User;
    ordaintzaileak: Ordaintzailea[];
    can: {
        edit: boolean;
        delete: boolean;
    };
}

interface ExtendedPageProps {
    pisua: {
        id: number;
        izena: string;
        user_id: number;
    };
    gastuak: Gastua[];
    auth: {
        user: User;
    };
}

export default function MyGastuak() {
    const { pisua, gastuak, auth } = usePage<ExtendedPageProps>().props;
    const currentUserId = auth.user.id;
    const baseUrl = `/pisua/${pisua?.id}/kudeatu/gastuak`;

    const [editingId, setEditingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data, setData, put, processing, reset, clearErrors } = useForm({
        izena: '',
        totala: 0
    });

    const sortedGastuak = useMemo(() => {
        return [...gastuak].sort((a, b) => {
            if (a.egoera === 'ordaintzeko' && b.egoera === 'ordaindua') return -1;
            if (a.egoera === 'ordaindua' && b.egoera === 'ordaintzeko') return 1;
            return 0;
        });
    }, [gastuak]);

    const startEdit = (gasto: Gastua) => {
        clearErrors();
        setEditingId(gasto.id);
        setData({ izena: gasto.izena, totala: gasto.totala });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const saveEdit = (e: React.FormEvent, gastoId: number) => {
        e.preventDefault();
        put(`${baseUrl}/${gastoId}`, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null)
        });
    };

    const togglePayment = (gastoId: number, userId: number) => {
        router.post(`${baseUrl}/${gastoId}/toggle/${userId}`, {}, {
            preserveScroll: true,
            onError: (err) => console.error("Error:", err)
        });
    };

    const deleteExpense = (gastoId: number) => {
        if (confirm('Ziur zaude gastu hau ezabatu nahi duzula?')) {
            router.delete(`${baseUrl}/${gastoId}`, { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Head title="Gastuak" />
            <AppHeader />

            <main className="flex-grow py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-purple-800">{pisua ? `Gastuak: ${pisua.izena}` : 'Gastuak'}</h1>
                        <Link href={`${baseUrl}/create`} className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2">
                            <Plus size={18} /> Gastu berria
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {sortedGastuak.map((gasto) => {
                            const isEditing = editingId === gasto.id;
                            const isGlobalPaid = gasto.egoera === 'ordaindua';
                            const hanPagado = gasto.ordaintzaileak.filter(u => u.pivot.egoera === 'ordaindua').length;
                            const totalDeudores = gasto.ordaintzaileak.length;
                            const myInfo = gasto.ordaintzaileak.find(u => u.id === currentUserId);

                            const canManageOthers = currentUserId === pisua.user_id || currentUserId === gasto.user_erosle_id;
                            const isExpanded = expandedId === gasto.id;

                            return (
                                <div key={gasto.id} className={`relative rounded-xl p-5 shadow-sm border transition-all ${isGlobalPaid ? 'bg-white border-gray-200 opacity-90' : 'bg-purple-50 border-purple-100'}`}>
                                    {isEditing ? (
                                        <form onSubmit={(e) => saveEdit(e, gasto.id)} className="space-y-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <input
                                                    type="text"
                                                    value={data.izena}
                                                    onChange={e => setData('izena', e.target.value)}
                                                    className="w-full border-purple-200 rounded p-2"
                                                    autoFocus
                                                />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.totala}
                                                    onChange={e => setData('totala', parseFloat(e.target.value))}
                                                    className="w-32 border-purple-200 rounded p-2"
                                                />
                                                <button type="submit" disabled={processing} className="bg-purple-600 text-white p-2 rounded">
                                                    <Check size={20} />
                                                </button>
                                                <button type="button" onClick={cancelEdit} className="bg-gray-200 text-gray-600 p-2 rounded">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex gap-4 items-start mb-4">
                                                <div className={`p-2 rounded-lg ${isGlobalPaid ? 'bg-green-100 text-green-600' : 'bg-purple-200 text-purple-700'}`}>
                                                    <Euro size={20} />
                                                </div>
                                                <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : gasto.id)}>
                                                    <h3 className={`text-lg font-bold ${isGlobalPaid ? 'text-gray-500 line-through' : 'text-purple-900'}`}>{gasto.izena}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-purple-700/60 font-medium">
                                                        <UserIcon size={14} />
                                                        <span>{gasto.erosle?.izena || gasto.erosle?.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(gasto.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xl font-black text-[#6B4E9B] block">{gasto.totala}€</span>
                                                    <button
                                                        onClick={() => setExpandedId(isExpanded ? null : gasto.id)}
                                                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 ml-auto ${isGlobalPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                                                    >
                                                        {isGlobalPaid ? 'Ordaindua' : `${hanPagado}/${totalDeudores} kide`}
                                                        {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="w-full bg-purple-200/30 h-1 rounded-full mb-4 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-700 ${isGlobalPaid ? 'bg-green-500' : 'bg-[#6B4E9B]'}`}
                                                    style={{ width: `${(hanPagado / totalDeudores) * 100}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between items-center border-t border-purple-200/50 pt-3">
                                                <div>
                                                    {myInfo && (
                                                        <button
                                                            onClick={() => togglePayment(gasto.id, currentUserId)}
                                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${myInfo.pivot.egoera === 'ordaindua'
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : 'bg-[#6B4E9B] text-white hover:bg-purple-800'
                                                                }`}
                                                        >
                                                            {myInfo.pivot.egoera === 'ordaindua' ? 'Ordaindua ✓' : 'Ordaindu'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 text-gray-400">
                                                    {gasto.can.edit && (
                                                        <button onClick={() => startEdit(gasto)} className="hover:text-purple-600">
                                                            <Pencil size={16} />
                                                        </button>
                                                    )}
                                                    {gasto.can.delete && (
                                                        <button onClick={() => deleteExpense(gasto.id)} className="hover:text-red-500">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-4 pt-3 border-t border-dashed border-purple-200 bg-purple-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
                                                    <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Partaideen egoera</h4>
                                                    <div className="space-y-2">
                                                        {gasto.ordaintzaileak.map(partaide => (
                                                            <div key={partaide.id} className="flex justify-between items-center text-sm">
                                                                <span className="text-gray-700">{partaide.izena || partaide.name}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-gray-500 text-xs">{partaide.pivot.kopurua}€</span>
                                                                    <button
                                                                        onClick={() => (canManageOthers || partaide.id === currentUserId) && togglePayment(gasto.id, partaide.id)}
                                                                        disabled={!canManageOthers && partaide.id !== currentUserId}
                                                                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${partaide.pivot.egoera === 'ordaindua'
                                                                            ? 'bg-green-500 border-green-600 text-white'
                                                                            : 'bg-white border-gray-300 text-transparent hover:border-purple-400'
                                                                            } ${(canManageOthers || partaide.id === currentUserId) ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
                                                                    >
                                                                        <Check size={14} strokeWidth={3} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
