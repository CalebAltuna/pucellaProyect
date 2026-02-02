<?php

namespace App\Http\Controllers;

use App\Models\Ataza;
use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Jobs\AtazakToOdoo;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    /**
     * Muestra la lista de tareas.
     * ACCESO: Cualquier miembro del piso.
     */
    public function index(Pisua $pisua)
    {
        // ✅ CAMBIO: Comprobamos si el usuario VIVE en el piso, no si es el dueño.
        if (!$pisua->users->contains(Auth::id())) {
            abort(403, 'Ez zara piso honetako kidea.');
        }

        $atazak = Ataza::with(['user', 'arduradunak'])
            ->where('pisua_id', $pisua->id)
            ->get();

        return Inertia::render('Tasks/MyTasks', [
            'atazak' => $atazak,
            'pisua' => $pisua
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva tarea.
     */
    public function create(Pisua $pisua)
    {
        // ✅ Seguridad básica: solo miembros pueden crear tareas
        if (!$pisua->users->contains(Auth::id())) {
            abort(403);
        }

        return Inertia::render('Tasks/CreateTask', [
            'pisua' => $pisua,
            'usuarios' => $pisua->users // Inquilinos para asignar como responsables
        ]);
    }

    /**
     * Guarda la nueva tarea.
     */
    public function store(Request $request, Pisua $pisua)
    {
        if (!$pisua->users->contains(Auth::id())) {
            abort(403);
        }

        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'data' => 'required|date',
            'arduradunak' => 'required|array',
            'arduradunak.*' => 'exists:users,id',
        ]);

        $ataza = Ataza::create([
            'izena' => $validated['izena'],
            'data' => $validated['data'],
            'pisua_id' => $pisua->id,
            'egoera' => 'egiteko',
            'user_id' => Auth::id(), // Creador de la tarea
        ]);

        $ataza->arduradunak()->sync($validated['arduradunak']);

        return redirect()->route('atazak.index', $pisua->id)
            ->with('success', 'Ataza ondo sortu da!');
    }

    /**
     * Actualiza la tarea y sincroniza con Odoo.
     */
    public function update(Request $request, Pisua $pisua, Ataza $ataza)
    {
        // ✅ Verificación de pertenencia
        if ($ataza->pisua_id !== $pisua->id || !$pisua->users->contains(Auth::id())) {
            abort(403);
        }

        $request->validate([
            'izena' => 'required|string|max:255',
            'arduradunak' => 'array',
            'arduradunak.*' => 'exists:users,id',
            'egoera' => 'required',
            'data' => 'required|date',
        ]);

        $ataza->update($request->only(['izena', 'egoera', 'data']));

        if ($request->has('arduradunak')) {
            $ataza->arduradunak()->sync($request->arduradunak);
        }

        // Job de sincronización
        AtazakToOdoo::dispatch($ataza);

        return redirect()->back()->with('success', 'Ataza eguneratu da!');
    }

    /**
     * Elimina la tarea.
     */
    public function destroy(Pisua $pisua, Ataza $ataza)
    {
        if ($ataza->pisua_id !== $pisua->id || !$pisua->users->contains(Auth::id())) {
            abort(403);
        }

        $ataza->delete();

        return redirect()->back()->with('success', 'Ataza ezabatu da!');
    }

    public function show(Pisua $pisua, Ataza $ataza)
    {
        if ($ataza->pisua_id !== $pisua->id) abort(404);

        return Inertia::render('Tasks/ShowTask', [
            'ataza' => $ataza->load(['user', 'arduradunak']),
            'pisua' => $pisua
        ]);
    }

    public function edit(Pisua $pisua, Ataza $ataza)
    {
        if ($ataza->pisua_id !== $pisua->id) abort(404);

        return Inertia::render('Tasks/EditTask', [
            'ataza' => $ataza->load('arduradunak'),
            'pisua' => $pisua,
            'usuarios' => $pisua->users
        ]);
    }
}