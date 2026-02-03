import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/components/app-header';
import { Pencil, Trash2, Check, X, Loader2, Calendar, Users } from 'lucide-react';

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
    can: {
        edit: boolean;
        delete: boolean;
    };
}

interface ExtendedProps extends PageProps {
    atazak: Ataza[];
    kideak: User[]; // Necesitamos la lista de miembros para el selector
    pisua: { id: number; izena: string };
}

export default function MyTasks() {
    const { atazak, kideak, pisua } = usePage<ExtendedProps>().props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const baseUrl = `/pisua/${pisua?.id}/kudeatu/atazak`;

    // Formulario de Inertia para la edición inline
    const { data, setData, put, processing, reset, clearErrors } = useForm({
        izena: '',
        data: '',
        arduradunak: [] as number[],
    });

    // Iniciar edición
    const startEdit = (task: Ataza) => {
        clearErrors();
        setEditingId(task.id);
        setData({
            izena: task.izena,
            data: task.data,
            arduradunak: task.arduradunak.map(u => u.id)
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const saveEdit = (e: React.FormEvent, taskId: number) => {
        e.preventDefault();
        put(`${baseUrl}/${taskId}`, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const toggleTask = (task: Ataza) => {
        if (!task.can.edit) return;
        const newEgoera = task.egoera === 'eginda' ? 'egiteko' : 'eginda';
        router.put(`${baseUrl}/${task.id}`, {
            ...task,
            egoera: newEgoera,
            arduradunak: task.arduradunak.map(u => u.id)
        }, { preserveScroll: true });
    };

    const deleteTask = (taskId: number) => {
        if (confirm('Ziur zaude ataza hau ezabatu nahi duzula?')) {
            router.delete(`${baseUrl}/${taskId}`, { preserveScroll: true });
        }
    };

    // Helpers de fecha
    const isLate = (d: string) => new Date(d).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Nire Pisua', href: `/pisua/${pisua?.id}/kudeatu` },
            { title: 'Atazak', href: baseUrl }
        ]}>
            <Head title="Atazak" />

            <div className="py-8 max-w-4xl mx-auto px-4 font-sans">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-purple-800">
                        {pisua ? `Atazak: ${pisua.izena}` : 'Atazak'}
                    </h1>
                    <Link
                        href={`${baseUrl}/create`}
                        className="bg-[#6B4E9B] hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2"
                    >
                        <PlusIcon /> Ataza berria
                    </Link>
                </div>

                <div className="space-y-4">
                    {atazak.map((task) => {
                        const isEditing = editingId === task.id;
                        const isCompleted = task.egoera === 'eginda';
                        const late = !isCompleted && isLate(task.data);

                        return (
                            <div key={task.id} className={`relative rounded-xl p-5 shadow-sm border transition-all ${isCompleted ? 'bg-white border-gray-200 opacity-70' : 'bg-purple-50 border-purple-100'}`}>

                                {isEditing ? (
                                    /* --- VISTA EDICIÓN --- */
                                    <form onSubmit={(e) => saveEdit(e, task.id)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-purple-400 uppercase">Atazaren izena</label>
                                                <input
                                                    type="text"
                                                    value={data.izena}
                                                    onChange={e => setData('izena', e.target.value)}
                                                    className="w-full border-purple-200 rounded-lg focus:ring-[#6B4E9B]"
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-purple-400 uppercase">Data</label>
                                                <input
                                                    type="date"
                                                    value={data.data}
                                                    onChange={e => setData('data', e.target.value)}
                                                    className="w-full border-purple-200 rounded-lg focus:ring-[#6B4E9B]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-purple-400 uppercase">Arduradunak (Mantendu Ctrl klik anitzetarako)</label>
                                            <select
                                                multiple
                                                value={data.arduradunak.map(String)}
                                                onChange={e => setData('arduradunak', Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                                                className="w-full border-purple-200 rounded-lg focus:ring-[#6B4E9B] text-sm"
                                                size={Math.min(kideak.length, 4)}
                                            >
                                                {kideak.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={cancelEdit} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
                                                <X size={20} />
                                            </button>
                                            <button type="submit" disabled={processing} className="p-2 bg-[#6B4E9B] text-white rounded-lg hover:bg-purple-800 transition-colors">
                                                {processing ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    /* --- VISTA NORMAL --- */
                                    <div className="flex gap-4 items-start">
                                        <button
                                            onClick={() => toggleTask(task)}
                                            disabled={!task.can.edit}
                                            className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-[#6B4E9B] border-[#6B4E9B]' : 'border-[#6B4E9B] bg-transparent hover:bg-purple-100'}`}
                                        >
                                            {isCompleted && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </button>

                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${isCompleted ? 'line-through text-gray-400' : 'text-purple-900'}`}>
                                                {task.izena}
                                            </h3>

                                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                                <div className="flex items-center gap-1.5 text-purple-700/70">
                                                    <Users size={14} />
                                                    <span className="font-medium">
                                                        {task.arduradunak.length > 0 ? task.arduradunak.map(u => u.name).join(', ') : 'Inor ez'}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 font-bold ${late ? 'text-red-500' : 'text-purple-700/70'}`}>
                                                    <Calendar size={14} />
                                                    <span>{new Date(task.data).toLocaleDateString()}</span>
                                                    {late && <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded ml-1">Berandu!</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {task.can.edit && (
                                                <button onClick={() => startEdit(task)} className="p-2 text-purple-300 hover:text-purple-600 transition-colors">
                                                    <Pencil size={18} />
                                                </button>
                                            )}
                                            {task.can.delete && (
                                                <button onClick={() => deleteTask(task.id)} className="p-2 text-purple-200 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}

const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;