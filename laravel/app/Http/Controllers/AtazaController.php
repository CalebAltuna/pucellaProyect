<?php

namespace App\Http\Controllers;

use App\Jobs\SyncAtazaToOdoo;
use App\Models\Ataza;
use App\Models\User;
use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Jobs\AtazakToOdoo;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    /**
     * Muestra la lista de tareas.
     */
    public function index(Pisua $pisua)
    {
        if ($pisua->user_id != Auth::id()) {
            abort(403);
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
     * Muestra el formulario para crear una nueva tarea (vía Inertia).
     */
    public function create(Pisua $pisua)
    {
        $usuarios = $pisua->users;
        return Inertia::render('Tasks/CreateTask', [
            'pisua' => $pisua,
            'usuarios' => $usuarios
        ]);
    }

    /**
     * Guarda la nueva tarea y dispara el Job de Odoo.
     */
    public function store(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'data' => 'required|date',
            'arduradunak' => 'required|array', // Array de IDs
            'arduradunak.*' => 'exists:users,id',
        ]);

        $ataza = Ataza::create([
            'izena' => $validated['izena'],
            'data' => $validated['data'],
            'pisua_id' => $pisua->id,
            'egoera' => 'egiteko',
            'user_id' => auth()->id(), // Asignamos el creador para evitar error de SQL
        ]);

        // Usamos el nombre exacto de la relación que pusiste en el modelo
        $ataza->arduradunak()->sync($validated['arduradunak']);

        return redirect()->back();
    }

    /**
     * CORREGIDO: Añadido Pisua $pisua antes de Ataza $ataza
     * para coincidir con la URL /pisua/{pisua}/.../{ataza}
     */
    public function update(Request $request, Pisua $pisua, Ataza $ataza)
    {
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

        AtazakToOdoo::dispatch($ataza);

        return redirect()->back()->with('success', 'Ataza eguneratu da eta Odoo sinkronizatzen ari da!');
    }

    /**
     * Elimina la tarea.
     */
    public function destroy(Pisua $pisua, Ataza $ataza)
    {
        // Verificar que la tarea pertenece a ese piso
        if ($ataza->pisua_id !== $pisua->id) {
            abort(404);
        }

        $ataza->delete();

        return redirect()->back()->with('success', 'Ataza ezabatu da!');
    }

    /**
     * CORREGIDO: Añadido Pisua $pisua (aunque no se use, debe estar por la URL)
     */
    public function show(Pisua $pisua, Ataza $ataza)
    {
        return Inertia::render('Tasks/ShowTask', [
            'ataza' => $ataza->load(['user', 'arduradunak']),
            'pisua' => $pisua
        ]);
    }

    /**
     * CORREGIDO: Añadido Pisua $pisua
     */
    public function edit(Pisua $pisua, Ataza $ataza)
    {
        return Inertia::render('Tasks/EditTask', [
            'ataza' => $ataza->load('arduradunak'),
            'pisua' => $pisua // Usamos el del parámetro
        ]);
    }
}
