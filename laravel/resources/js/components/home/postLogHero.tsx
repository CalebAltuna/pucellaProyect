import { motion } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { Plus, Home, ArrowRight, Trash2 } from 'lucide-react';
import { postLogCopy } from '@/lib/content';

interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

interface PostLogHeroProps {
    copy: typeof postLogCopy;
    pisuak?: Pisua[];
}

export function Hero({ copy, pisuak = [] }: PostLogHeroProps) {
    const hasPisos = pisuak.length > 0;

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('Ziur zaude pisu hau ezabatu nahi duzula? (¿Seguro que quieres borrar este piso?)')) {
            router.delete(`/pisua/${id}`);
        }
    };
    return (
        <section className="w-full max-w-6xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-left"
            >
                <h1 className="text-3xl font-black text-[#5a4da1] tracking-tight">
                    {hasPisos ? 'Zure Pisuak' : copy.title}
                </h1>
                <p className="text-[#5a4da1]/60 font-medium">
                    {hasPisos ? 'Kudeatu zure etxeak hemendik' : copy.subtitle}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Link
                        href="/pisua/sortu"
                        className="group flex flex-col items-center justify-center gap-6 p-10 bg-[#e9e4ff] rounded-[2.5rem] border-2 border-transparent hover:border-[#5a4da1]/20 transition-all duration-300 h-full min-h-[280px]"
                    >
                        <div className="w-16 h-16 bg-[#5a4da1]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#5a4da1]/20 transition-colors">
                            <Plus className="w-8 h-8 text-[#5a4da1]" strokeWidth={2.5} />
                        </div>
                        <span className="text-[#5a4da1] text-lg font-bold">
                            Pisu berria sortu
                        </span>
                    </Link>
                </motion.div>
                {pisuak.map((pisua, index) => (
                    <motion.div
                        key={pisua.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                    >
                        <button
                            onClick={(e) => handleDelete(e, pisua.id)}
                            // He quitado todas las clases de opacidad. Ahora es visible siempre.
                            className="absolute top-6 right-6 z-20 p-2 bg-white/90 text-gray-400 hover:text-red-500 rounded-full transition-all shadow-sm border border-transparent hover:border-red-100"
                            title="Ezabatu pisua"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <Link
                            href={`/pisua/${pisua.id}/kudeatu`}
                            className="flex flex-col justify-between p-8 bg-white rounded-[2.5rem] border-2 border-[#e9e4ff] hover:border-[#5a4da1]/30 transition-all duration-300 h-full min-h-[280px]"
                        >
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                                    <Home className="w-6 h-6 text-[#5a4da1]/70" />
                                </div>
                                <div>
                                    <h3 className="text-[#5a4da1] text-xl font-bold">{pisua.izena}</h3>
                                    <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">{pisua.kodigoa}</p>
                                </div>
                            </div>

                            <div className="flex items-center text-[#5a4da1] font-bold text-sm group-hover:gap-2 transition-all">
                                Kudeatu <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
