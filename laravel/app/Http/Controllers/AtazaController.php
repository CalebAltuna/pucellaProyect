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
     */
    public function index(Pisua $pisua)
    {
        // Solo permitimos ver tareas si el usuario pertenece al piso
        if ($pisua->user_id != Auth::id()) {
            abort(403);
        }

        $atazak = Ataza::with(['user', 'arduradunak']) // Cambiado a plural
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
    public function create()
    {
        return view('atazak.create');
    }

    /**
     * Guarda la nueva tarea en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'izena' => 'required|string|max:255',
            'pisua_id' => 'required|exists:pisua,id',
            'arduradunak' => 'required|array',
            'arduradunak.*' => 'exists:users,id',
            'data' => 'required|date',
        ]);

        $ataza = Ataza::create([
            'izena' => $request->izena,
            'pisua_id' => $request->pisua_id,
            'user_id' => Auth::id(),
            'data' => $request->data,
            'egoera' => 'egiteko',
        ]);

        $ataza->arduradunak()->sync($request->arduradunak);

        // --- AQUÍ VA EL JOB ---
        AtazakToOdoo::dispatch($ataza);
        // -----------------------

        return redirect()->back()->with('success', 'Ataza ondo gorde da eta Odoo-rekin sinkronizatzen ari da!');
    }

    public function destroy(Ataza $ataza)
    {
        $ataza->delete();
        return redirect()->back()->with('success', 'Ataza ezabatu da!');
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
    /**
     * Actualiza la tarea en la base de datos y sincroniza con Odoo.
     */
    public function update(Request $request, Ataza $ataza)
    {
        $request->validate([
            'izena' => 'required|string|max:255',
            'arduradunak' => 'array',
            'arduradunak.*' => 'exists:users,id',
            'egoera' => 'required', // Laravel valida automáticamente contra tu Enum
            'data' => 'required|date',
        ]);

        // 1. Actualizamos los campos básicos de la tarea
        $ataza->update($request->only(['izena', 'egoera', 'data']));

        // 2. Actualizamos la lista de responsables en la tabla pivote
        if ($request->has('arduradunak')) {
            $ataza->arduradunak()->sync($request->arduradunak);
        }

        // 3. Disparamos el Job para que Odoo actualice la tarea
        AtazakToOdoo::dispatch($ataza);

        return redirect()->back()->with('success', 'Ataza eguneratu da eta Odoo sinkronizatzen ari da!');
    }
}
