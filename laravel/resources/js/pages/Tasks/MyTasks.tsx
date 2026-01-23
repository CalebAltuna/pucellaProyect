import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

interface Task {
    id: number;
    title: string;
    assignee: string;
    date: string;
    note: string;
    isCompleted: boolean;
}

const DUMMY_TASKS: Task[] = [
    {
        id: 1,
        title: "Fregar los platos",
        assignee: "Marco Uribelarrea",
        date: "22/5/2025",
        note: "Recuerda no volver a usar el lado rugoso del estropajo en la sarten",
        isCompleted: false,
    },
    {
        id: 2,
        title: "Sacar la basura",
        assignee: "Aitor Tilla",
        date: "23/5/2025",
        note: "Bajarla al contenedor marrón, por favor.",
        isCompleted: true,
    }
];

export default function MyTasks() {
 
    const [tasks, setTasks] = useState(DUMMY_TASKS);

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => 
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="Mis Tareas" />

            {/* --- NAVBAR (Violeta Oscuro) --- */}
            <header className="bg-[#6B4E9B] px-6 py-3 shadow-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    
                    {/* Logo Izquierda */}
                    <div className="bg-white rounded-full p-1 h-10 w-10 flex items-center justify-center border-2 border-purple-200">
                        {/* Icono de casa simulado */}
                        <svg className="w-6 h-6 text-[#6B4E9B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </div>

                    {/* Botones Centrales (Pills) */}
                    <nav className="flex space-x-2">
                        <NavButton active={false}>Inicio</NavButton>
                        <NavButton active={true}>Tareas</NavButton>
                        <NavButton active={false}>Facturas</NavButton>
                        <NavButton active={false}>Miembros</NavButton>
                    </nav>

                    {/* Perfil Derecha */}
                    <div className="h-10 w-10 bg-purple-400/50 rounded-full flex items-center justify-center text-white border border-purple-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                </div>
            </header>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="max-w-4xl mx-auto mt-8 px-4">
                
                {/* Cabecera de Sección */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-purple-800">Tareas</h1>
                    <button className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium">
                        Nueva tarea
                    </button>
                </div>

                {/* Lista de Tarjetas */}
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="relative bg-purple-50 rounded-xl p-5 shadow-sm border border-purple-100 group hover:shadow-md transition-all">
                            
                            {/* Icono Papelera (arriba derecha) */}
                            <button className="absolute top-3 right-3 text-purple-300 hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>

                            <div className="flex flex-col md:flex-row gap-6">
                                
                                {/* COLUMNA IZQUIERDA: Checkbox + Info Principal */}
                                <div className="flex-1 flex gap-4">
                                    {/* Checkbox grande personalizado */}
                                    <div className="pt-1">
                                        <button 
                                            onClick={() => toggleTask(task.id)}
                                            className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                                                task.isCompleted 
                                                ? 'bg-[#6B4E9B] border-[#6B4E9B]' 
                                                : 'border-[#6B4E9B] bg-transparent hover:bg-purple-100'
                                            }`}
                                        >
                                            {task.isCompleted && (
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className={`text-lg font-bold text-purple-900 ${task.isCompleted ? 'line-through text-purple-400' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <div className="mt-1 text-sm text-purple-800 font-medium">
                                            Asignado: <span className="text-purple-700 font-normal">{task.assignee}</span>
                                        </div>
                                        <div className="text-sm text-purple-800 font-medium">
                                            {task.date}
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA: Nota (Separada visualmente) */}
                                <div className="flex-1 md:border-l md:border-purple-200 md:pl-6 pt-2 md:pt-0">
                                    <h4 className="text-sm font-bold text-purple-900 mb-1">Nota</h4>
                                    <p className="text-sm text-purple-800 leading-relaxed opacity-90">
                                        {task.note}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

// Componente auxiliar para los botones del menú superior
function NavButton({ active, children }: { active: boolean, children: React.ReactNode }) {
    return (
        <button className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
            active 
            ? 'bg-white text-[#6B4E9B] shadow-sm' 
            : 'bg-purple-400/30 text-white hover:bg-purple-400/50'
        }`}>
            {children}
        </button>
    );
}