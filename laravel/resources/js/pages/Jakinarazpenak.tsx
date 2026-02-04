import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Si falla, cambia a '@/Layouts/AppLayout' (mayúsculas)

// --- INTERFACES ---
interface JakinarazpenaItem {
    id: string;
    real_id: number;
    izena: string;
    mota: 'gasto' | 'tarea';
    kopurua?: number;
    total_gasto?: number;
    prioridad: number;
    urgencia: number; // 0: Berandu, 1: Urgentea, 2: Laister, 3: Normal
    created_at_formatted: string;
    deadline_formatted?: string;
    eroslea?: string;
}

interface JakinarazpenakProps {
    pisua: { id: number; izena: string };
    jakinarazpenak: JakinarazpenaItem[];
    estadistikak: {
        total_items: number;
        total_deuda: number;
        tareas_pendientes: number;
    };
    auth: { user: any };
}

export default function Jakinarazpenak({ pisua, jakinarazpenak, estadistikak }: JakinarazpenakProps) {

    // --- HELPERS VISUALES ---
    const getUrgenciaBadge = (level: number) => {
        switch (level) {
            case 0: return <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">BERANDU!</span>;
            case 1: return <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase">URGENTEA</span>;
            case 2: return <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold uppercase">LAISTER</span>;
            default: return null;
        }
    };

    // --- COMPONENTE TARJETA ---
    const NotificationCard = ({ item }: { item: JakinarazpenaItem }) => {
        const isGasto = item.mota === 'gasto';

        return (
            <div className="relative rounded-xl p-5 shadow-sm border bg-purple-50 border-purple-100 group hover:shadow-md transition-all mb-4">
                <div className="flex gap-4 items-start">
                    <div className="pt-1">
                        <div className={`w-2.5 h-2.5 mt-2 rounded-full ${isGasto ? 'bg-red-400' : 'bg-purple-400'}`} />
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

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-purple-800 uppercase tracking-tight">
                                {pisua.izena} | Jakinarazpenak
                            </h1>
                            <p className="text-purple-500/80 text-sm italic font-medium">Zure arreta behar duten kontuak</p>
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-white px-5 py-3 rounded-2xl border border-purple-100 shadow-sm text-center min-w-[100px]">
                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Gastuak</p>
                                <p className="text-xl font-black text-red-500">{estadistikak.total_deuda}€</p>
                            </div>
                            <div className="bg-white px-5 py-3 rounded-2xl border border-purple-100 shadow-sm text-center min-w-[100px]">
                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Atazak</p>
                                <p className="text-xl font-black text-purple-600">{estadistikak.tareas_pendientes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        {jakinarazpenak.length === 0 ? (
                            <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-purple-100 shadow-inner">
                                <p className="text-purple-300 text-lg font-medium italic">Ez daukazu ezer egiteko. Ondo bizi zara!</p>
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
