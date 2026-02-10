import React, { useState } from 'react';
import AppLayout from '@/layouts/app/app-header-layout';
import MyPisuaHero from '@/components/home/myPisuaHero';
import { Head } from '@inertiajs/react';

// 1. Definimos la interfaz para "Pisua" (Piso)
interface Pisua {
    id: number;
    izena: string;
    [key: string]: any; // Para permitir otras propiedades por ahora
}

// 2. Definimos las Props para evitar el "any"
interface MyPisuaPageProps {
    auth: any;
    pisua: Pisua; // El piso actual
    pisuak: Pisua[]; // Lista de pisos (necesaria para el componente Hero)
    items_priorizados?: any; // Opcional si no lo usas aún
    resumen_general?: any;   // Opcional si no lo usas aún
}

// 3. Definimos el texto estático (ya que no viene de props)
const myPisuaCopy = {
    title: "Gestión de Pisos",
    subtitle: "Selecciona y administra tus propiedades"
};

export default function MyPisuaPage({
    auth,
    pisua,
    pisuak = [], // Valor por defecto si no viene del backend
    items_priorizados,
    resumen_general
}: MyPisuaPageProps) {

    // 4. Faltaba el ESTADO para controlar la selección
    const [selectedPisua, setSelectedPisua] = useState<Pisua | null>(pisua || null);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: selectedPisua ? selectedPisua.izena : 'Mis Pisos', href: '#' },
    ];

    // Log para "usar" las variables y callar a ESLint temporalmente
    // (Elimina esto cuando implementes la lógica real de estos datos)
    console.log('Auth:', auth);
    console.log('Priorizados:', items_priorizados);
    console.log('Resumen:', resumen_general);

    return (
        // 5. Pasamos la variable breadcrumbs que creaste
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title={selectedPisua ? selectedPisua.izena : "Mis Casas"} />

            <div className="min-h-screen flex flex-col bg-white">
                <MyPisuaHero
                    copy={myPisuaCopy}
                    pisuak={pisuak} // Asegúrate de que el backend envíe esta lista
                    selectedPisua={selectedPisua}
                    // Corregimos el tipado del evento
                    onSelect={(p: Pisua | null) => setSelectedPisua(p)}
                />
            </div>
        </AppLayout>
    );
}
