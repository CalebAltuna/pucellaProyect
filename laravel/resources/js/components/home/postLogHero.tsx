import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router, useForm } from '@inertiajs/react';
import { Plus, Home, ArrowRight, Trash2, MoreVertical, UserPlus, Pencil, X, Search, User, Loader2 } from 'lucide-react';
import { postLogCopy } from '@/lib/content';
import axios from 'axios'; // Necesitarás axios o usar fetch nativo

interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

// Interfaz para los resultados de usuario
interface UserResult {
    id: number;
    name: string;
    email: string;
}

interface PostLogHeroProps {
    copy: typeof postLogCopy;
    pisuak?: Pisua[];
}

export function Hero({ copy, pisuak = [] }: PostLogHeroProps) {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [invitingPisua, setInvitingPisua] = useState<Pisua | null>(null);

    // Estados para la búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);

    const hasPisos = pisuak.length > 0;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        user_id: null as number | null, // Añadimos user_id por si seleccionamos uno existente
    });

    // Lógica de búsqueda con Debounce (para no saturar el servidor)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2 && !selectedUser) {
                setIsSearching(true);
                try {
                    // ASUME QUE TIENES ESTA RUTA EN LARAVEL: Route::get('/api/users/search', ...)
                    const response = await axios.get(`/api/users/search?query=${searchQuery}`);
                    setSearchResults(response.data);
                } catch (error) {
                    console.error("Error buscando usuarios", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300); // Espera 300ms después de dejar de escribir

        return () => clearTimeout(timer);
    }, [searchQuery, selectedUser]);

    // ... (handleDelete y handleEdit igual que antes) ...
    const handleDelete = (id: number) => {
        if (confirm('Ziur zaude pisu hau ezabatu nahi duzula?')) {
            router.delete(`/pisua/${id}`);
        }
    };

    const handleEdit = (pisua: Pisua) => {
        const nuevoNombre = prompt("Izena aldatu:", pisua.izena);
        if (nuevoNombre && nuevoNombre !== pisua.izena) {
            router.put(`/pisua/${pisua.id}`, { izena: nuevoNombre });
        }
    };
    // ...

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Si no se seleccionó nadie de la lista, usamos lo que haya escrito en el input como email
        const finalEmail = selectedUser ? selectedUser.email : searchQuery;

        // Actualizamos data manualmente antes de enviar si es necesario,
        // aunque Inertia prefiere que 'data' esté actualizado.
        // Aquí forzamos el envío con los datos correctos.
        router.post(`/pisua/${invitingPisua?.id}/kideak`, {
            email: finalEmail,
            user_id: selectedUser?.id
        }, {
            onSuccess: () => {
                closeInviteModal();
            },
        });
    };

    const selectUser = (user: UserResult) => {
        setSelectedUser(user);
        setSearchQuery(user.email); // Ponemos el email en el input visualmente
        setSearchResults([]); // Limpiamos resultados
        setData('email', user.email);
        setData('user_id', user.id);
        clearErrors();
    };

    const closeInviteModal = () => {
        setInvitingPisua(null);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedUser(null);
        reset();
        clearErrors();
    };

    return (
        <section className="w-full max-w-6xl mx-auto py-12 px-6">
            {/* ... (Todo el código del título y listado de pisos se mantiene IGUAL) ... */}

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-left">
                <h1 className="text-3xl font-black text-[#5a4da1] tracking-tight">{hasPisos ? 'Zure Pisuak' : copy.title}</h1>
                <p className="text-[#5a4da1]/60 font-medium">{hasPisos ? 'Kudeatu zure etxeak hemendik' : copy.subtitle}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Botón crear nuevo */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Link href="/pisua/sortu" className="group flex flex-col items-center justify-center gap-6 p-10 bg-[#e9e4ff] rounded-[2.5rem] border-2 border-transparent hover:border-[#5a4da1]/20 transition-all duration-300 h-full min-h-[280px]">
                        <div className="w-16 h-16 bg-[#5a4da1]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#5a4da1]/20 transition-colors">
                            <Plus className="w-8 h-8 text-[#5a4da1]" strokeWidth={2.5} />
                        </div>
                        <span className="text-[#5a4da1] text-lg font-bold">Pisu berria sortu</span>
                    </Link>
                </motion.div>

                {/* Cards de pisos (Mismo código que antes) */}
                {pisuak.map((pisua, index) => (
                    <motion.div key={pisua.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative group h-full">
                        {/* ... Botones acciones ... */}
                         <div className="absolute top-6 right-6 z-30">
                            <button onClick={(e) => { e.preventDefault(); setOpenMenuId(openMenuId === pisua.id ? null : pisua.id); }} className={`p-2 rounded-full transition-all shadow-sm border ${openMenuId === pisua.id ? 'bg-[#5a4da1] text-white border-[#5a4da1]' : 'bg-white/90 text-gray-400 hover:text-[#5a4da1] border-slate-100'}`}>
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            <AnimatePresence>
                                {openMenuId === pisua.id && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                        <motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10 }} className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                                            <button onClick={() => { setInvitingPisua(pisua); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#5a4da1] hover:bg-purple-50 transition-colors"><UserPlus size={18} /> Kideak gehitu</button>
                                            <button onClick={() => { handleEdit(pisua); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-slate-50 transition-colors"><Pencil size={18} /> Izena aldatu</button>
                                            <div className="border-t border-slate-50 my-1" />
                                            <button onClick={() => { handleDelete(pisua.id); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={18} /> Ezabatu pisua</button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* ... Link principal ... */}
                        <Link href={`/pisua/${pisua.id}/kudeatu`} className="flex flex-col justify-between p-8 bg-white rounded-[2.5rem] border-2 border-[#e9e4ff] hover:border-[#5a4da1]/30 transition-all duration-300 h-full min-h-[280px]">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center"><Home className="w-6 h-6 text-[#5a4da1]/70" /></div>
                                <div><h3 className="text-[#5a4da1] text-xl font-bold">{pisua.izena}</h3><p className="text-slate-400 text-sm font-mono uppercase tracking-widest">{pisua.kodigoa}</p></div>
                            </div>
                            <div className="flex items-center text-[#5a4da1] font-bold text-sm group-hover:translate-x-1 transition-transform">Kudeatu <ArrowRight className="ml-2 w-4 h-4" /></div>
                        </Link>
                    </motion.div>
                ))}
            </div>


            {/* MODAL DE INVITACIÓN INTELIGENTE */}
            <AnimatePresence>
                {invitingPisua && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5a4da1]/10 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-purple-50 relative overflow-visible"
                        >
                            <button onClick={closeInviteModal} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors">
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6 mt-2">
                                <div className="w-12 h-12 bg-[#e9e4ff] text-[#5a4da1] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <UserPlus size={24} />
                                </div>
                                <h3 className="text-[#5a4da1] text-lg font-bold">Kidea gonbidatu</h3>
                                <p className="text-slate-400 text-sm mt-1">{invitingPisua.izena}</p>
                            </div>

                            <form onSubmit={handleInviteSubmit} className="space-y-3 relative">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        {isSearching ? <Loader2 className="animate-spin text-slate-400" size={18}/> : <Search className="text-slate-400" size={18}/>}
                                    </div>

                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Bilatu izena edo emaila..."
                                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border transition-all rounded-xl outline-none text-[#5a4da1] placeholder:text-slate-400 ${selectedUser ? 'border-[#5a4da1] bg-purple-50 font-bold' : 'border-slate-200 focus:border-[#5a4da1] focus:bg-white'}`}
                                        value={searchQuery}
                                        onChange={e => {
                                            setSearchQuery(e.target.value);
                                            setSelectedUser(null); // Si escribe, reseteamos la selección
                                        }}
                                    />

                                    {/* LISTA DE RESULTADOS FLOTANTE */}
                                    <AnimatePresence>
                                        {searchResults.length > 0 && !selectedUser && (
                                            <motion.ul
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute w-full bg-white mt-2 rounded-xl border border-slate-100 shadow-xl max-h-48 overflow-y-auto z-50 left-0"
                                            >
                                                {searchResults.map(user => (
                                                    <li key={user.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => selectUser(user)}
                                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-[#5a4da1]/10 flex items-center justify-center text-[#5a4da1]">
                                                                <User size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-700">{user.name}</p>
                                                                <p className="text-xs text-gray-400">{user.email}</p>
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {errors.email && <p className="text-red-500 text-xs mt-2 text-center">{errors.email}</p>}

                                <button
                                    type="submit"
                                    disabled={processing || (!selectedUser && searchQuery.length < 3)}
                                    className="w-full bg-[#5a4da1] text-white py-3 rounded-xl font-bold hover:bg-[#4a3f8a] disabled:opacity-50 transition-all shadow-md shadow-purple-100"
                                >
                                    {processing ? '...' : selectedUser ? 'Gonbidatu' : 'Gonbidapena bidali'}
                                </button>

                                {!selectedUser && searchQuery.length > 3 && searchResults.length === 0 && !isSearching && (
                                    <p className="text-center text-xs text-slate-400">
                                        Erabiltzailea ez da aurkitu. Emaila bidaliko zaio.
                                    </p>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
