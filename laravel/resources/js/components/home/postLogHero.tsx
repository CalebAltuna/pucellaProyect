import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Plus, Home, ArrowRight } from 'lucide-react';
import { postLogCopy } from '@/lib/content';
//ESTE ES EL HERO DEL POST LOG; LA PANTALLA DE CREAR PISOS Y VER LOS QUE TIENES YA HECHOS
interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
}

interface PostLogHeroProps {
    copy: typeof postLogCopy;
    pisuak?: Pisua[]; //prop berria, gemini gomendapena
}

export function Hero({ copy, pisuak = [] }: PostLogHeroProps) {
    const hasPisos = pisuak.length > 0;

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
                {/*sortzeko aukera beti edukiko du erabiltzailea */}
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

                {/*Dituzun pisuak erakuzten dira */}
                {pisuak.map((pisua, index) => (
                    <motion.div
                        key={pisua.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={`/pisua/${pisua.id}/kudeatu`}
                            className="flex flex-col justify-between p-8 bg-white rounded-[2.5rem] border-2 border-[#e9e4ff] hover:border-[#5a4da1]/30 transition-all duration-300 h-full min-h-[280px] group"
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
