<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class NirePisuaController extends Controller
{
    public function show(Request $request, Pisua $pisua)
    {
        if (!$pisua->users->contains(Auth::id())) {
            abort(403, 'Ez daukazu baimenik pisu hau ikusteko.');
        }

        $filter = $request->input('filter', 'all');

        $gastosQuery = $pisua->gastuak()
            ->with(['erosle', 'ordaintzaileak' => function($query) {
                $query->wherePivot('egoera', 'ordaintzeko');
            }])
            ->whereHas('ordaintzaileak', function ($q) {
                $q->where('gastu_user.egoera', 'ordaintzeko');
            });
            
        $gastosRaw = $gastosQuery->get(); 

        $gastosSmart = $gastosRaw->map(function ($gasto) {
            if ($gasto->ordaintzaileak->isEmpty()) {
                return null;
            }

            $dias = Carbon::parse($gasto->created_at)->diffInDays(now());
            
            $urgencia = 3; 
            if ($dias > 30) $urgencia = 0;
            elseif ($dias > 14) $urgencia = 1;
            elseif ($dias > 7) $urgencia = 2;

            $pendienteTotal = $gasto->ordaintzaileak->sum('pivot.kopurua');
            $deudoresCount = $gasto->ordaintzaileak->count();

            return [
                'id' => 'gasto-' . $gasto->id,
                'real_id' => $gasto->id,
                'mota' => 'gasto',
                'izena' => $gasto->izena,
                'descripcion' => $deudoresCount . ' pertsonak ordaintzeke',
                'kopurua' => round($pendienteTotal, 2),
                'eroslea' => $gasto->erosle ? ($gasto->erosle->izena ?? $gasto->erosle->name) : 'Ezezaguna',
                'urgencia' => $urgencia,
                'prioridad' => $urgencia,
                'created_at_formatted' => Carbon::parse($gasto->created_at)->diffForHumans(),
                'fecha_sort' => Carbon::parse($gasto->created_at),
            ];
        })->filter()->values(); // Elimina nulls

        $tareasQuery = $pisua->atazak()
            ->where('egoera', 'egiteko')
            ->with('user');

        $tareasRaw = $tareasQuery->get();

        $tareasSmart = $tareasRaw->map(function ($tarea) {
            $deadline = Carbon::parse($tarea->data);
            $hoy = now();

            $urgencia = 3;
            if ($deadline->isPast()) $urgencia = 0;
            elseif ($deadline->diffInDays($hoy) <= 2) $urgencia = 1;
            elseif ($deadline->diffInDays($hoy) <= 5) $urgencia = 2;

            $arduraduna = $tarea->user ? ($tarea->user->izena ?? $tarea->user->name) : 'Esleitu gabe';

            return [
                'id' => 'tarea-' . $tarea->id,
                'real_id' => $tarea->id,
                'mota' => 'tarea',
                'izena' => $tarea->izena,
                'arduraduna' => $arduraduna,
                'urgencia' => $urgencia,
                'prioridad' => $urgencia,
                'deadline_formatted' => $deadline->format('d/m/Y'),
                'created_at_formatted' => 'Epemuga: ' . $deadline->diffForHumans(),
                'fecha_sort' => $deadline,
            ];
        });

        $coleccionFinal = collect();

        if ($filter === 'all' || $filter === 'gastos') {
            $coleccionFinal = $coleccionFinal->merge($gastosSmart);
        }

        if ($filter === 'all' || $filter === 'tareas') {
            $coleccionFinal = $coleccionFinal->merge($tareasSmart);
        }

        $itemsOrdenados = $coleccionFinal->sortBy([
            ['urgencia', 'asc'],
            ['fecha_sort', 'asc'],
        ])->values();

        $totalDeudaPiso = $gastosSmart->sum('kopurua');
        $totalTareasPendientes = $tareasSmart->count();
        $tareasVencidas = $tareasSmart->where('urgencia', 0)->count();

        \Log::info('MyPisua Debug:', [
            'pisua_id' => $pisua->id,
            'gastos_count' => $gastosRaw->count(),
            'gastos_smart_count' => $gastosSmart->count(),
            'tareas_count' => $tareasRaw->count(),
            'tareas_smart_count' => $tareasSmart->count(),
            'items_final_count' => $itemsOrdenados->count(),
            'filter' => $filter,
            'user_id' => Auth::id(),
        ]);

        return Inertia::render('mypisua', [
            'pisua' => $pisua,
            'usuarios' => $pisua->users, 
            
            'items' => $itemsOrdenados, 
            
            'gastos' => $gastosRaw,
            'tareas' => $tareasRaw,

            'filter' => $filter,
            
            'resumen_general' => [
                'total_items' => $itemsOrdenados->count(),
                'dinero_bloqueado' => round($totalDeudaPiso, 2),
                'tareas_pendientes' => $totalTareasPendientes,
                'alertas_rojas' => $tareasVencidas + $gastosSmart->where('urgencia', 0)->count(),
            ]
        ]);
    }
}