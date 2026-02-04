import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { Plus, Trash2, Euro, User as UserIcon, Pencil, Check, X, Loader2 } from 'lucide-react';

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
    pisua: { id: number; izena: string; user_id: number };
    gastuak: Gastua[];
    auth: { user: User };
}

export default function MyGastuak() {
    const { pisua, gastuak, auth } = usePage<ExtendedPageProps>().props;
    const currentUserId = auth.user.id;
    const baseUrl = `/pisua/${pisua?.id}/kudeatu/gastuak`;

    const [editingId, setEditingId] = useState<number | null>(null);
    const [toggling, setToggling] = useState<number | null>(null); // Nuevo estado para controlar loading

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        izena: '',
        totala: 0,
    });

    const startEdit = (gasto: Gastua) => {
        clearErrors();
        setEditingId(gasto.id);
        setData({
            izena: gasto.izena,
            totala: gasto.totala
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const saveEdit = (e: React.FormEvent, gastoId: number) => {
        e.preventDefault();
        put(`${baseUrl}/${gastoId}`, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const togglePayment = (gastoId: number, userId: number) => {
        setToggling(gastoId); // Establecer qué gasto está cargando
        
        router.post(`/pisua/${pisua.id}/kudeatu/gastuak/${gastoId}/toggle/${userId}`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Pago actualizado correctamente");
                setToggling(null); // Limpiar estado de loading
            },
            onError: (errors) => {
                console.error("Error al actualizar:", errors);
                setToggling(null); // Limpiar estado de loading incluso en error
            },
            onFinish: () => {
                setToggling(null); // Asegurar limpieza
            }
        });
    };

    const deleteExpense = (gastoId: number) => {
        if (confirm('Ziur zaude gastu hau ezabatu nahi duzula?')) {
            router.delete(`${baseUrl}/${gastoId}`, {
                preserveScroll: true
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Head title="Gastuak" />
            <AppHeader />

            <main className="flex-grow py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-purple-800">
                            {pisua ? `Gastuak: ${pisua.izena}` : 'Gastuak'}
                        </h1>
                        <Link
                            href={`${baseUrl}/create`}
                            className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2"
                        >
                            <Plus size={18} /> Gastu berria
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {gastuak.map((gasto) => {
                            const isEditing = editingId === gasto.id;
                            const isGlobalPaid = gasto.egoera === 'ordaindua';
                            const hanPagado = gasto.ordaintzaileak.filter(u => u.pivot.egoera === 'ordaindua').length;
                            const totalDeudores = gasto.ordaintzaileak.length;
                            const myInfo = gasto.ordaintzaileak.find(u => u.id === currentUserId);
                            const isToggling = toggling === gasto.id; // Verificar si este gasto está cargando

                            return (
                                <div
                                    key={gasto.id}
                                    className={`relative rounded-xl p-5 shadow-sm border transition-all ${isGlobalPaid ? 'bg-white border-gray-200 opacity-80' : 'bg-purple-50 border-purple-100 hover:shadow-md'}`}
                                >
                                    {isEditing ? (
                                        <form onSubmit={(e) => saveEdit(e, gasto.id)} className="space-y-4">
                                            {/* ... resto del formulario de edición ... */}
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex gap-4 items-start mb-4">
                                                {/* ... resto del contenido del gasto ... */}
                                            </div>

                                            <div className="w-full bg-purple-200/30 h-1 rounded-full mb-4 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-700 ${isGlobalPaid ? 'bg-green-500' : 'bg-[#6B4E9B]'}`}
                                                    style={{ width: `${(hanPagado / totalDeudores) * 100}%` }}
                                                />
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-purple-200/50 pt-4 mt-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {myInfo && (
                                                        <button
                                                            onClick={() => !isToggling && togglePayment(gasto.id, currentUserId)}
                                                            disabled={isToggling}
                                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${myInfo.pivot.egoera === 'ordaindua'
                                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                                : 'bg-[#6B4E9B] text-white hover:bg-purple-800'
                                                                } ${isToggling ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                        >
                                                            {isToggling ? (
                                                                <>
                                                                    <Loader2 className="animate-spin" size={14} />
                                                                    Kargatzen...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {myInfo.pivot.egoera === 'ordaindua' 
                                                                        ? 'Nire zatia ordaindua ✓' 
                                                                        : 'Nire zatia ordaindu dut'}
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 self-end sm:self-center">
                                                    {gasto.can.edit && (
                                                        <button onClick={() => startEdit(gasto)} className="p-2 text-purple-400 hover:text-purple-700">
                                                            <Pencil size={18} />
                                                        </button>
                                                    )}
                                                    {gasto.can.delete && (
                                                        <button onClick={() => deleteExpense(gasto.id)} className="p-2 text-purple-200 hover:text-red-500">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
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