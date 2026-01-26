<?php

namespace App\Http\Controllers;

use App\Models\Ataza;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    /**
     * Muestra la lista de tareas.
     */
    public function index()
    {
        // Obtiene todas las tareas de la base de datos
        $atazak = Ataza::where('user_id', Auth::id())->get();
        return Inertia::render('Tasks/MyTasks', [
            'atazak' => $atazak
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
        // 1. Validamos que los datos vengan bien
        $request->validate([
            'izena' => 'required|string|max:255',
            'egilea' => 'required|string|max:255',
            'arduraduna' => 'required|string|max:255',
        ]);

        // 2. Creamos la tarea usando asignación masiva
        Ataza::create($request->all());

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
