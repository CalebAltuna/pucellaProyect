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
        //arduradunak array
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'arduradunak' => 'required|array|min:1',
            'arduradunak.*' => 'exists:users,id',
            'data' => 'required|date',
        ]);
        // ataza sortzen du
        $ataza = Ataza::create([
            'izena' => $validated['izena'],
            'user_id' => $request->arduraduna_id, // para asignar al responsable de task
            'pisua_id' => $pisua->id,
            'data' => $validated['data'],
            'egoera' => 'egiteko',
        ]);

        $ataza->arduradunak()->attach($validated['arduradunak']);

        return redirect()->route('atazak.index', $pisua->id)
            ->with('success', 'Ataza ondo gorde da!');
    }

    public function update(Request $request, Ataza $ataza)
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
        //Verificar que la tarea pertenece a ese piso
        if ($ataza->pisua_id !== $pisua->id) {
            abort(404);
        }

        $ataza->delete();
        
        return redirect()->back()->with('success', 'Ataza ezabatu da!');
    }

    /**
     * Muestra una tarea específica (vía Inertia).
     */
    public function show(Ataza $ataza)
    {
        return Inertia::render('Tasks/ShowTask', [
            'ataza' => $ataza->load(['user', 'arduradunak'])
        ]);
    }

    /**
     * Formulario de edición (vía Inertia).
     */
    public function edit(Ataza $ataza)
    {
        return Inertia::render('Tasks/EditTask', [
            'ataza' => $ataza->load('arduradunak'),
            'pisua' => $ataza->pisua
        ]);
    }
}
