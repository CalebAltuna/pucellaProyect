import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Sortu() {
    const { data, setData, post, processing, errors } = useForm({
        pisuaren_izena: '',
        pisuaren_kodigoa: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/pisua');
    };

    return (
        <div className="min-h-screen bg-background py-10 px-4">
            <Head title="Sortu Pisua" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto"
            >
                <div className="text-center mb-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground/90 mb-3"
                    >
                        Sortu Pisua
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-muted-foreground/90 text-base sm:text-lg"
                    >
                        Sartu pisu berriaren informazioa
                    </motion.p>
                </div>

                <motion.form
                    onSubmit={submit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl shadow-xl p-6 sm:p-8"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                        >
                            <label
                                htmlFor="izena"
                                className="block text-sm font-medium text-foreground/80 mb-2"
                            >
                                Pisuaren Izena
                            </label>
                            <input
                                type="text"
                                name="pisuaren_izena"
                                id="izena"
                                value={data.pisuaren_izena}
                                onChange={(e) => setData('pisuaren_izena', e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all duration-200"
                                placeholder="Sartu pisuaren izena"
                                required
                            />
                            {errors.pisuaren_izena && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.pisuaren_izena}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label
                                htmlFor="kodigoa"
                                className="block text-sm font-medium text-foreground/80 mb-2"
                            >
                                Pisuaren Kodigoa
                            </label>
                            <input
                                type="text"
                                name="pisuaren_kodigoa"
                                id="kodigoa"
                                value={data.pisuaren_kodigoa}
                                onChange={(e) => setData('pisuaren_kodigoa', e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-transparent transition-all duration-200"
                                placeholder="Sartu pisuaren kodea"
                                required
                            />
                            {errors.pisuaren_kodigoa && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.pisuaren_kodigoa}
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={processing}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-brand text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-brand/20 hover:bg-brand/90 hover:shadow-brand/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gordetzen...
                                </>
                            ) : (
                                <>
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2zm0 2v14h14V5H5zm7 2h2v4h4v2h-4v4h-2v-4H8v-2h4V7z" />
                                    </svg>
                                    Gorde Pisua
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8"
                >
                    <a
                        href="/pisua/erakutsi"
                        className="inline-flex items-center justify-center text-foreground/70 hover:text-foreground text-sm font-medium hover:underline transition-colors duration-200"
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                        Ikusi nire pisuak
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
