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
        $authId = Auth::id();
        $coordinadorId = $pisua->user_id;

        $gastuak = Gastuak::where('pisua_id', $pisua->id)
            ->with(['erosle', 'ordaintzaileak'])
            ->latest()
            ->get()
            ->map(function ($gastua) use ($authId, $coordinadorId) {
                return [
                    'id' => $gastua->id,
                    'izena' => $gastua->izena,
                    'totala' => $gastua->totala,
                    'egoera' => $gastua->egoera,
                    'created_at' => $gastua->created_at,
                    'user_erosle_id' => $gastua->user_erosle_id,
                    'erosle' => $gastua->erosle,
                    'ordaintzaileak' => $gastua->ordaintzaileak,
                    'can' => [
                        'edit' => ($authId === $gastua->user_erosle_id || $authId === $coordinadorId),
                        'delete' => ($authId === $gastua->user_erosle_id || $authId === $coordinadorId),
                    ]
                ];
            });

        return Inertia::render('Gastuak/myGastuak', [
            'gastuak' => $gastuak,
            'pisua' => $pisua
        ]);
    }

    public function toggleUserPayment(Pisua $pisua, Gastuak $gastua, $user)
    {
        $authId = Auth::id();

        // Permisos
        if ($authId != $pisua->user_id && $authId != $gastua->user_erosle_id && $authId != $user) {
            return back()->withErrors(['error' => 'Baimenik gabe.']);
        }

        $usuario = $gastua->ordaintzaileak()->where('user_id', $user)->first();

        if ($usuario) {
            $nuevoEstado = $usuario->pivot->egoera === 'ordaindua' ? 'ordaintzeko' : 'ordaindua';
            
            // Actualizar tabla pivot
            $gastua->ordaintzaileak()->updateExistingPivot($user, ['egoera' => $nuevoEstado]);

            // Forzar actualización del modelo en memoria para recalcular el total
            $gastua->refresh(); 

            // Recalcular estado global del gasto
            $pendientes = $gastua->ordaintzaileak()->wherePivot('egoera', 'ordaintzeko')->count();
            $gastua->update(['egoera' => $pendientes === 0 ? 'ordaindua' : 'ordaintzeko']);
        }

        // Importante: Volver mediante redirect para que Inertia actualice las props del frontend
        return redirect()->route('pisua.gastuak.index', $pisua->id);
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
        });

        return redirect()->route('pisua.gastuak.index', $pisua->id)->with('success', 'Gastua ondo gorde da!');
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

            $userIds = $validated['partaideak'] ?? $gastua->ordaintzaileak->pluck('id')->toArray();
            $cuota = round($validated['totala'] / count($userIds), 2);

            $pivotData = [];
            foreach ($userIds as $userId) {
                $existing = $gastua->ordaintzaileak()->where('user_id', $userId)->first();
                $pivotData[$userId] = [
                    'kopurua' => $cuota,
                    'egoera' => $existing ? $existing->pivot->egoera : 'ordaintzeko'
                ];
            }
            $gastua->ordaintzaileak()->sync($pivotData);

            $pendientes = $gastua->ordaintzaileak()->wherePivot('egoera', 'ordaintzeko')->count();
            $gastua->update(['egoera' => $pendientes === 0 ? 'ordaindua' : 'ordaintzeko']);
        });

        return redirect()->back();
    }

    public function create(Pisua $pisua)
    {
        return Inertia::render('Gastuak/CreateGastuak', [
            'pisua' => $pisua,
            'usuarios' => $pisua->users
        ]);
    }

    public function destroy(Pisua $pisua, Gastuak $gastua)
    {
        if (Auth::id() === $gastua->user_erosle_id || Auth::id() === $pisua->user_id) {
            $gastua->delete();
            return back();
        }
        return back()->withErrors(['error' => 'Ezin duzu ezabatu.']);
    }
}