<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Jobs\SyncPisuaToOdoo;
use App\Jobs\SyncUserToOdoo;
use App\Services\OdooService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SyncEditPisuaToOdoo;

class PisoController extends Controller
{
    public function zurePisuak()
    {
        // lortu user-aren pisuak
        $pisuak = Pisua::where('user_id', Auth::id())->get();

        return Inertia::render('dashboard', [
            'pisuak' => $pisuak
        ]);
    }

    public function index(OdooService $odoo)
    {
        $pisuak = $odoo->search('pisua', ['name', 'code']);
        return Inertia::render('pisua/erakutsi', [
            'pisuak' => $pisuak
        ]);
    }

    public function create()
    {
        return Inertia::render('pisua/sortu');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:50',
        ]);

        // Asegurarse que el usuario actual exista en Odoo antes de crear el piso.
        $user = Auth::user();
        if ($user && !$user->synced) {
            try {
                // Ejecutar sincronización de usuario SÍNCRONA (no encolada)
                (new SyncUserToOdoo($user))->handle(app(OdooService::class));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'No se pudo sincronizar el usuario con Odoo: ' . $e->getMessage());
            }
        }

        $pisua = Pisua::create([
            'izena' => $validated['pisuaren_izena'],
            'kodigoa' => $validated['pisuaren_kodigoa'],
            'synced' => false,
            'user_id' => Auth::id()
        ]);

        // Ahora encolamos la sincronización del piso (puede ser asíncrona)
        SyncPisuaToOdoo::dispatch($pisua);

        // dashboard tras crear ( momentaneo )
        return redirect()->route('dashboard')->with('success', 'Piso creado y sincronización en proceso.');
    }

    public function edit(Pisua $pisua)
    {
        return Inertia::render('pisua/edit', compact('pisua'));
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

        return redirect()->route('dashboard')->with('success', 'Piso actualizado.');
    }

    public function destroy(Pisua $pisua)
    {
        $pisua->delete();
        return redirect()->route('dashboard');
    }
    public function showMyPisua(Pisua $pisua)
    {

        if ($pisua->user_id !== Auth::id()) {
            abort(403);
        }
        return Inertia::render('mypisua', [
            'pisua' => $pisua,
        ]);
    }
}
