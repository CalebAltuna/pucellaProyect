import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppHeader, PageProps } from '@/components/app-header';
import { Wallet, Plus, Trash2, Euro, CheckCircle2, Clock, User as UserIcon } from 'lucide-react';

// --- INTERFACES ACTUALIZADAS ---
interface UserPivot {
    id: number;
    izena: string; // O 'name', asegúrate de que el backend envíe el nombre
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
    user_erosle_id: number; // Necesario para saber si es el creador
    erosle?: { izena: string; name?: string }; // Soporte para 'izena' o 'name'
    ordaintzaileak: UserPivot[];
    created_at: string;
}

interface ExtendedPageProps extends PageProps {
    pisua: {
        id: number;
        izena: string;
        user_id: number; // Necesario para saber si es el coordinador
    };
    gastuak: Gastua[];
    auth: { user: { id: number } };
}

export default function MyGastuak() {
    const { props } = usePage<ExtendedPageProps>();
    const { pisua, gastuak, auth } = props;

    // IDs clave para permisos
    const currentUserId = auth.user.id;
    const coordinatorId = pisua?.user_id;

    const baseUrl = `/pisua/${pisua?.id}/kudeatu/gastuak`;

    // Función genérica para cambiar estado (sirve para uno mismo o para el admin)
    const togglePayment = (gastoId: number, targetUserId: number) => {
        router.post(`/pisua/${pisua.id}/gastuak/${gastoId}/toggle/${targetUserId}`, {}, {
            preserveScroll: true,
        });
    };

    const deleteExpense = (id: number) => {
        if (confirm('Ziur zaude gastu hau ezabatu nahi duzula?')) {
            router.delete(`${baseUrl}/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Head title="Gastuak" />
            <AppHeader />

            <main className="flex-grow py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header de la Sección */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f4f2ff] p-3 rounded-2xl border border-[#5a4da1]/10">
                                <Wallet className="text-[#5a4da1] w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#5a4da1]">
                                    {pisua?.izena} | Gastuak
                                </h1>
                                <p className="text-[#5a4da1]/60 text-sm">Kudeatu ordainketak eta banaketak</p>
                            </div>
                        </div>
                        <Link
                            href={`${baseUrl}/create`}
                            className="bg-[#5a4da1] hover:bg-[#4a3c91] text-white px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 font-bold"
                        >
                            <Plus size={20} />
                            Gastu berria
                        </Link>
                    </div>

                    {/* Lista de Gastos */}
                    <div className="grid gap-6">
                        {gastuak.length === 0 ? (
                            <div className="bg-[#f4f2ff] rounded-3xl p-16 text-center border-2 border-dashed border-[#5a4da1]/20">
                                <p className="text-[#5a4da1]/50 font-medium">Ez dago gasturik erregistratuta.</p>
                            </div>
                        ) : (
                            gastuak.map((gasto) => {
                                const hanPagado = gasto.ordaintzaileak.filter(u => u.pivot.egoera === 'ordaindua').length;
                                const totalDeudores = gasto.ordaintzaileak.length;
                                const isGlobalPaid = gasto.egoera === 'ordaindua';

                                // Información de MI participación en este gasto
                                const myInfo = gasto.ordaintzaileak.find(u => u.id === currentUserId);

                                // PERMISOS
                                const isCreator = currentUserId === gasto.user_erosle_id;
                                const isCoordinator = currentUserId === coordinatorId;
                                const canDelete = isCreator || isCoordinator;

                                return (
                                    <div key={gasto.id} className="bg-white rounded-2xl border border-[#5a4da1]/10 shadow-sm overflow-hidden hover:shadow-md transition-all">
                                        <div className="p-6">
                                            {/* Info Principal */}
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isGlobalPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        <Euro size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-[#3b326b]">{gasto.izena}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                            <UserIcon size={12} />
                                                            {/* Ajuste por si el usuario viene como 'name' o 'izena' */}
                                                            <span>{gasto.erosle?.izena || gasto.erosle?.name || 'Ezezaguna'}</span>
                                                            <span>•</span>
                                                            <span>{new Date(gasto.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-[#5a4da1]">{gasto.totala}€</p>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${isGlobalPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {isGlobalPaid ? 'Dena ordaindua' : `${hanPagado}/${totalDeudores} kide`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Barra de Progreso */}
                                            <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${isGlobalPaid ? 'bg-green-500' : 'bg-[#5a4da1]'}`}
                                                    style={{ width: `${(hanPagado / totalDeudores) * 100}%` }}
                                                />
                                            </div>

                                            {/* Lista de Pagadores (Ahora interactiva para Admin/Creador) */}
                                            <div className="flex flex-wrap gap-2">
                                                {gasto.ordaintzaileak.map(u => {
                                                    // ¿Puedo tocar este botón?
                                                    // Si soy admin, creador, o soy yo mismo.
                                                    const canToggleThisUser = isCoordinator || isCreator || (u.id === currentUserId);

                                                    return (
                                                        <button
                                                            key={u.id}
                                                            onClick={() => canToggleThisUser && togglePayment(gasto.id, u.id)}
                                                            disabled={!canToggleThisUser}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                                                                u.pivot.egoera === 'ordaindua'
                                                                ? 'bg-green-50 border-green-100 text-green-700'
                                                                : 'bg-white border-gray-100 text-gray-400'
                                                            } ${!canToggleThisUser ? 'cursor-default opacity-80' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
                                                        >
                                                            {u.pivot.egoera === 'ordaindua' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                                            {u.izena || u.name}
                                                            <span className="opacity-60">{u.pivot.kopurua}€</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Footer de Acciones */}
                                        <div className="bg-[#f4f2ff]/30 px-6 py-4 flex justify-between items-center border-t border-[#5a4da1]/5">
                                            {/* Botón grande para "Pagar mi parte" (UX Friendly) */}
                                            {myInfo ? (
                                                <button
                                                    onClick={() => togglePayment(gasto.id, currentUserId)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                                                        myInfo.pivot.egoera === 'ordaindua'
                                                        ? 'text-green-700 bg-green-100 hover:bg-green-200 border border-green-200'
                                                        : 'text-white bg-[#5a4da1] hover:bg-[#4a3c91]'
                                                    }`}
                                                >
                                                    {myInfo.pivot.egoera === 'ordaindua' ? 'Ordainduta daukazu' : 'Ordaindu dudala markatu'}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Ez zaude gastu honetan</span>
                                            )}

                                            {/* Botón de Borrar (Solo Admin/Creador) */}
                                            {canDelete && (
                                                <button
                                                    onClick={() => deleteExpense(gasto.id)}
                                                    className="text-[#5a4da1]/40 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-lg"
                                                    title="Ezabatu gastua"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
            {/* Espaciado inferior para mobile */}
            <div className="h-10"></div>
        </div>
    );
}
