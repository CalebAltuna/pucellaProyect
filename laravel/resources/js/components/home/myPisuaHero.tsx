import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck, Receipt, Ghost, MoreVertical,
    UserPlus, Pencil, Trash2, X, Mail, CheckCircle2
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

export interface MyPisuaHeroProps {
    selectedPisua: Pisua | null;
    onEnterPisua?: (p: Pisua) => void;
    onExitPisua?: () => void;
    tareas?: { id: number; titulo: string; fecha: string; urgencia?: number }[];
    gastos?: { id: number; titulo: string; fecha: string; cantidad: string; eroslea?: string }[];
}

export function MyPisuaHero({
    selectedPisua,
    onEnterPisua,
    onExitPisua,
    tareas = [],
    gastos = []
}: MyPisuaHeroProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });
    const allItems = [
        ...gastos.map(g => ({ ...g, type: 'gasto' as const })),
        ...tareas.map(t => ({ ...t, type: 'tarea' as const }))
    ];

    const totalDeuda = gastos.reduce((acc, g) => acc + parseFloat(g.cantidad || '0'), 0);

    useEffect(() => {
        if (selectedPisua) {
            onEnterPisua?.(selectedPisua);
        } else {
            onExitPisua?.();
        }
    }, [selectedPisua, onEnterPisua, onExitPisua]);

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPisua) return;
        post(`/pisua/${selectedPisua.id}/kideak`, {
            onSuccess: () => { reset(); setShowInviteForm(false); },
            preserveScroll: true,
        });
    };

    return (
        <section className="w-full bg-white font-sans">
            <div className="w-full max-w-4xl mx-auto py-8 px-4">

                {/* HEADER Y ESTADÍSTICAS (Estilo Componente B) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-2">
                        <div>
                            <h1 className="text-2xl font-bold text-purple-900">
                                {selectedPisua ? selectedPisua.izena : 'Hasiera'}
                            </h1>
                            <p className="text-purple-600/60 text-sm">Pisuaren egoera orokorra</p>
                        </div>

                        {/* Menú de opciones (Tres puntos) */}
                        {selectedPisua && (
                            <div className="relative ml-2">
                                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-purple-50 rounded-full text-purple-600 transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                                <AnimatePresence>
                                    {menuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute left-0 mt-2 w-48 bg-white border border-purple-100 rounded-xl shadow-xl z-20 overflow-hidden">
                                                <button onClick={() => { setShowInviteForm(true); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50">
                                                    <UserPlus size={16} /> Kideak gehitu
                                                </button>
                                                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                                    <Pencil size={16} /> Izena aldatu
                                                </button>
                                                <div className="border-t border-gray-100" />
                                                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                                                    <Trash2 size={16} /> Pisua ezabatu
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Stats tipo B */}
                    <div className="flex gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-center min-w-[90px]">
                            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Gastuak</p>
                            <p className="text-lg font-black text-purple-600">{totalDeuda}€</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-center min-w-[90px]">
                            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Atazak</p>
                            <p className="text-lg font-black text-purple-600">{tareas.length}</p>
                        </div>
                    </div>
                </div>

                {/* FORMULARIO DE INVITACIÓN */}
                <AnimatePresence>
                    {showInviteForm && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
                            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 relative">
                                <button onClick={() => setShowInviteForm(false)} className="absolute top-3 right-3 text-purple-300 hover:text-purple-600"><X size={18} /></button>
                                <h3 className="text-purple-900 font-bold text-sm mb-3">Kide berria gonbidatu</h3>
                                <form onSubmit={handleAddMember} className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" size={16} />
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Emaila idatzi..." className="w-full pl-9 pr-4 py-2 rounded-lg border-purple-100 focus:ring-purple-500 text-sm" required />
                                    </div>
                                    <button disabled={processing} className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors">Gehitu</button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LISTADO DE ITEMS (Estilo Tarjetas Componente B) */}
                <div className="space-y-3">
                    {allItems.length > 0 ? (
                        allItems.map((item) => (
                            <motion.div
                                key={`${item.type}-${item.id}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative rounded-xl p-4 shadow-sm border bg-purple-50/50 border-purple-100 group hover:shadow-md transition-all flex items-center justify-between"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={`p-2 rounded-lg ${item.type === 'tarea' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                                        {item.type === 'tarea' ? <ClipboardCheck size={20} /> : <Receipt size={20} />}
                                    </div>

                                    <div>
                                        <h3 className="text-md font-bold text-purple-900 leading-tight">
                                            {item.titulo}
                                        </h3>
                                        <div className="text-xs text-purple-500 mt-0.5 flex items-center gap-2">
                                            <span>{item.fecha}</span>
                                            {item.type === 'gasto' && item.eroslea && (
                                                <>• <span className="italic">Nork: {item.eroslea}</span></>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {item.type === 'gasto' && (
                                        <span className="text-lg font-black text-red-600">
                                            {item.cantidad}€
                                        </span>
                                    )}
                                    {item.type === 'tarea' && (
                                        <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">ATAZA</span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl p-16 text-center border-2 border-dashed border-purple-100">
                            <div className="flex justify-center mb-4"><Ghost size={40} className="text-purple-200" /></div>
                            <p className="text-purple-300 font-medium italic">Ez dago ezer egiteko. Ondo bizi zara!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
