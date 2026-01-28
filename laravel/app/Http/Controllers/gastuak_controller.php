<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class gastuak_controller extends Controller
{
    public function index(Pisua $pisua)
    {
        // Verificar que el usuario sea el propietario del piso
        if ($pisua->user_id !== Auth::id()) {
            abort(403);
        }

        // TODO: Cargar gastuak cuando exista el modelo
        $gastuak = [];

        return Inertia::render('Gastuak/myGastuak', [
            'gastuak' => $gastuak,
            'pisua' => $pisua
        ]);
    }

    public function create(Pisua $pisua)
    {
        // TODO: Implementar formulario de creación
        return view('gastuak.create', compact('pisua'));
    }

    public function store(Request $request, Pisua $pisua)
    {
        // TODO: Implementar almacenamiento de gastos
        return redirect()->route('gastuak.index', $pisua);
    }

    public function update(Request $request, Pisua $pisua, $gastua)
    {
        // TODO: Implementar actualización de gastos
        return redirect()->route('gastuak.index', $pisua);
    }

    public function destroy(Pisua $pisua, $gastua)
    {
        // TODO: Implementar eliminación de gastos
        return redirect()->route('gastuak.index', $pisua);
    }
}
