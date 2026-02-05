import React from 'react';
import AppLayout from '@/layouts/app/app-header-layout'; // Usando tu ruta de layout
import MyPisuaHero from '@/components/home/myPisuaHero';
import { Head } from '@inertiajs/react';

export default function MyPisuaPage({ auth, pisua, items_priorizados, resumen_general }: any) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: pisua.izena, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title={selectedPisua ? selectedPisua.izena : "Mis Casas"} />

            <div className="min-h-screen flex flex-col bg-white">
                <MyPisuaHero
                    copy={myPisuaCopy}
                    pisuak={pisuak}
                    selectedPisua={selectedPisua}
                    onSelect={(p: Pisua | null) => setSelectedPisua(p)}
                />
            </div>
        </AppLayout>
    );
}
