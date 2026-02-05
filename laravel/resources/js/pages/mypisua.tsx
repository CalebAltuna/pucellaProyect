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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Piso: ${pisua.izena}`} />
            
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <MyPisuaHero 
                    pisua={pisua} 
                    items={items_priorizados} 
                    stats={resumen_general} 
                />
            </div>
        </AppLayout>
    );
}