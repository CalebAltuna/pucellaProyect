<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Models\Gastuak;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class gastuak_controller extends Controller
{
    public function index(Pisua $pisua)
    {
        return Inertia::render('Gastuak/Index', [
            'gastuak' => Gastuak::where('pisua_id', $pisua->id)
                ->with(['erosle:id,name', 'ordaintzaileak'])
                ->latest()
                ->get(),
            'pisua' => $pisua
        ]);
    }

    public function create(Pisua $pisua)
    {
        return Inertia::render('Gastuak/CreateGastuak', [
            'pisua' => $pisua,
            'kideak' => $pisua->users
        ]);
    }
    public function store(Request $request, Pisua $pisua)
    {
        $validated = $request->validate([
            'izena' => 'required|string|max:255',
            'totala' => 'required|numeric|min:0',
            'oharrak' => 'nullable|string',
            'partaideak' => 'required|array|min:1',
        ]);

        $gastua = Gastuak::create([
            'izena' => $validated['izena'],
            'totala' => $validated['totala'],
            'oharrak' => $validated['oharrak'],
            'pisua_id' => $pisua->id,
            'user_erosle_id' => auth()->id(),
            'egoera' => 'ordaintzeko',
        ]);

        $cuota = $validated['totala'] / count($validated['partaideak']);

        foreach ($validated['partaideak'] as $userId) {
            $gastua->ordaintzaileak()->attach($userId, [
                'kopurua' => $cuota,
                'egoera' => ($userId == auth()->id()) ? 'ordaindua' : 'ordaintzeko',
            ]);
        }

        return redirect()->back();
    }

    public function update(Request $request, Pisua $pisua, Gastuak $gastua)
    {
        $request->validate([
            'egoera' => 'required|in:ordaindua,ordaintzeko',
        ]);

        $gastua->update($request->only('egoera'));

        return redirect()->route('pisua.gastuak.index', $pisua)
            ->with('success', 'Gastua eguneratu da!');
    }

    public function destroy(Pisua $pisua, Gastuak $gastua)
    {

        $gastua->delete();

        return redirect()->route('pisua.gastuak.index', $pisua)
            ->with('success', 'Gastua ezabatu da!');
    }
}