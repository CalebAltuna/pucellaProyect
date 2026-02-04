<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use App\Services\OdooService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PisoController extends Controller
{
    // ... tus otros métodos (create, store, etc.) ...

    /**
     * Muestra la vista "Mi Piso" (Kudeatu) con datos combinados.
     */
    public function showMyPisua(Pisua $pisua, OdooService $odoo)
    {
        // 1. Inicializamos arrays vacíos
        $gastosOdoo = [];
        $tareasLaravel = [];

        // 2. Intentamos obtener los Gastos desde Odoo
        // IMPORTANTE: Asegúrate de que el modelo en Odoo se llame 'pisua.gastua' 
        // o el nombre que le hayas puesto en tu módulo de Python.
        try {
            // Buscamos gastos donde el campo 'pisua_id' coincida con el nombre de este piso
            // Ajusta los campos 'name', 'date', 'amount' a los nombres reales en tu Odoo
            $gastosOdoo = $odoo->searchRead('pisua.gastua', 
                [['pisua_id.name', '=', $pisua->izena]], // Dominio de búsqueda
                ['name', 'date', 'amount']               // Campos a recuperar
            );
        } catch (\Exception $e) {
            // Si Odoo falla, logueamos el error pero NO detenemos la app.
            // El usuario verá sus tareas, pero 0 gastos (fail-safe).
            Log::error("Error conectando con Odoo para gastos: " . $e->getMessage());
        }

        // 3. Obtenemos las Tareas desde Laravel (Base de datos local)
        // Asumimos que la relación en el modelo Pisua es 'atazak()'
        $tareasLaravel = $pisua->atazak()
                               ->latest()
                               ->take(10) // Limitamos a las últimas 10
                               ->get();

        // 4. Renderizamos la vista enviando los datos formateados
        return Inertia::render('pisua/viewPisua', [ // O 'pisua/mypisua' según tu archivo
            'selectedPisua' => $pisua,
            'pisuak' => Pisua::all(), // Para que la tabla de selección siga funcionando
            
            // Mapeo de Tareas (Laravel -> React)
            'tareas' => $tareasLaravel->map(fn($t) => [
                'id' => $t->id,
                'titulo' => $t->izena, // O $t->nombre_tarea
                'fecha' => $t->created_at->format('Y-m-d'),
            ]),

            // Mapeo de Gastos (Odoo -> React)
            'gastos' => collect($gastosOdoo)->map(fn($g) => [
                'id' => $g['id'],
                'titulo' => $g['name'], // El concepto del gasto en Odoo
                'fecha' => $g['date'],
                // Formateamos el dinero
                'cantidad' => number_format($g['amount'], 2) . '€', 
            ]),
        ]);
    }
}