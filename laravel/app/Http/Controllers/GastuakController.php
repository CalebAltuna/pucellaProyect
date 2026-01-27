<?php

namespace App\Http\Controllers;

use App\Models\Gastuak; // Importamos el modelo correcto
use Illuminate\Http\Request;

class GastuakController extends Controller
{
    /**
     * Muestra la lista de gastos.
     */
    public function index()
    {
        // Obtenemos todos los gastos
        $gastuenZerrenda = Gastuak::all(); 
        
        // Retornamos la vista pasando los datos
        return view('gastuak.index', compact('gastuenZerrenda'));
    }

    /**
     * Muestra el formulario para crear un nuevo gasto.
     */
    public function create()
    {
        return view('gastuak.create');
    }

    /**
     * Guarda el nuevo gasto en la base de datos.
     */
    public function store(Request $request)
    {
        // 1. Validamos los datos según los campos de tu modelo Gastuak
        $request->validate([
            'izena'            => 'required|string|max:255',
            'deskribapena'     => 'nullable|string',
            'gastu_mota'       => 'required|string',
            'user_erosle_id'   => 'required|integer',
            'user_partaide_id' => 'required|integer',
            'totala'           => 'required|numeric',
        ]);

        // 2. Creamos el gasto usando asignación masiva ($fillable en el modelo)
        Gastuak::create($request->all());

        // 3. Redireccionamos al listado con un mensaje de éxito
        return redirect()->route('gastuak.index')
                         ->with('success', 'Gastua ondo gorde da!'); // "¡Gasto guardado bien!"
    }

    /**
     * Muestra un gasto específico.
     */
    public function show(Gastuak $gastua)
    {
        // Usamos Route Model Binding (pasamos el objeto directamente)
        return view('gastuak.show', compact('gastua'));
    }

    /**
     * Muestra el formulario para editar un gasto.
     */
    public function edit(Gastuak $gastua)
    {
        return view('gastuak.edit', compact('gastua'));
    }

    /**
     * Actualiza el gasto en la base de datos.
     */
    public function update(Request $request, Gastuak $gastua)
    {
        // Validamos (usando 'sometimes' o repitiendo reglas)
        $request->validate([
            'izena'            => 'required|string|max:255',
            'deskribapena'     => 'nullable|string',
            'gastu_mota'       => 'required|string',
            'user_erosle_id'   => 'required|integer',
            'user_partaide_id' => 'required|integer',
            'totala'           => 'required|numeric',
        ]);

        // Actualizamos con los nuevos datos
        $gastua->update($request->all());

        return redirect()->route('gastuak.index')
                         ->with('success', 'Gastua eguneratu da!'); // "¡Gasto actualizado!"
    }

    /**
     * Elimina el gasto de la base de datos.
     */
    public function destroy(Gastuak $gastua)
    {
        $gastua->delete();

        return redirect()->route('gastuak.index')
                         ->with('success', 'Gastua ezabatu da!'); // "¡Gasto borrado!"
    }
}