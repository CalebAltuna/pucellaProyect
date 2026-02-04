<?php

namespace App\Http\Controllers;

use App\Models\Gastuak;
use App\Services\OdooService; // Importamos tu servicio
use Illuminate\Http\Request;
use Inertia\Inertia; // Usamos Inertia para React
use Illuminate\Support\Facades\Log;

class GastuakController extends Controller
{
    /**
     * Guarda el nuevo gasto en SQL y lo envía a Odoo.
     */
public function store(Request $request, OdooService $odoo)
    {
        // 1. Validación
        $validated = $request->validate([
            'izena'            => 'required|string|max:255',
            'deskribapena'     => 'nullable|string',
            'totala'           => 'required|numeric',
            'pisua_id'         => 'required|exists:pisuak,id', // O pisuas
            'user_erosle_id'   => 'required|exists:users,id',  // Quién paga
            // Array de usuarios implicados (opcional, para dividir gastos)
            'partaideak'       => 'array', 
        ]);

        // 2. Crear el Gasto en Laravel
        $gastu = Gastuak::create([
            'izena'          => $validated['izena'],
            'deskribapena'   => $validated['deskribapena'],
            'totala'         => $validated['totala'],
            'pisua_id'       => $validated['pisua_id'],
            'user_erosle_id' => $validated['user_erosle_id'],
            'synced'         => false, // Por defecto no sincronizado
        ]);

        // 3. Asignar participantes en la tabla pivote (Si envías una lista)
        // Ejemplo: Si quieres que conste que el usuario X participa con 10€
        if ($request->has('partaideak')) {
            // Suponiendo que 'partaideak' es un array [user_id => cantidad]
            $gastu->ordaintzaileak()->sync($request->partaideak);
        }

        // 4. Sincronizar con Odoo
        try {
            $odooId = $odoo->create('pisua.gastua', [
                'name'         => $gastu->izena,
                'amount'       => $gastu->totala,
                'date'         => now()->format('Y-m-d'),
                'pisua_id'     => $gastu->pisua_id, // Asegúrate de que esto sea un ID válido en Odoo o su nombre
                'description'  => $gastu->deskribapena,
            ]);

            // Si Odoo responde con un ID, actualizamos nuestro modelo
            if ($odooId) {
                $gastu->update([
                    'odoo_id' => $odooId, 
                    'synced' => true
                ]);
            }
            
        } catch (\Exception $e) {
            \Log::error("Error sincronizando gasto {$gastu->id} con Odoo: " . $e->getMessage());
            // Guardamos el error en la base de datos para reintentar luego
            $gastu->update(['sync_error' => substr($e->getMessage(), 0, 255)]);
        }

        return redirect()->back()->with('success', 'Gastua sortu da!');
    }

    // Método Index opcional si tienes una vista solo de gastos
    public function index()
    {
        $gastuenZerrenda = Gastuak::with(['user', 'arduraduna'])->latest()->get();
        return Inertia::render('Gastuak/Index', compact('gastuenZerrenda'));
    }

    // Los métodos update y destroy deberían seguir la misma lógica...
    public function destroy(Gastuak $gastua)
    {
        $gastua->delete();
        // Aquí podrías llamar a $odoo->unlink(...) si quisieras borrarlo de Odoo también
        return redirect()->back()->with('success', 'Gastua ezabatu da!');
    }
}