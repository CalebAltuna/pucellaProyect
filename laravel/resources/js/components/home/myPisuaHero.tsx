import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, UserPlus, Trash2, Search, Loader2, Wallet, CheckSquare, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function MyPisuaHero({ pisua, items = [] }: any) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [search, setSearch] = useState('');
    const [foundUsers, setFoundUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    if (!pisua) {
        return (
            <div className="py-12 text-center">
                <Loader2 className="animate-spin mx-auto text-purple-600 mb-2" size={24} />
            </div>
        );
    }

    const safeItems = Array.isArray(items) ? items : [];

    const stats = useMemo(() => {
        const gastos = safeItems.filter((i: any) => i.tipo === 'gastu');
        const atazak = safeItems.filter((i: any) => i.tipo !== 'gastu');
        const totalGastos = gastos.reduce((acc: number, curr: any) => acc + (parseFloat(curr.extra) || 0), 0);

        return { totalGastos, countAtazak: atazak.length };
    }, [safeItems]);

    useEffect(() => {
        if (search.length >= 3) {
            setLoading(true);
            axios.get(`/api/users/search?query=${search}`)
                .then(res => setFoundUsers(res.data))
                .catch(() => setFoundUsers([]))
                .finally(() => setLoading(false));
        } else {
            setFoundUsers([]);
        }
    }, [search]);

    const inviteUser = (userId: number) => {
        router.post(route('pisua.addMember', pisua.id), { user_id: userId }, {
            onSuccess: () => { setShowInvite(false); setSearch(''); }
        });
    };

    // Badge funtzioa "Jakinarazpenak" osagaiko estilo berberekin
    const getUrgenciaBadge = (level: number) => {
        switch (level) {
            case 0: return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">BERANDU!</span>;
            case 1: return <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">PRESAKOA</span>;
            case 2: return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">LAISTER</span>;
            default: return null;
        }
    };

    return (
        <div className="py-8 font-sans">
            <div className="max-w-4xl mx-auto px-4">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-purple-800">
                                {pisua.izena}
                            </h1>
                            <span className="text-xs font-bold text-purple-400 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                                #{pisua.kodigoa}
                            </span>
                            {/* Menú de opciones */}
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-1 text-purple-300 hover:text-purple-600 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-purple-100 z-50 overflow-hidden"
                                        >
                                            <button onClick={() => { setShowInvite(!showInvite); setMenuOpen(false) }} className="flex items-center gap-2 w-full p-3 hover:bg-purple-50 text-sm font-bold text-purple-900 transition">
                                                <UserPlus size={16} /> Kideak gonbidatu
                                            </button>
                                            <button onClick={() => confirm('Ziur zaude?') && router.delete(route('pisua.destroy', pisua.id))} className="flex items-center gap-2 w-full p-3 hover:bg-red-50 text-sm font-bold text-red-600 transition border-t border-gray-50">
                                                <Trash2 size={16} /> Ezabatu pisua
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <p className="text-purple-600/60 text-sm mt-1">Zure etxeko kudeaketa bateratua</p>
                    </div>

                    {/* STATS (Estilo "Jakinarazpenak") */}
                    <div className="flex gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-center min-w-[80px]">
                            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Gastuak</p>
                            <p className="text-lg font-black text-purple-600">{stats.totalGastos}€</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-center min-w-[80px]">
                            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Atazak</p>
                            <p className="text-lg font-black text-purple-600">{stats.countAtazak}</p>
                        </div>
                    </div>
                </div>

                {/* --- INVITAR (Buscador) --- */}
                <AnimatePresence>
                    {showInvite && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-8">
                            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" size={18} />
                                    <input
                                        value={search} onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Bilatu kidea izenagatik..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
                                    />
                                </div>
                                {loading && <Loader2 className="animate-spin mx-auto text-purple-600 mt-4" size={20} />}
                                {foundUsers.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {foundUsers.map((u: any) => (
                                            <div key={u.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                                                <span className="font-bold text-purple-900 text-sm">{u.name}</span>
                                                <button onClick={() => inviteUser(u.id)} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 transition">Gehitu</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- LISTA DE ITEMS (Estilo "Jakinarazpenak") --- */}
                <div className="space-y-4">
                    {safeItems.length > 0 ? safeItems.map((item: any) => {
                        const isGasto = item.tipo === 'gastu';
                        return (
                            <div
                                key={`${item.tipo}-${item.id}`}
                                className="relative rounded-xl p-5 shadow-sm border bg-purple-50 border-purple-100 group hover:shadow-md transition-all"
                            >
                                <div className="flex gap-4 items-start">
                                    <div className="pt-1">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${isGasto ? 'bg-red-400' : 'bg-purple-400'}`} />
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-bold text-purple-900 leading-tight">
                                                {item.izenburua}
                                            </h3>
                                            {isGasto && (
                                                <span className="text-xl font-black text-red-600 shrink-0">
                                                    -{item.extra}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm border-t border-purple-200/50 pt-2 mt-1">
                                            <div className="text-purple-800 italic">
                                                {isGasto ? (
                                                    <>Nork erosia: <span className="font-semibold">{item.eroslea || 'Ezezaguna'}</span></>
                                                ) : (
                                                    <>Muga: <span className="font-semibold">{new Date(item.fecha).toLocaleDateString()}</span></> // Zure datua `fecha` da
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-purple-400 font-medium">
                                                    {new Date(item.fecha).toLocaleDateString()} {/* Formatoa mantendu */}
                                                </span>
                                                {!isGasto && getUrgenciaBadge(item.urgencia)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="bg-white rounded-xl p-16 text-center border-2 border-dashed border-purple-100">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckSquare size={24} className="text-purple-300" />
                            </div>
                            <p className="text-purple-300 font-medium italic">Ez daukazu ezer egiteko une honetan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
