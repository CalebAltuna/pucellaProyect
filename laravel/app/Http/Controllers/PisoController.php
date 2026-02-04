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
use Illuminate\Support\Facades\DB;

class PisoController extends Controller
{
    /**
     * Muestra los pisos donde el usuario es MIEMBRO (creador o invitado).
     */
    public function zurePisuak()
    {
        // ✅ CORRECCIÓN: Usamos la relación pisuak() del modelo User 
        // para obtener todos los pisos de la tabla pivote.
        $pisuak = Auth::user()->pisuak()->get();

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

    /**
     * Crea un piso y vincula automáticamente al creador como miembro.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pisuaren_izena' => 'required|string|max:255',
            'pisuaren_kodigoa' => 'required|string|max:50',
        ]);

        $user = Auth::user();

        // Sincronización previa del usuario con Odoo si no lo está
        if ($user && !$user->synced) {
            try {
                (new SyncUserToOdoo($user))->handle(app(OdooService::class));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Odoo sinkronizazio akatsa: ' . $e->getMessage());
            }
        }

        // ✅ Usamos una transacción para asegurar que se crea el piso Y el vínculo
        $pisua = DB::transaction(function () use ($validated, $user) {
            $nuevoPisua = Pisua::create([
                'izena' => $validated['pisuaren_izena'],
                'kodigoa' => $validated['pisuaren_kodigoa'],
                'synced' => false,
                'user_id' => $user->id // Sigue siendo el "owner" para Odoo
            ]);

            // ✅ VINCULACIÓN: Añadir al creador a la tabla pivote pisua_user
            $nuevoPisua->users()->attach($user->id);

            return $nuevoPisua;
        });

        SyncPisuaToOdoo::dispatch($pisua);

        return redirect()->route('dashboard')->with('success', 'Pisoa sortu da eta kide gisa gehitu zara.');
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

        return redirect()->route('dashboard')->with('success', 'Pisoa eguneratu da.');
    }

    public function destroy(Pisua $pisua)
    {
        $pisua->delete();
        return redirect()->route('dashboard');
    }

    public function showMyPisua(Pisua $pisua)
    {
        if (!$pisua->users->contains(Auth::id())) {
            abort(403, 'Ez zara piso honetako kidea.');
        }
        $pisua->load(['gastuak.erosle', 'atazak.user']);

        return Inertia::render('mypisua', [
            'pisua' => $pisua,
            'usuarios' => $pisua->users,
            'gastos' => $pisua->gastuak,
            'tareas' => $pisua->atazak
        ]);
    }
}