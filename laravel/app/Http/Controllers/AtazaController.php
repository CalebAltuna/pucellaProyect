<?php

namespace App\Http\Controllers;

use App\Jobs\SyncAtazaToOdoo;
use App\Models\Ataza;
use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    /**
     * Muestra la lista de tareas.
     */
    public function index(Pisua $pisua)
    {
        // Verificar que el usuario sea el propietario del piso
        if ($pisua->user_id !== Auth::id()) {
            abort(403);
        }
        // tareas del usuario logueado
        $atazak = Ataza::with(['user', 'arduraduna'])->where('user_id', Auth::id())->get();

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
        return Inertia::render(component: 'Tasks/sortu', ['pisua' => $pisua]);
    }

    /**
     * Guarda la nueva tarea en la base de datos.
     */
    public function store(Request $request, Pisua $pisua)
    {
        // 1. Validamos que los datos vengan bien
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'egilea' => 'required|string|max:255',
            'arduraduna' => 'required|string|max:255',
        ]);

        // 2. Creamos la tarea usando asignación masiva
        $ataza = Ataza::create([
            'izena' => $validated['izena'],
            'egilea' => $validated['egilea'],
            'arduraduna' => $validated['arduraduna'],
            'pisua_id' => $pisua->id,
        ]);

        SyncAtazaToOdoo::dispatch($ataza);


        // 3. Redireccionamos al listado
        return redirect()->route('atazak.index')
            ->with('success', 'Ataza ondo gorde da!');
    }

    /**
     * Muestra una tarea específica.
     */
    public function show(Ataza $ataza)
    {
        return view('atazak.show', compact('ataza'));
    }

    public function edit(Ataza $ataza)
    {
        return view('atazak.edit', compact('ataza'));
    }

    /**
     * Actualiza la tarea en la base de datos.
     */
    public function update(Request $request, Ataza $ataza)
    {
        $request->validate([
            'izena' => 'required|string|max:255',
            'egilea' => 'required|string|max:255',
            'arduraduna' => 'required|string|max:255',
            'egoera' => 'required|string',
        ]);

        // Actualizamos
        $ataza->update($request->all());

        return redirect()->route('atazak.index')
            ->with('success', 'Ataza eguneratu da!');
    }


    //ataza kentzeko
    public function destroy(Ataza $ataza)
    {
        $ataza->delete();

        return redirect()->route('atazak.index')
            ->with('success', 'Ataza ezabatu da!');
    }
}
