import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Plus, Home, ArrowRight, ClipboardList, Wallet, Settings, ArrowLeft } from 'lucide-react';
import { myPisuaCopy } from '@/lib/content';

export interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

export interface MyPisuaHeroProps {
    copy: typeof myPisuaCopy;
    pisuak: Pisua[];
    selectedPisua: Pisua | null;
    onSelect: (p: Pisua | null) => void;
}

export function MyPisuaHero({ copy, pisuak, selectedPisua, onSelect }: MyPisuaHeroProps) {
    const hasPisos = pisuak.length > 0;

    return (
        <section className="w-full max-w-6xl mx-auto py-12 px-6">
            <AnimatePresence mode="wait">
                {!selectedPisua ? (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="mb-12 text-left">
                            <h1 className="text-3xl font-black text-[#5a4da1] tracking-tight">
                                {hasPisos ? 'Zure Pisuak' : copy.title}
                            </h1>
                            <p className="text-[#5a4da1]/60 font-medium">
                                {hasPisos ? 'Kudeatu zure etxeak hemendik' : copy.subtitle}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Link href="/pisua/sortu" className="group flex flex-col items-center justify-center gap-6 p-10 bg-[#e9e4ff] rounded-[2.5rem] border-2 border-transparent hover:border-[#5a4da1]/20 transition-all min-h-[280px]">
                                <Plus className="w-8 h-8 text-[#5a4da1]" strokeWidth={2.5} />
                                <span className="text-[#5a4da1] text-lg font-bold">Pisu berria sortu</span>
                            </Link>
                            {pisuak.map((p) => (
                                <div key={p.id} onClick={() => onSelect(p)} className="flex flex-col justify-between p-8 bg-white rounded-[2.5rem] border-2 border-[#e9e4ff] hover:border-[#5a4da1]/30 transition-all min-h-[280px] group cursor-pointer">
                                    <div className="space-y-4">
                                        <Home className="w-6 h-6 text-[#5a4da1]/70" />
                                        <h3 className="text-[#5a4da1] text-xl font-bold">{p.izena}</h3>
                                        <p className="text-slate-400 text-sm font-mono uppercase">{p.kodigoa}</p>
                                    </div>
                                    <div className="flex items-center text-[#5a4da1] font-bold text-sm">Entrar <ArrowRight className="ml-2 w-4 h-4" /></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="manage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-6 mb-16">
                            <button onClick={() => onSelect(null)} className="p-4 bg-[#e9e4ff] text-[#5a4da1] rounded-[1.2rem] hover:bg-[#ded7ff] transition-all">
                                <ArrowLeft size={24} strokeWidth={2.5} />
                            </button>
                            <h1 className="text-4xl font-black text-[#5a4da1] tracking-tight">{selectedPisua.izena}</h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-10 bg-[#f4f2ff] rounded-[2.5rem] cursor-pointer">
                                <ClipboardList className="text-[#5a4da1] mb-8" />
                                <h3 className="text-2xl font-black text-[#5a4da1]">Tareas</h3>
                            </div>
                            <div className="p-10 bg-[#f4f2ff] rounded-[2.5rem] cursor-pointer">
                                <Wallet className="text-[#5a4da1] mb-8" />
                                <h3 className="text-2xl font-black text-[#5a4da1]">Gastos</h3>
                            </div>
                            <Link href={`/pisua/${selectedPisua.id}/edit`} className="p-10 bg-white border-2 border-[#f4f2ff] rounded-[2.5rem]">
                                <Settings className="text-slate-400 mb-8" />
                                <h3 className="text-2xl font-black text-slate-400">Ajustes</h3>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}