import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/components/app-header';

interface User {
    id: number;
    name: string;
}

interface Ataza {
    id: number;
    izena: string;
    egoera: string;
    data: string;
    arduradunak: User[];
}

interface Props {
    atazak: Ataza[];
}

export default function MyTasks({ atazak = [] }: Props) {
    const { props } = usePage<PageProps & { [key: string]: any }>();
    const { pisua } = props;
    const [localTasks, setLocalTasks] = useState<Ataza[]>(atazak);

    const baseUrl = `/pisua/${pisua?.id}/kudeatu/atazak`;

    // Filtros
    const pendingTasks = localTasks
        .filter(t => t.egoera === 'egiteko')
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    const completedTasks = localTasks
        .filter(t => t.egoera === 'eginda')
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    // Acciones
    const toggleTask = (task: Ataza) => {
        const newEgoera = task.egoera === 'eginda' ? 'egiteko' : 'eginda';
        setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, egoera: newEgoera } : t));
        router.put(`${baseUrl}/${task.id}`, { ...task, egoera: newEgoera, arduradunak: task.arduradunak.map(u => u.id) }, { preserveScroll: true });
    };

    const deleteTask = (id: number) => {
        if (!confirm('Ziur zaude ataza hau ezabatu nahi duzula?')) return;
        setLocalTasks(prev => prev.filter(t => t.id !== id));
        router.delete(`${baseUrl}/${id}`, { preserveScroll: true });
    };

    // Helpers Fecha
    const isLate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        date.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        return date < today;
    };

    const isUpcoming = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        date.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    };

    // --- Componente Tarjeta (Estilo Original pero organizado en 2 filas) ---
    const TaskCard = ({ task, isCompleted }: { task: Ataza, isCompleted: boolean }) => {
        const late = !isCompleted && isLate(task.data);
        const upcoming = !isCompleted && !late && isUpcoming(task.data);

        return (
            // Mantenemos tus clases de contenedor originales
            <div className={`relative rounded-xl p-5 shadow-sm border group hover:shadow-md transition-all ${isCompleted ? 'bg-white border-gray-200 opacity-70' : 'bg-purple-50 border-purple-100'}`}>

                <button
                    onClick={() => deleteTask(task.id)}
                    className="absolute top-3 right-3 text-purple-200 hover:text-red-500 transition-colors p-1 z-10"
                    title="Ezabatu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                <div className="flex gap-4 items-start">
                    {/* Checkbox (Izquierda) */}
                    <div className="pt-1">
                        <button
                            onClick={() => toggleTask(task)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                    ? 'bg-[#6B4E9B] border-[#6B4E9B]'
                                    : 'border-[#6B4E9B] bg-transparent hover:bg-purple-100'
                            }`}
                        >
                            {isCompleted && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Contenido (Derecha) - Organizado en Vertical */}
                    <div className="flex-1 w-full pr-6"> {/* pr-6 para dejar sitio al botón borrar */}

                        {/* Fila 1: Título */}
                        <h3 className={`text-lg font-bold mb-2 ${isCompleted ? 'line-through text-gray-400' : 'text-purple-900'}`}>
                            {task.izena}
                        </h3>

                        {/* Fila 2: Metadatos (Responsables y Fecha separados) */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm border-t border-purple-200/50 pt-2 mt-1">

                            {/* Responsables */}
                            <div className={`${isCompleted ? 'text-gray-400' : 'text-purple-800'}`}>
                                {task.arduradunak.length > 0 ? (
                                    <>
                                        <span className="font-semibold opacity-70">Arduradunak: </span>
                                        <span>{task.arduradunak.map(u => u.name).join(', ')}</span>
                                    </>
                                ) : (
                                    <span className="opacity-50 italic">Ez dago arduradunik</span>
                                )}
                            </div>

                            {/* Fecha y Badges */}
                            <div className="flex items-center gap-2">
                                <span className={`font-medium ${late ? 'text-red-600 font-bold' : (isCompleted ? 'text-gray-400' : 'text-purple-700')}`}>
                                    {new Date(task.data).toLocaleDateString()}
                                </span>

                                {late && !isCompleted && (
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                                        Berandu!
                                    </span>
                                )}
                                {upcoming && !isCompleted && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                                        Laster
                                    </span>
                                )}
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
            { title: 'Atazak', href: baseUrl }
        ]}>
            <Head title="Atazak" />

            <div className="py-8 font-sans">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-purple-800">
                            {pisua ? `Atazak: ${pisua.izena}` : 'Atazak'}
                        </h1>
                        <Link
                            href={`${baseUrl}/create`}
                            className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2"
                        >
                            <span>+</span> Ataza berria
                        </Link>
                    </div>

                    {/* SECCIÓN 1: PENDIENTES */}
                    <div className="space-y-4 mb-10">
                        {pendingTasks.length > 0 && (
                            <h2 className="text-lg font-semibold text-purple-900 border-b border-purple-100 pb-2 mb-4">
                                Egiteko ({pendingTasks.length})
                            </h2>
                        )}

                        {pendingTasks.length === 0 ? (
                            <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">Ez dago atazarik pendiente.</p>
                            </div>
                        ) : (
                            pendingTasks.map(task => (
                                <TaskCard key={task.id} task={task} isCompleted={false} />
                            ))
                        )}
                    </div>

                    {/* SECCIÓN 2: HECHAS */}
                    {completedTasks.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-4">
                                Eginda ({completedTasks.length})
                            </h2>
                            {completedTasks.map(task => (
                                <TaskCard key={task.id} task={task} isCompleted={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
