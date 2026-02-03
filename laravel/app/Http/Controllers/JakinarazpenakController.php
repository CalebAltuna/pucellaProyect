<?php

namespace App\Http\Controllers;

use App\Models\Pisua;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class JakinarazpenakController extends Controller
{
    public function index(Request $request, Pisua $pisua)
    {
        $user = Auth::user();
        $filter = $request->input('filter', 'all');

        // 1. OBTENER GASTOS PENDIENTES
        $gastosPendientes = $pisua->gastuak()
            ->whereHas('ordaintzaileak', function ($q) use ($user) {
                $q->where('users.id', $user->id)
                  ->where('gastu_user.egoera', 'ordaintzeko');
            })
            ->with(['erosle', 'ordaintzaileak' => function($q) use ($user) {
                $q->where('users.id', $user->id);
            }])
            ->get()
            ->map(function ($gasto) {
                $dias = Carbon::parse($gasto->created_at)->diffInDays(now());

                $urgencia = 3;
                if ($dias > 30) $urgencia = 0;
                elseif ($dias > 14) $urgencia = 1;
                elseif ($dias > 7) $urgencia = 2;

                $miDeuda = $gasto->ordaintzaileak->first()->pivot->kopurua;

                return [
                    'id' => 'gasto-' . $gasto->id,
                    'real_id' => $gasto->id,
                    'mota' => 'gasto',
                    'izena' => $gasto->izena,
                    'kopurua' => round($miDeuda, 2),
                    'eroslea' => $gasto->erosle ? ($gasto->erosle->izena ?? $gasto->erosle->name) : 'Ezezaguna',
                    'urgencia' => $urgencia,
                    'prioridad' => $urgencia,
                    'created_at_formatted' => Carbon::parse($gasto->created_at)->diffForHumans(),
                    'fecha_sort' => Carbon::parse($gasto->created_at),
                ];
            });

        // 2. OBTENER TAREAS PENDIENTES (CORREGIDO PARA TU MODELO)
        $tareasPendientes = $pisua->atazak()
            ->where('egoera', 'egiteko') // O como llames a "pendiente" en la DB
            ->where('user_id', $user->id) // <--- CORRECCIÓN: Buscamos por tu columna directa
            ->get()
            ->map(function ($tarea) {
                // CORRECCIÓN: Usamos 'data' en vez de 'epemuga'
                $deadline = Carbon::parse($tarea->data);
                $hoy = now();

                $urgencia = 3;
                if ($deadline->isPast()) $urgencia = 0;
                elseif ($deadline->diffInDays($hoy) <= 2) $urgencia = 1;
                elseif ($deadline->diffInDays($hoy) <= 5) $urgencia = 2;

                return [
                    'id' => 'tarea-' . $tarea->id,
                    'real_id' => $tarea->id,
                    'mota' => 'tarea',
                    'izena' => $tarea->izena,
                    'urgencia' => $urgencia,
                    'prioridad' => $urgencia,
                    'deadline_formatted' => $deadline->format('d/m/Y'),
                    'created_at_formatted' => 'Epemuga: ' . $deadline->diffForHumans(),
                    'fecha_sort' => $deadline,
                ];
            });

        // 3. FILTRADO Y FUSIÓN
        $colleccionFinal = collect();

        if ($filter === 'all' || $filter === 'gastos') {
            $colleccionFinal = $colleccionFinal->merge($gastosPendientes);
        }

        if ($filter === 'all' || $filter === 'tareas') {
            $colleccionFinal = $colleccionFinal->merge($tareasPendientes);
        }

        // 4. ORDENAR
        $notificacionesOrdenadas = $colleccionFinal->sortBy(function ($item) {
            return $item['urgencia'] . '-' . $item['fecha_sort']->timestamp;
        })->values();

        // 5. ESTADÍSTICAS
        $totalDeuda = $gastosPendientes->sum('kopurua');
        $totalTareas = $tareasPendientes->count();

        return Inertia::render('Jakinarazpenak', [
            'pisua' => $pisua,
            'jakinarazpenak' => $notificacionesOrdenadas,
            'filter' => $filter,
            'estadistikak' => [
                'total_items' => $notificacionesOrdenadas->count(),
                'total_deuda' => round($totalDeuda, 2),
                'tareas_pendientes' => $totalTareas,
            ]
        ]);
    }
}
