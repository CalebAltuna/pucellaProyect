<?php

namespace App\Http\Controllers;

use App\Models\Ataza;
use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Jobs\AtazakToOdoo;
use Illuminate\Support\Facades\Auth;

class AtazaController extends Controller
{
    public function index(Pisua $pisua)
    {
        $authId = Auth::id();
        $coordinadorId = $pisua->user_id;

        if (!$pisua->users->contains($authId)) {
            abort(403, 'Ez zara pisu honetako kidea.');
        }

        $atazak = Ataza::with(['user', 'arduradunak'])
            ->where('pisua_id', $pisua->id)
            ->latest()
            ->get()
            ->map(function ($ataza) use ($authId, $coordinadorId) {
                return array_merge($ataza->toArray(), [
                    // Asegúrate de tener el $casts en el modelo Ataza para que esto no falle
                    'data_formatted' => $ataza->data ? $ataza->data->locale('eu')->diffForHumans() : null,
                    'can' => [
                        'edit' => ($authId === $ataza->user_id || $authId === $coordinadorId),
                        'delete' => ($authId === $ataza->user_id || $authId === $coordinadorId),
                    ]
                ]);
            });

        return Inertia::render('Tasks/MyTasks', [
            'atazak' => $atazak,
            'pisua' => $pisua
        ]);
    }

    /**
     * ✅ AÑADIDO: Muestra el formulario de creación
     */
    public function create(Pisua $pisua)
    {
        return Inertia::render('Tasks/CreateTask', [
            'pisua' => $pisua,
            'kideak' => $pisua->users // Para seleccionar responsables en el formulario
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

        return redirect()->route('pisua.atazak.index', $pisua)
            ->with('success', 'Ataza ondo sortu da!');
    }

    /**
     * ✅ AÑADIDO: Muestra el formulario de edición
     */
    public function edit(Pisua $pisua, Ataza $ataza)
    {
        $authId = Auth::id();
        if ($authId !== $ataza->user_id && $authId !== $pisua->user_id) {
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
        if ($authId !== $ataza->user_id && $authId !== $pisua->user_id) {
            return back()->withErrors(['error' => 'Ez daukazu baimenik ataza hau aldatzeko.']);
        }

        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'data' => 'required|date',
            'egoera' => 'required|in:egiteko,eginda',
            'arduradunak' => 'nullable|array',
        ]);

        $ataza->update($request->only(['izena', 'egoera', 'data']));

        if ($request->has('arduradunak')) {
            $ataza->arduradunak()->sync($validated['arduradunak']);
        }

        // Sincronización con Odoo
        AtazakToOdoo::dispatch($ataza);

        return redirect()->route('pisua.atazak.index', $pisua)->with('success', 'Ataza eguneratu da!');
    }

    public function destroy(Pisua $pisua, Ataza $ataza)
    {
        $authId = Auth::id();
        if ($authId === $ataza->user_id || $authId === $pisua->user_id) {
            $ataza->delete();
            return redirect()->back()->with('success', 'Ataza ezabatu da!');
        }

        return back()->withErrors(['error' => 'Ez daukazu baimenik hau ezabatzeko.']);
    }
}