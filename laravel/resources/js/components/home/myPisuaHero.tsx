import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wallet, ClipboardCheck, Home } from 'lucide-react';
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
    return (
        <section className="w-full max-w-4xl mx-auto py-12 px-6">
            <AnimatePresence mode="wait">
                {!selectedPisua ? (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="mb-12">
                            <h1 className="text-3xl font-black text-[#5a4da1]">{copy.title}</h1>
                            <p className="text-[#5a4da1]/60 font-medium">{copy.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pisuak.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => onSelect(p)}
                                    className="p-8 bg-white rounded-[2rem] border-2 border-[#e9e4ff] hover:border-[#5a4da1]/30 cursor-pointer transition-all"
                                >
                                    <Home className="text-[#5a4da1] mb-4" />
                                    <h3 className="text-xl font-bold text-[#5a4da1]">{p.izena}</h3>
                                    <p className="text-slate-400 text-sm uppercase tracking-widest">{p.kodigoa}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => onSelect(null)} className="text-[#5a4da1] hover:bg-[#f4f2ff] p-2 rounded-full transition-all">
                                <ArrowLeft size={24} />
                            </button>
                            <h2 className="text-2xl font-bold text-[#5a4da1]">Inicio</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-5 bg-[#efebff] rounded-2xl border border-[#e2daff] shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-lg"><Wallet className="text-[#5a4da1] w-6 h-6" /></div>
                                    <span className="text-[#5a4da1] font-semibold text-lg">Fregar los platos</span>
                                </div>
                                <span className="text-[#5a4da1]/60 font-bold text-sm">03/02/2025</span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[#efebff] rounded-2xl border border-[#e2daff] shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-lg"><ClipboardCheck className="text-[#5a4da1] w-6 h-6" /></div>
                                    <span className="text-[#5a4da1] font-semibold text-lg">Compra de la fruteria</span>
                                </div>
                                <span className="text-[#5a4da1]/60 font-bold text-sm">17/02/2025</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
