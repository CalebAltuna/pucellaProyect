<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Models\Gastuak;
use App\Services\OdooService; // Importamos tu servicio
use Illuminate\Http\Request;

class gastuak_controller extends Controller
{
     public function index()
    {
        // Quitamos el 'where'. Ahora trae todo.
        // Mantenemos 'with' para cargar los nombres de los usuarios y evitar muchas consultas SQL.
        $gastuenZerrenda = Gastuak::with(['user', 'arduraduna'])->get();

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
        $request->validate([
            'izena'            => 'required|string|max:255',
            'deskribapena'     => 'nullable|string',
            'gastu_mota'       => 'required|string',
            'user_erosle_id'   => 'required|integer',
            'user_partaide_id' => 'required|integer',
            'totala'           => 'required|numeric',
        ]);

        Gastuak::create($request->all());

        return redirect()->route('gastuak.index')
                         ->with('success', 'Gastua ondo gorde da!');
    }

    /**
     * Muestra un gasto específico.
     */
    public function show(Gastuak $gastua)
    {
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
        $request->validate([
            'izena'            => 'required|string|max:255',
            'deskribapena'     => 'nullable|string',
            'gastu_mota'       => 'required|string',
            'user_erosle_id'   => 'required|integer',
            'user_partaide_id' => 'required|integer',
            'totala'           => 'required|numeric',
        ]);

        $gastua->update($request->all());

        return redirect()->route('gastuak.index')
                         ->with('success', 'Gastua eguneratu da!');
    }

    /**
     * Elimina el gasto de la base de datos.
     */
    public function destroy(Gastuak $gastua)
    {

        $gastua->delete();

        return redirect()->route('gastuak.index')
                         ->with('success', 'Gastua ezabatu da!');
    }
}