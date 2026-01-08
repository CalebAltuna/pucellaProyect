<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Jobs\SyncPisuaToOdoo;
use App\Models\Pisua; // Asegúrate de importar el modelo

class PisuaController extends Controller
{
    public function create()
    {
        return Inertia::render('pisua/sortu');
    }

    public function store(Request $request) // Faltaba el parámetro Request
    {
        $validatedData = $request->validate([
            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:255',
        ]);


        $pisua = Pisua::create([
            'izena' => $validatedData['pisuaren_izena'],
            'kodigoa' => $validatedData['pisuaren_kodigoa'],
            'user_id' => auth()->id(), // Asignar el usuario autenticado como coordinador
        ]);
        SyncPisuaToOdoo::dispatch($pisua);
    }
}
