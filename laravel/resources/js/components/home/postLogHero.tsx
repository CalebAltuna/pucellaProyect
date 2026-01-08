import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { postLogCopy } from '@/lib/content';
// 🗑️ Eliminado el import de ziggy-js

interface PostLogHeroProps {
    copy: typeof postLogCopy;
}
export function Hero({ copy }: PostLogHeroProps) {
    return (
        <section className="grid place-content-center gap-8 text-center py-10 px-4">
            <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground/90"
            >
                {copy.title}
                <span className="block text-brand/90 font-semibold">{copy.highlight}</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground/90"
            >
                {copy.subtitle}
            </motion.p>

            <motion.div
                className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
            >
                <Link
                    href="/pisua/sortu"
                    className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-white text-base sm:text-lg font-semibold shadow-xl shadow-brand/20 hover:bg-brand/90 hover:scale-[1.03] active:scale-[0.99] transition-transform duration-200"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="currentColor">
                        <path d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1Z" />
                    </svg>
                    Crear piso
                </Link>
                <Link
                    href="/pisua/erakutsi"
                    className="inline-flex items-center justify-center rounded-full border-2 border-border bg-muted/50 backdrop-blur px-6 py-3 text-foreground text-base sm:text-lg font-semibold hover:bg-muted hover:border-foreground/30 hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="currentColor">
                        <path d="M4 6h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h16a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Z" />
                    </svg>
                    Ver mis pisos
                </Link>
            </motion.div>
        </section>
    );
}
