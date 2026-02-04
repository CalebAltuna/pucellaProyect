import React, { useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/components/app-header';
import { Pencil, Trash2, Check, X, Loader2, Calendar, Users, Plus, AlertCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Ataza {
    id: number;
    izena: string;
    egoera: string;
    data: string;
    data_formatted: string;
    arduradunak: User[];
    can: {
        edit: boolean;
        delete: boolean;
    };
}

interface ExtendedProps extends PageProps {
    atazak: Ataza[];
    kideak: User[];
    pisua: { id: number; izena: string };
}

export default function MyTasks() {
    const { atazak, kideak, pisua } = usePage<ExtendedProps>().props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const baseUrl = `/pisua/${pisua?.id}/kudeatu/atazak`;

    const { data, setData, put, processing, reset, clearErrors } = useForm({
        izena: '',
        data: '',
        egoera: '',
        arduradunak: [] as number[],
    });

    // --- LÓGICA DE ORDENACIÓN (Sin cambios) ---
    const sortedAtazak = [...atazak].sort((a, b) => {
        const statusA = a.egoera === 'eginda' ? 1 : 0;
        const statusB = b.egoera === 'eginda' ? 1 : 0;
        if (statusA !== statusB) return statusA - statusB;
        return new Date(a.data).getTime() - new Date(b.data).getTime();
    });

    const startEdit = (task: Ataza) => {
        clearErrors();
        setEditingId(task.id);
        setData({
            izena: task.izena,
            data: task.data,
            egoera: task.egoera,
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

    const isLate = (d: string) => {
        if (!d) return false;
        return new Date(d).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Nire Pisua', href: `/pisua/${pisua?.id}/kudeatu` },
            { title: 'Atazak', href: baseUrl }
        ]}>
            <Head title="Atazak" />

            <div className="py-8 max-w-4xl mx-auto px-4">
                {/* HEADER SECTION */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-purple-800 tracking-tight">
                            {pisua ? `Atazak: ${pisua.izena}` : 'Atazak'}
                        </h1>
                    </div>
                    <Link
                        href={`${baseUrl}/create`}
                        className="bg-[#6B4E9B] hover:bg-[#5a4182] text-white px-5 py-2 rounded-lg shadow-sm transition-all font-bold flex items-center gap-2 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Ataza berria
                    </Link>
                </div>

                {/* TASKS LIST */}
                <div className="space-y-4">
                    {sortedAtazak.map((task) => {
                        const isEditing = editingId === task.id;
                        const isCompleted = task.egoera === 'eginda';
                        const late = !isCompleted && isLate(task.data);

                        return (
                            <div
                                key={task.id}
                                className={`rounded-xl p-5 border transition-all duration-300 ${
                                    isCompleted
                                    ? 'bg-white border-gray-200 opacity-90 shadow-none'
                                    : 'bg-purple-50 border-purple-100 shadow-sm'
                                }`}
                            >
                                {isEditing ? (
                                    <form onSubmit={(e) => saveEdit(e, task.id)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50/50 rounded-lg border-t border-dashed border-purple-200">
                                            <div>
                                                <label className="text-[10px] font-bold text-purple-700/60 uppercase tracking-wider">Izena</label>
                                                <input type="text" value={data.izena} onChange={e => setData('izena', e.target.value)} className="w-full border-purple-200 rounded-lg focus:ring-[#6B4E9B] focus:border-[#6B4E9B] text-sm mt-1 bg-white" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-purple-700/60 uppercase tracking-wider">Data</label>
                                                <input type="date" value={data.data} onChange={e => setData('data', e.target.value)} className="w-full border-purple-200 rounded-lg focus:ring-[#6B4E9B] focus:border-[#6B4E9B] text-sm mt-1 bg-white" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-purple-700/60 uppercase tracking-wider">Arduradunak</label>
                                                <select multiple value={data.arduradunak.map(String)} onChange={e => setData('arduradunak', Array.from(e.target.selectedOptions, o => parseInt(o.value)))} className="w-full border-purple-200 rounded-lg focus:ring-[#6B4E9B] text-sm mt-1 bg-white min-h-[80px]" size={3}>
                                                    {kideak.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={cancelEdit} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"><X size={20} /></button>
                                            <button type="submit" disabled={processing} className="px-4 py-2 bg-[#6B4E9B] text-white rounded-lg font-bold text-sm shadow-sm flex items-center gap-2">
                                                {processing ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} strokeWidth={3} /> Gorde</>}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex gap-4 items-start group">
                                        {/* Checkbox circular interactivo */}
                                        <button
                                            onClick={() => toggleTask(task)}
                                            disabled={!task.can.edit}
                                            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                isCompleted
                                                ? 'bg-[#6B4E9B] border-[#6B4E9B]'
                                                : 'bg-white border-purple-300 hover:border-[#6B4E9B]'
                                            }`}
                                        >
                                            {isCompleted && <Check size={14} className="text-white" strokeWidth={4} />}
                                        </button>

                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold transition-all ${isCompleted ? 'line-through text-gray-400' : 'text-purple-900'}`}>{task.izena}</h3>

                                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                                <div className="flex items-center gap-1.5 text-purple-700/60">
                                                    <div className="p-1 bg-purple-100 rounded-full">
                                                        <Users size={12} className="text-purple-700" />
                                                    </div>
                                                    <span className="font-medium">{task.arduradunak.map(u => u.name).join(', ') || 'Inor ez'}</span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 font-bold ${late ? 'text-amber-700' : 'text-purple-700/60'}`}>
                                                    <div className={`p-1 rounded-full ${late ? 'bg-amber-100' : 'bg-purple-100'}`}>
                                                        <Calendar size={12} className={late ? 'text-amber-700' : 'text-purple-700'} />
                                                    </div>
                                                    <span>{task.data_formatted}</span>
                                                    {late && (
                                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tight flex items-center gap-1 ml-1 animate-pulse">
                                                            <AlertCircle size={10} /> Berandu!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {task.can.edit && (
                                                <button onClick={() => startEdit(task)} className="p-2 text-purple-300 hover:text-purple-600 hover:bg-purple-100 rounded-lg"><Pencil size={18} /></button>
                                            )}
                                            {task.can.delete && (
                                                <button onClick={() => deleteTask(task.id)} className="p-2 text-purple-200 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
