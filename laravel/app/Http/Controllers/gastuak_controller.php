<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Models\Gastuak;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class gastuak_controller extends Controller
{
    public function index(Pisua $pisua)
    {
        return Inertia::render('Gastuak/myGastuak', [
            'gastuak' => Gastuak::where('pisua_id', $pisua->id)
                ->with(['erosle', 'ordaintzaileak'])
                ->latest()
                ->get(),
            'pisua' => $pisua
        ]);
    }

    public function create(Pisua $pisua)
    {
        return Inertia::render('Gastuak/CreateGastuak', [
            'pisua' => $pisua,
            'usuarios' => $pisua->users // Pasamos los usuarios para el reparto
        ]);
    }

public function store(Request $request, Pisua $pisua)
{
    $validated = $request->validate([
        'izena' => 'required|string|max:255',
        'totala' => 'required|numeric|min:0.01',
        'reparto_tipo' => 'required|in:denak,eskuz', // 'denak' = todos, 'eskuz' = manual
        'reparto' => 'nullable|array', // Solo obligatorio si es 'eskuz'
    ]);
    DB::transaction(function () use ($validated, $pisua, $request) {
        $gastua = Gastuak::create([
            'izena' => $validated['izena'],
            'totala' => $validated['totala'],
            'pisua_id' => $pisua->id,
            'user_erosle_id' => auth()->id(),
            'egoera' => 'ordaintzeko',
        ]);

        $pivotData = [];
        $usuarios = $pisua->users;
        if ($request->reparto_tipo === 'denak') {
            // REPARTO EQUITATIVO
            $cuota = round($validated['totala'] / $usuarios->count(), 2);
            foreach ($usuarios as $user) {
                $pivotData[$user->id] = [
                    'kopurua' => $cuota,
                    'egoera' => 'ordaintzeko'
                ];
            }
        } else {
            // REPARTO MANUAL
            foreach ($validated['reparto'] as $userId => $kopurua) {
                if ($kopurua > 0) {
                    $pivotData[$userId] = [
                        'kopurua' => $kopurua,
                        'egoera' => 'ordaintzeko'
                    ];
                }
            }
        }
        $gastua->ordaintzaileak()->attach($pivotData);
    });
    return redirect()->route('pisua.gastuak.index', $pisua);
}
    // Nuevo método para cambiar el estado de pago de un usuario individual
    public function toggleUserPayment(Pisua $pisua, Gastuak $gastua, $userId)
    {
        $usuario = $gastua->ordaintzaileak()->where('user_id', $userId)->firstOrFail();
        $nuevoEstado = $usuario->pivot->egoera === 'ordaindua' ? 'ordaintzeko' : 'ordaindua';

        $gastua->ordaintzaileak()->updateExistingPivot($userId, ['egoera' => $nuevoEstado]);

        // Si todos han pagado, el gasto general se marca como pagado
        $pendientes = $gastua->ordaintzaileak()->wherePivot('egoera', 'ordaintzeko')->count();
        $gastua->update(['egoera' => $pendientes === 0 ? 'ordaindua' : 'ordaintzeko']);

        return back();
    }

    public function destroy(Pisua $pisua, Gastuak $gastua)
    {
        $gastua->delete();
        return redirect()->route('pisua.gastuak.index', $pisua)->with('success', 'Gastua ezabatu da!');
    }
}
