import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/components/app-header';

interface Ataza {
    id: number;
    izena: string;
    egoera: string;
    user?: { name: string };
    arduraduna?: { name: string };
    created_at: string;
}

interface Props {
    atazak: Ataza[];
}

export default function MyTasks({ atazak = [] }: Props) {
    // CORRECCIÓN TYPESCRIPT: Añadimos & { [key: string]: any } para satisfacer a Inertia
    const { props } = usePage<PageProps & { [key: string]: any }>();
    const { pisua } = props;

    const [localTasks, setLocalTasks] = useState<Ataza[]>(atazak);

    useEffect(() => {
        setLocalTasks(atazak);
    }, [atazak]);

    // URL base para las acciones de tareas dentro de un piso
    const baseUrl = `/pisua/${pisua?.id}/kudeatu/atazak`;

    const toggleTask = (task: Ataza) => {
        const newEgoera = task.egoera === 'eginda' ? 'egiteko' : 'eginda';
        router.put(`${baseUrl}/${task.id}`, {
            izena: task.izena,
            egoera: newEgoera
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalTasks(localTasks.map(t =>
                    t.id === task.id ? { ...t, egoera: newEgoera } : t
                ));
            }
        });
    };

    const deleteTask = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            // CORRECCIÓN URL: Ahora apunta a la tarea específica dentro del piso
            router.delete(`${baseUrl}/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Actualizamos la lista local visualmente para que desaparezca rápido
                    setLocalTasks(localTasks.filter(t => t.id !== id));
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Nire Pisua', href: `/pisua/${pisua?.id}/kudeatu` },
            { title: 'Atazak', href: baseUrl }
        ]}>
            <Head title="Mis Tareas" />

            <div className="py-8 font-sans">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-purple-800">
                            {pisua ? `Atazak: ${pisua.izena}` : 'Listado de Tareas'}
                        </h1>
                        {/* BOTÓN CONECTADO: Lleva al formulario de creación */}
                        <Link
                            href={`${baseUrl}/create`}
                            className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium"
                        >
                            Nueva tarea
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {localTasks.length === 0 && (
                            <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">No hay tareas disponibles.</p>
                            </div>
                        )}

                        {localTasks.map((task) => {
                            const isCompleted = task.egoera === 'eginda';
                            return (
                                <div key={task.id} className="relative bg-purple-50 rounded-xl p-5 shadow-sm border border-purple-100 group hover:shadow-md transition-all">
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="absolute top-3 right-3 text-purple-300 hover:text-red-500 transition-colors p-1 z-10"
                                        title="Eliminar tarea"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-1 flex gap-4 w-full">
                                            <div className="pt-1">
                                                <button
                                                    onClick={() => toggleTask(task)}
                                                    className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-[#6B4E9B] border-[#6B4E9B]' : 'border-[#6B4E9B] bg-transparent hover:bg-purple-100'
                                                        }`}
                                                >
                                                    {isCompleted && (
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className={`text-lg font-bold text-purple-900 ${isCompleted ? 'line-through text-purple-400' : ''}`}>
                                                    {task.izena}
                                                </h3>
                                                <div className="mt-1 text-sm text-purple-800 font-medium">
                                                    Arduraduna: <span className="text-purple-700 font-normal">{task.arduraduna?.name || 'Sin asignar'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto md:border-l md:border-purple-200 md:pl-6 pt-4 md:pt-0 flex flex-row md:justify-center items-center">
                                            <div>
                                                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wide mb-1">Egoera</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                    <p className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {isCompleted ? 'Eginda' : 'Egiteko'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}