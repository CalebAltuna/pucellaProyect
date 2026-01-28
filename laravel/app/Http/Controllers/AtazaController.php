<?php

namespace App\Http\Controllers;

use App\Models\Ataza;
use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    /**
     * Muestra la lista de tareas de un piso concreto.
     */
    public function index(Pisua $pisua)
    {
        // Seguridad: Verificar que el usuario pertenece al piso (o es el dueño)
        // Aquí podrías validar si Auth::id() es miembro del piso.
        
        // Obtenemos las tareas asociadas a este piso (si tienes la relación)
        // O simplemente las tareas del usuario por ahora.
        // Asumiendo que quieres ver las tareas creadas por el usuario:
        $atazak = Ataza::with(['user', 'arduraduna'])
                    ->where('user_id', Auth::id()) 
                    ->orderBy('created_at', 'desc')
                    ->get();

        return Inertia::render('Tasks/MyTasks', [
            'atazak' => $atazak,
            'pisua' => $pisua
        ]);
    }

    /**
     * Muestra el formulario React para crear una nueva tarea.
     */
    public function create(Pisua $pisua)
    {
        // Pasamos el objeto $pisua para poder volver atrás si cancelamos
        return Inertia::render('Tasks/Tasks_Create', [
            'pisua' => $pisua
        ]);
    }

    /**
     * Guarda la nueva tarea en la base de datos.
     */
    public function store(Request $request, Pisua $pisua)
    {
        // 1. Validamos los datos que vienen del formulario React
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',      // En React lo llamamos 'nombre'
            'responsable' => 'nullable|string|max:255', // En React lo llamamos 'responsable'
            'nota' => 'nullable|string',                // En React lo llamamos 'nota'
        ]);

        // 2. Creamos la tarea mapeando los nombres
        Ataza::create([
            'izena' => $validated['nombre'],         // BD: izena <- Form: nombre
            'user_id' => Auth::id(),                 // El creador es el usuario logueado
            'arduraduna_id' => Auth::id(),           // Por defecto asignamos al creador (o lógica extra para buscar ID por nombre)
            'egoera' => 'egiteko',                   // Estado inicial
            'data' => now(),                         // Fecha actual
            // Si tienes un campo 'nota' en la BD, añádelo aquí, si no, ignóralo
            // 'nota' => $validated['nota'] 
        ]);

        // 3. Redireccionamos de vuelta al listado de tareas de ESE piso
        return to_route('pisua.atazak.index', $pisua->id)
            ->with('success', 'Ataza ondo sortu da!');
    }

    /**
     * Actualiza la tarea (por ejemplo, cambiar estado de egiteko a eginda).
     */
    public function update(Request $request, Pisua $pisua, Ataza $ataza)
    {
        // Validamos solo lo que nos llega (a veces solo llega el estado)
        $validated = $request->validate([
            'izena' => 'sometimes|string|max:255',
            'egoera' => 'sometimes|string',
        ]);

        $ataza->update($validated);

        // Volvemos al listado manteniendo la posición del scroll (Inertia lo maneja)
        return to_route('pisua.atazak.index', $pisua->id);
    }

    /**
     * Elimina una tarea.
     */
    public function destroy(Pisua $pisua, Ataza $ataza)
    {
        $ataza->delete();

        return to_route('pisua.atazak.index', $pisua->id)
            ->with('success', 'Ataza ezabatu da!');
    }
}