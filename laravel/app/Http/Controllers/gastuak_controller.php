<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Models\Gastuak;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
            'usuarios' => $pisua->users // ENVIAMOS 'usuarios' PARA QUE EL REACT LO ENTIENDA
        ]);
    }

    public function store(Request $request, Pisua $pisua)
    {
        // 1. Validamos exactamente lo que envía el formulario de React
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'totala' => 'required|numeric|min:0.01',
            'oharrak' => 'nullable|string',
            'partaideak' => 'required|array|min:1', // Debe ser un array de IDs
        ]);

        // 2. Usamos Transaction: Si algo falla, no guarda nada (evita datos basura)
        DB::transaction(function () use ($validated, $pisua) {

            // A. Crear el Gasto Principal
            $gastua = Gastuak::create([
                'izena' => $validated['izena'],
                'totala' => $validated['totala'],
                'oharrak' => $validated['oharrak'] ?? null,
                'pisua_id' => $pisua->id,
                'user_erosle_id' => Auth::id(), // El usuario logueado es el que compra
                'egoera' => 'ordaintzeko',
            ]);

            // B. Calcular la división
            $cantidadParticipantes = count($validated['partaideak']);
            $cuota = round($validated['totala'] / $cantidadParticipantes, 2);

            // C. Preparar los datos para la tabla intermedia
            $pivotData = [];
            foreach ($validated['partaideak'] as $userId) {
                // Si yo compro y estoy en la lista, mi parte consta como 'pagada' (ordaindua)
                // Si es otro usuario, consta como 'pendiente' (ordaintzeko)
                $estadoInicial = ($userId == Auth::id()) ? 'ordaindua' : 'ordaintzeko';

                $pivotData[$userId] = [
                    'kopurua' => $cuota,
                    'egoera' => $estadoInicial
                ];
            }

            // D. Guardar relaciones
            $gastua->ordaintzaileak()->attach($pivotData);

            // E. Actualizar estado global si ya está todo pagado (ej: compra individual)
            $pendientes = $gastua->ordaintzaileak()->wherePivot('egoera', 'ordaintzeko')->count();
            if ($pendientes === 0) {
                $gastua->update(['egoera' => 'ordaindua']);
            }
        });

        // 3. Redirigir al Index para ver el resultado
        return redirect()->route('pisua.gastuak.index', $pisua->id)
            ->with('success', 'Gastua ondo gorde da!');
    }

        public function toggleUserPayment(Pisua $pisua, Gastuak $gastua, $userId)
    {
        $authId = Auth::id();
        $coordinadorId = $pisua->user_id;
        $creadorId = $gastua->user_erosle_id;

        $tienePermiso = ($authId === $coordinadorId) ||
            ($authId === $creadorId) ||
            ($authId == $userId);

        if (!$tienePermiso) {
            return back()->withErrors(['error' => 'Ez daukazu baimenik egoera hau aldatzeko.']);
        }
        $usuarioEnPivote = $gastua->ordaintzaileak()->where('user_id', $userId)->first();

        if (!$usuarioEnPivote) {
            return back()->withErrors(['error' => 'Erabiltzailea ez da gastu honen parte.']);
        }

        $nuevoEstado = $usuarioEnPivote->pivot->egoera === 'ordaindua' ? 'ordaintzeko' : 'ordaindua';

        $gastua->ordaintzaileak()->updateExistingPivot($userId, ['egoera' => $nuevoEstado]);

        $pendientes = DB::table('gastu_user')
            ->where('gastuak_id', $gastua->id)
            ->where('egoera', 'ordaintzeko')
            ->count();

        $gastua->update(['egoera' => $pendientes === 0 ? 'ordaindua' : 'ordaintzeko']);

        return back();
    }

    public function destroy(Pisua $pisua, Gastuak $gastua)
    {
        $gastua->delete();
        return redirect()->route('pisua.gastuak.index', $pisua)->with('success', 'Gastua ezabatu da!');
    }
}
