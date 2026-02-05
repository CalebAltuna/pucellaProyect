<?php

namespace App\Http\Controllers;

use App\Models\Ataza;
use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Jobs\SyncAtazaToOdoo;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    public function index(Pisua $pisua)
    {
        $authId = Auth::id();
        $coordinadorId = $pisua->user_id;

        // Seguridad: Verificar si el usuario pertenece al piso
        if (!$pisua->users->contains($authId)) {
            abort(403, 'Ez zara pisu honetako kidea.');
        }

        $atazak = Ataza::with(['user', 'arduradunak'])
            ->where('pisua_id', $pisua->id)
            ->latest()
            ->get()
            ->map(function ($ataza) use ($authId, $coordinadorId) {
                // Lógica de permisos
                $isCreador = $authId === $ataza->user_id;
                $isCoordinador = $authId === $coordinadorId;
                $isResponsable = $ataza->arduradunak->contains($authId);

                return [
                    'id' => $ataza->id,
                    'izena' => $ataza->izena,
                    'egoera' => $ataza->egoera,
                    'data' => $ataza->data ? $ataza->data->format('Y-m-d') : null,
                    'data_formatted' => $ataza->data ? $ataza->data->locale('eu')->diffForHumans() : null,
                    'arduradunak' => $ataza->arduradunak,
                    'user_id' => $ataza->user_id,

                    // 🟢 AÑADIDO: Estado de sincronización para el Frontend
                    'synced' => (bool) $ataza->synced,
                    'sync_error' => $ataza->sync_error,

                    'can' => [
                        // Editables por creador, coordinador o responsables asignados
                        'edit' => ($isCreador || $isCoordinador || $isResponsable),
                        // Solo borrables por creador o coordinador
                        'delete' => ($isCreador || $isCoordinador),
                    ]
                ];
            });

        return Inertia::render('Tasks/MyTasks', [
            'atazak' => $atazak,
            'pisua' => $pisua,
            'kideak' => $pisua->users,
        ]);
    }

    public function create(Pisua $pisua)
    {
        return Inertia::render('Tasks/CreateTask', [
            'pisua' => $pisua,
            'kideak' => $pisua->users
        ]);
    }

    public function store(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'data' => 'required|date',
            'arduradunak' => 'required|array|min:1',
        ]);

        $ataza = $pisua->atazak()->create([
            'izena' => $validated['izena'],
            'data' => $validated['data'],
            'user_id' => Auth::id(),
            'egoera' => 'egiteko',
        ]);

        $ataza->arduradunak()->sync($validated['arduradunak']);

        // 🟢 AÑADIDO: Disparar sincronización al crear
        SyncAtazaToOdoo::dispatch($ataza);

        return redirect()->route('pisua.atazak.index', $pisua)
            ->with('success', 'Ataza ondo sortu da!');
    }

    public function edit(Pisua $pisua, Ataza $ataza)
    {
        $authId = Auth::id();
        $isResponsable = $ataza->arduradunak->contains($authId);

        // Permiso para ver el formulario de edición
        if ($authId !== $ataza->user_id && $authId !== $pisua->user_id && !$isResponsable) {
            abort(403);
        }

        return Inertia::render('Tasks/EditTask', [
            'pisua' => $pisua,
            'ataza' => $ataza->load('arduradunak'),
            'kideak' => $pisua->users,
            'selectedUsers' => $ataza->arduradunak->pluck('id')
        ]);
    }

    public function update(Request $request, Pisua $pisua, Ataza $ataza)
    {
        $authId = Auth::id();
        $isResponsable = $ataza->arduradunak->contains($authId);

        // Verificación de seguridad ampliada
        if ($authId !== $ataza->user_id && $authId !== $pisua->user_id && !$isResponsable) {
            return back()->withErrors(['error' => 'Ez daukazu baimenik ataza hau aldatzeko.']);
        }

        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'data' => 'required|date',
            'egoera' => 'required|in:egiteko,eginda',
            'arduradunak' => 'nullable|array',
        ]);

        // Actualizamos usando los datos validados
        $ataza->update([
            'izena' => $validated['izena'],
            'data' => $validated['data'],
            'egoera' => $validated['egoera'],
        ]);

        if ($request->has('arduradunak')) {
            $ataza->arduradunak()->sync($validated['arduradunak']);
        }

        // 🟢 AÑADIDO: Sincronización con Odoo tras actualizar
        SyncAtazaToOdoo::dispatch($ataza);

        return redirect()->route('pisua.atazak.index', $pisua)->with('success', 'Ataza eguneratu da!');
    }

    public function destroy(Pisua $pisua, Ataza $ataza)
    {
        $authId = Auth::id();
        // El borrado lo mantenemos restringido a creador o dueño del piso
        if ($authId === $ataza->user_id || $authId === $pisua->user_id) {

            // Opcional: Aquí podrías añadir AtazaDeleteFromOdoo::dispatch($ataza->odoo_id) en el futuro

            $ataza->delete();
            return redirect()->back()->with('success', 'Ataza ezabatu da!');
        }

        return back()->withErrors(['error' => 'Ez daukazu baimenik hau ezabatzeko.']);
    }
}
