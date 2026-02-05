import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/components/app-header';

// --- INTERFACES ---
interface JakinarazpenaItem {
    id: string;
    real_id: number;
    izena: string;
    mota: 'gasto' | 'tarea';
    kopurua?: number;
    total_gasto?: number;
    prioridad: number;
    urgencia: number; // 0: Tarde, 1: Crítico, 2: Pronto, 3: Normal
    created_at_formatted: string;
    deadline_formatted?: string;
    eroslea?: string;
}

interface ExtendedPageProps extends PageProps {
    pisua: { id: number; izena: string };
    jakinarazpenak: JakinarazpenaItem[];
    // filter: string; // Eliminado
    estadistikak: {
        total_items: number;
        total_deuda: number;
        tareas_pendientes: number;
    };
}

export default function Jakinarazpenak() {
    const { props } = usePage<ExtendedPageProps>();
    const { pisua, jakinarazpenak, estadistikak } = props;


    const getUrgenciaBadge = (level: number) => {
        switch (level) {
            case 0: return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">BERANDU!</span>;
            case 1: return <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">PRESAKOA</span>;
            case 2: return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">LAISTER</span>;
            default: return null;
        }
    };

    const NotificationCard = ({ item }: { item: JakinarazpenaItem }) => {
        const isGasto = item.mota === 'gasto';

        return (
            <div className="relative rounded-xl p-5 shadow-sm border bg-purple-50 border-purple-100 group hover:shadow-md transition-all">
                <div className="flex gap-4 items-start">
                    <div className="pt-1">
                        <div className={`w-2 h-2 mt-2 rounded-full ${isGasto ? 'bg-red-400' : 'bg-purple-400'}`} />
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-purple-900 leading-tight">
                                {item.izena}
                            </h3>
                            {isGasto && (
                                <span className="text-xl font-black text-red-600 shrink-0">
                                    {item.kopurua}€
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm border-t border-purple-200/50 pt-2 mt-1">
                            <div className="text-purple-800 italic">
                                {isGasto ? (
                                    <>Nork erosia: <span className="font-semibold">{item.eroslea}</span></>
                                ) : (
                                    <>Muga: <span className="font-semibold">{item.deadline_formatted}</span></>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-purple-400 font-medium">
                                    {item.created_at_formatted}
                                </span>
                                {getUrgenciaBadge(item.urgencia)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Nire Pisua', href: `/pisua/${pisua?.id}/kudeatu` },
            { title: 'Jakinarazpenak', href: '#' }
        ]}>
            <Head title={`Jakinarazpenak - ${pisua.izena}`} />

            <div className="py-8 font-sans">
                <div className="max-w-4xl mx-auto px-4">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-purple-800">
                                {pisua.izena} | Jakinarazpenak
                            </h1>
                            <p className="text-purple-600/60 text-sm">Zure arreta behar duten kontuak</p>
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-center min-w-[80px]">
                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Gastuak</p>
                                <p className="text-lg font-black text-purple-600">{estadistikak.total_deuda}€</p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm text-center min-w-[80px]">
                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Atazak</p>
                                <p className="text-lg font-black text-purple-600">{estadistikak.tareas_pendientes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {jakinarazpenak.length === 0 ? (
                            <div className="bg-white rounded-xl p-16 text-center border-2 border-dashed border-purple-100">
                                <p className="text-purple-300 font-medium italic">Ez daukazu ezer egiteko. Ondo bizi zara!</p>
                            </div>
                        ) : (
                            jakinarazpenak.map((item) => (
                                <NotificationCard key={item.id} item={item} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
