<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Jobs\SyncPisuaToOdoo;
use App\Services\OdooService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SyncEditPisuaToOdoo;

class PisoController extends Controller
{

    public function index(OdooService $odoo)
    {
        $pisuak = $odoo->search('pisua', ['name', 'code']);
        return Inertia::render('pisua/erakutsi', [
            'pisuak' => $pisuak
        ]);
    }

    public function edit(Pisua $pisua)
    {
        return Inertia::render('pisua/edit', compact('pisua'));
    }

    // Muestra la vista Blade
    public function create()
    {
        return Inertia::render('pisua/sortu');
    }

    public function update(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([
            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:50',
        ]);

        $pisua->update([
            'izena' => $validated['pisuaren_izena'],
            'kodigoa' => $validated['pisuaren_kodigoa'],
            'synced' => false
        ]);
        SyncEditPisuaToOdoo::dispatch($pisua);

        return redirect()->route('pisua.index')->with('success', 'Piso actualizado y sincronización en proceso.');
    }
    // Procesa el formulario
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:50',
        ]);

        $pisua = Pisua::create([
            'izena' => $validated['pisuaren_izena'],
            'kodigoa' => $validated['pisuaren_kodigoa'],
            'synced' => false,
            'user_id' => Auth::id()
        ]);

        SyncPisuaToOdoo::dispatch($pisua);

        return redirect()->route('pisua.index')->with('success', 'Piso creado y sincronización en proceso.');
    }
}
