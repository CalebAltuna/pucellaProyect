<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Models\Gastuak;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SyncGastuakToOdoo;
class gastuak_controller extends Controller
{
    public function index(Pisua $pisua)
    {
        $authId = Auth::id();
        $coordinadorId = $pisua->user_id;

        $gastuak = Gastuak::where('pisua_id', $pisua->id)
            ->with(['erosle', 'ordaintzaileak'])
            ->latest()
            ->get()
            ->map(function ($gastua) use ($authId, $coordinadorId) {
                return array_merge($gastua->toArray(), [
                    'can' => [
                        'edit' => ($authId === $gastua->user_erosle_id || $authId === $coordinadorId),
                        'delete' => ($authId === $gastua->user_erosle_id || $authId === $coordinadorId),
                    ]
                ]);
            });

        return Inertia::render('Gastuak/myGastuak', [
            'gastuak' => $gastuak,
            'pisua' => $pisua
        ]);
    }

    public function store(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'totala' => 'required|numeric|min:0.01',
            'oharrak' => 'nullable|string',
            'partaideak' => 'required|array|min:1',
        ]);

        DB::transaction(function () use ($validated, $pisua) {
            $gastua = Gastuak::create([
                'izena' => $validated['izena'],
                'totala' => $validated['totala'],
                'oharrak' => $validated['oharrak'] ?? null,
                'pisua_id' => $pisua->id,
                'user_erosle_id' => Auth::id(),
                'egoera' => 'ordaintzeko',
            ]);

            $cuota = round($validated['totala'] / count($validated['partaideak']), 2);

            $pivotData = [];
            foreach ($validated['partaideak'] as $userId) {
                $pivotData[$userId] = [
                    'kopurua' => $cuota,
                    'egoera' => ($userId == Auth::id()) ? 'ordaindua' : 'ordaintzeko'
                ];
            }
            $gastua->ordaintzaileak()->attach($pivotData);

            // <--- 2. AÑADIDO: Sincronizar con Odoo al crear
            SyncGastuakToOdoo::dispatch($gastua);
        });

        return redirect("/pisua/{$pisua->id}/kudeatu/gastuak");

    }

    public function update(Request $request, Pisua $pisua, Gastuak $gastua)
    {
        $authId = Auth::id();
        if ($authId !== $gastua->user_erosle_id && $authId !== $pisua->user_id) {
            return back()->withErrors(['error' => 'Ez daukazu baimenik.']);
        }

        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'totala' => 'required|numeric|min:0.01',
            'partaideak' => 'nullable|array',
        ]);

        DB::transaction(function () use ($validated, $gastua) {
            $gastua->update([
                'izena' => $validated['izena'],
                'totala' => $validated['totala'],
            ]);

            // Obtenemos estados actuales directamente para no perder quién ha pagado
            $estadosActuales = DB::table('gastu_user')
                ->where('gastuak_id', $gastua->id)
                ->pluck('egoera', 'user_id')
                ->toArray();

            $userIds = $validated['partaideak'] ?? array_keys($estadosActuales);

            if (count($userIds) > 0) {
                $cuota = round($validated['totala'] / count($userIds), 2);
                $pivotData = [];

                foreach ($userIds as $userId) {
                    // Si el usuario ya estaba, mantenemos su estado. Si es nuevo, 'ordaintzeko'.
                    $estadoRecuperado = $estadosActuales[$userId] ?? 'ordaintzeko';

                    $pivotData[$userId] = [
                        'kopurua' => $cuota,
                        'egoera' => (string) $estadoRecuperado, // Casteo a string para evitar nulos
                    ];
                }

                $gastua->ordaintzaileak()->sync($pivotData);
            }

            $gastua->refresh();
            $pendientes = $gastua->ordaintzaileak()->wherePivot('egoera', 'ordaintzeko')->count();
            $gastua->update(['egoera' => $pendientes === 0 ? 'ordaindua' : 'ordaintzeko']);

            // <--- 3. AÑADIDO: Sincronizar con Odoo al actualizar
            SyncGastuakToOdoo::dispatch($gastua);
        });

        return redirect()->back();
    }

    public function toggleUserPayment(Pisua $pisua, Gastuak $gastua, $userId)
    {
        $authId = Auth::id();
        if ($authId != $pisua->user_id && $authId != $gastua->user_erosle_id && $authId != $userId) {
            return back()->withErrors(['error' => 'Baimenik gabe.']);
        }

        // Cargamos explícitamente el pivot para evitar el error de SQLite
        $usuario = $gastua->ordaintzaileak()->where('user_id', $userId)->first();

        if ($usuario && $usuario->pivot) {
            $nuevoEstado = $usuario->pivot->egoera === 'ordaindua' ? 'ordaintzeko' : 'ordaindua';

            $gastua->ordaintzaileak()->updateExistingPivot($userId, [
                'egoera' => $nuevoEstado
            ]);

            $gastua->refresh();
            $pendientes = $gastua->ordaintzaileak()->wherePivot('egoera', 'ordaintzeko')->count();
            $gastua->update(['egoera' => $pendientes === 0 ? 'ordaindua' : 'ordaintzeko']);
        }

        return back();
    }

    public function destroy(Pisua $pisua, Gastuak $gastua)
    {
        if (Auth::id() === $gastua->user_erosle_id || Auth::id() === $pisua->user_id) {
            $gastua->delete();
            return back();
        }
        return back()->withErrors(['error' => 'Ezin duzu ezabatu.']);
    }

    public function create(Pisua $pisua)
    {
        return Inertia::render('Gastuak/CreateGastuak', [
            'pisua' => $pisua,
            'usuarios' => $pisua->users
        ]);
    }
}
