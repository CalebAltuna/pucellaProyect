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
    public function zurePisuak()
    {
        $pisuak = Auth::user()->pisuak()->get();

        return Inertia::render('dashboard', [
            'pisuak' => $pisuak
        ]);
    }

    public function index(OdooService $odoo)
    {
        $pisuak = $odoo->searchRead('pisua', [], ['name', 'code']);
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

        $user = Auth::user();

        if ($user && !$user->synced) {
            try {
                (new SyncUserToOdoo($user))->handle(app(OdooService::class));
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Odoo sinkronizazio akatsa: ' . $e->getMessage());
            }
        }

        $pisua = DB::transaction(function () use ($validated, $user) {
            $nuevoPisua = Pisua::create([
                'izena' => $validated['pisuaren_izena'],
                'kodigoa' => $validated['pisuaren_kodigoa'],
                'synced' => false,
                'user_id' => $user->id
            ]);

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
        // Validación de seguridad
        if (!$pisua->users->contains(auth()->id())) {
            abort(403);
        }

        $gastuak = $pisua->gastuak()->where('egoera', '!=', 'ordaindua')->get();
        $atazak = $pisua->atazak()->where('egoera', '!=', 'eginda')->get();

        $items_priorizados = collect()
            ->concat($gastuak->map(fn($g) => [
                'id' => $g->id,
                'tipo' => 'gastu',
                'izenburua' => $g->izena,
                'fecha' => $g->created_at,
                'extra' => $g->totala . '€',
                'urgencia' => now()->diffInDays($g->created_at) > 3 ? 1 : 3
            ]))
            ->concat($atazak->map(fn($a) => [
                'id' => $a->id,
                'tipo' => 'ataza',
                'izenburua' => $a->izena,
                'fecha' => $a->data,
                'extra' => null,
                'urgencia' => $a->data && $a->data->isPast() ? 0 : ($a->data && $a->data->diffInDays(now()) < 2 ? 1 : 2)
            ]))
            ->sortBy('urgencia')
            ->values();

        return Inertia::render('mypisua', [
            'pisua' => $pisua,
            'items_priorizados' => $items_priorizados,
            'resumen_general' => [
                'dinero_bloqueado' => $gastuak->sum('totala'),
                'tareas_pendientes' => $atazak->count(),
            ]
        ]);
    }
    public function addMember(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Erabiltzaile hau ez dago erregistratuta.',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])->first();

        if ($pisua->users->contains($user->id)) {
            return back()->withErrors(['email' => 'Erabiltzaile hau kidea da dagoeneko.']);
        }

        $pisua->users()->attach($user->id);

        return back()->with('success', 'Kide berria gehitu da!');
    }

}
