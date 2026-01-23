import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Receipt, Ghost } from 'lucide-react';

export interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

export interface MyPisuaHeroProps {
    selectedPisua: Pisua | null;
    onEnterPisua?: (p: Pisua) => void;
    onExitPisua?: () => void;
    tareas?: { id: number; titulo: string; fecha: string }[];
    gastos?: { id: number; titulo: string; fecha: string; cantidad: string }[];
}

export function MyPisuaHero({ 
    selectedPisua, 
    onEnterPisua,
    onExitPisua,
    tareas = [], 
    gastos = []
}: MyPisuaHeroProps) {
    const allItems = [
        ...gastos.map(g => ({ ...g, type: 'gasto' as const })),
        ...tareas.map(t => ({ ...t, type: 'tarea' as const }))
    ];
    useEffect(() => {
        if (selectedPisua) {
            onEnterPisua?.(selectedPisua);
        } else {
            onExitPisua?.();
        }
    }, [selectedPisua, onEnterPisua, onExitPisua]);

    return (
        <section className="w-full bg-white font-sans">
            <AnimatePresence mode="wait">
                <motion.div 
                    key="content" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-5xl mx-auto py-8 px-6"
                >
                    {/* Header*/}
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-2xl font-bold text-[#534595]">Hasiera</h2>
                    </div>

                    {/* Txartela bateratua */}
                    <div className="flex flex-col gap-4">
                        {allItems.length > 0 ? (
                            allItems.map((item) => (
                                <motion.div
                                    key={`${item.type}-${item.id}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#f3e8ff] p-5 rounded-xl border border-transparent hover:border-[#d8bbf5] transition-all flex items-center justify-between shadow-sm cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-[#3b326b]">
                                            {item.type === 'tarea' ? (
                                                <ClipboardCheck size={28} strokeWidth={1.5} />
                                            ) : (
                                                <Receipt size={28} strokeWidth={1.5} />
                                            )}
                                        </div>
                                        
                                        {/* textua */}
                                        <div className="flex flex-col">
                                            <span className="text-[#534595] text-lg font-medium leading-tight mb-0.5">
                                                {item.titulo}
                                            </span>
                                            {/* Renderizado condicional de cantidad si es gasto */}
                                            {item.type === 'gasto' && (item as any).cantidad && (
                                                <span className="text-[#534595]/70 text-sm font-bold">
                                                    {(item as any).cantidad}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Fecha */}
                                    <span className="text-[#534595] font-medium text-sm">
                                        {item.fecha}
                                    </span>
                                </motion.div>
                            ))
                        ) : (
                            // --- EMPTY STATE GENÉRICO ---
                            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#f0ebfa] rounded-3xl bg-[#fcfbff]">
                                <div className="bg-[#f3effb] p-4 rounded-full mb-3">
                                    <Ghost className="text-[#635ca9]/40 w-8 h-8" />
                                </div>
                                <p className="text-[#534595] font-bold text-lg">Ez dago ezer</p>
                                <p className="text-[#534595]/50 text-sm">Dena dago eguneratuta</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}