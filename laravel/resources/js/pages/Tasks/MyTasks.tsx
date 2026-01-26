import React, { useState } from 'react';

const Head = ({ title }: { title: string }) => <title>{title}</title>;

interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

const Link = ({ href, children, className }: LinkProps) => (
    <a href={href} className={className} onClick={(e) => e.preventDefault()}>{children}</a>
);

// Definimos tipos para los datos y opciones para evitar 'any'
type DataPayload = Record<string, unknown>;
type RequestOptions = Record<string, unknown>;

const router = {
    // Al incluir 'options' en el console.log, el linter deja de marcarlo como "no usado"
    put: (url: string, data: DataPayload, options?: RequestOptions) => console.log('Simulación PUT a:', url, data, options),
    delete: (url: string, options?: RequestOptions) => console.log('Simulación DELETE a:', url, options),
};

// Simulación simple del helper route() de Laravel
const route = (name: string, param?: string | number) => `/${name}/${param || ''}`;

interface AppLayoutProps {
    children: React.ReactNode;
    header: React.ReactNode;
}

// Simulación del AppLayout
const AppLayout = ({ children, header }: AppLayoutProps) => (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
        </header>
        <main>{children}</main>
    </div>
);
/* --- FIN: Mocks para Previsualización --- */


// Definimos la interfaz basada EXACTAMENTE en tu migración 'atazak'
interface Ataza {
    id: number;
    izena: string;      // En migración: $table->string('izena');
    egilea: string;     // En migración: $table->string('egilea');
    arduraduna: string; // En migración: $table->string('arduraduna');
    egoera: string;     // En migración: default('egiteko') -> Valores: 'egiteko' / 'eginda'
    created_at: string;
    updated_at?: string;
}

interface Props {
    atazak?: Ataza[]; 
}

export default function MyTasks({ atazak = [] }: Props) {

    // ESTADO LOCAL SOLO PARA PREVISUALIZACIÓN
    const [previewTasks, setPreviewTasks] = useState<Ataza[]>(atazak.length > 0 ? atazak : [
        { id: 1, izena: 'Fregar los platos', egilea: 'Admin', arduraduna: 'Marco Uribelarrea', egoera: 'egiteko', created_at: '2025-05-22' },
        { id: 2, izena: 'Sacar la basura', egilea: 'Admin', arduraduna: 'Aitor Tilla', egoera: 'eginda', created_at: '2025-05-23' }
    ]);

    // Función para cambiar el estado (Update)
    const toggleTask = (task: Ataza) => {
        // Usamos 'egiteko' (pendiente) y 'eginda' (hecho) basado en el default de tu migración
        const nuevaEgoera = task.egoera === 'eginda' ? 'egiteko' : 'eginda';
        
        // 1. Enviamos la petición PUT al servidor
        router.put(route('atazak.update', task.id), {
            izena: task.izena,
            egilea: task.egilea,
            arduraduna: task.arduraduna,
            egoera: nuevaEgoera
        }, {
            preserveScroll: true
        });

        // 2. Actualización optimista
        setPreviewTasks(previewTasks.map(t => 
            t.id === task.id ? { ...t, egoera: nuevaEgoera } : t
        ));
    };

    // Función para borrar (Destroy)
    const deleteTask = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            router.delete(route('atazak.destroy', id), {
                preserveScroll: true
            });
            setPreviewTasks(previewTasks.filter(t => t.id !== id));
        }
    };

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestión de Atazak
                </h2>
            }
        >
            <Head title="Mis Tareas" />

            <div className="py-8 font-sans">
                <div className="max-w-4xl mx-auto px-4">

                    {/* Cabecera de Sección */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-purple-800">Listado de Tareas</h1>
                        <Link 
                            href={route('atazak.create')}
                            className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium"
                        >
                            Nueva tarea
                        </Link>
                    </div>

                    {/* Lista de Tarjetas */}
                    <div className="space-y-4">
                        {previewTasks.length === 0 && (
                            <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">No hay tareas creadas en la base de datos.</p>
                            </div>
                        )}
                        
                        {previewTasks.map((task) => {
                            // Determinamos si está completada basándonos en 'eginda'
                            const isCompleted = task.egoera === 'eginda';
                            
                            return (
                                <div key={task.id} className="relative bg-purple-50 rounded-xl p-5 shadow-sm border border-purple-100 group hover:shadow-md transition-all">

                                    {/* Botón Borrar */}
                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="absolute top-3 right-3 text-purple-300 hover:text-red-500 transition-colors p-1"
                                        title="Eliminar tarea"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <div className="flex flex-col md:flex-row gap-6 items-center">

                                        {/* COLUMNA IZQUIERDA: Checkbox + Info Principal */}
                                        <div className="flex-1 flex gap-4 w-full">
                                            <div className="pt-1">
                                                <button
                                                    onClick={() => toggleTask(task)}
                                                    className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                                                        isCompleted
                                                        ? 'bg-[#6B4E9B] border-[#6B4E9B]'
                                                        : 'border-[#6B4E9B] bg-transparent hover:bg-purple-100'
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
                                                    Arduraduna: <span className="text-purple-700 font-normal">{task.arduraduna}</span>
                                                </div>
                                                <div className="text-xs text-purple-400 mt-1">
                                                    Egilea: {task.egilea}
                                                </div>
                                            </div>
                                        </div>

                                        {/* COLUMNA DERECHA: Estado e Info (Simplificada sin Notas) */}
                                        <div className="w-full md:w-auto md:border-l md:border-purple-200 md:pl-6 pt-4 md:pt-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start">
                                            <div>
                                                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wide mb-1">Egoera</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                    <p className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {isCompleted ? 'Eginda' : 'Egiteko'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-purple-300 mt-0 md:mt-3 text-right md:text-left">
                                                {task.created_at ? new Date(task.created_at).toLocaleDateString() : ''}
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