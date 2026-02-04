<?php

namespace App\Jobs;

use App\Models\Gastu;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Exception;

class SyncGastuakToOdoo implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    protected $gastu;
    public $tries = 3;

    public function __construct(Gastu $gastu)
    {
        // Cargamos relaciones por si acaso (aunque ahora las tengamos comentadas)
        $this->gastu = $gastu->load(['ataza', 'user']);
    }

    public function handle(): void
    {
        try {
            $odooService = new OdooService();

            // ---------------------------------------------------------
            // PASO EXTRA DE SEGURIDAD: Recuperación de ID
            // Si Laravel no tiene el ID de Odoo, buscamos en Odoo por si acaso ya existe
            // para evitar duplicados.
            // ---------------------------------------------------------
            if (!$this->gastu->odoo_id) {
                // Buscamos en Odoo un gasto que tenga nuestro 'laravel_id'
                $existente = $odooService->search('task_tracer.gastu', [
                    ['laravel_id', '=', (int) $this->gastu->id]
                ]);

                if (!empty($existente)) {
                    // ¡Encontrado! Recuperamos el ID y lo guardamos en Laravel
                    $recuperadoId = $existente[0];
                    $this->gastu->withoutEvents(function () use ($recuperadoId) {
                        $this->gastu->update(['odoo_id' => $recuperadoId]);
                    });
                    // Actualizamos la instancia en memoria para usarla abajo
                    $this->gastu->odoo_id = $recuperadoId;
                    Log::info('Gastu ID recuperado de Odoo para evitar duplicados: ' . $recuperadoId);
                }
            }
            // ---------------------------------------------------------

            // 1. Datuak prestatu
            $odooData = [
                'izena' => $this->gastu->izena,
                'zenbatekoa' => (float) $this->gastu->zenbatekoa,
                'laravel_id' => (int) $this->gastu->id,

                // ❌ CAMPOS COMENTADOS (Para evitar errores hasta que existan en Odoo)
                // 'ataza_id' => $this->gastu->ataza ? $this->gastu->ataza->odoo_id : null,
                // 'user_id' => $this->gastu->user_id ?? null,
            ];

            // 2. Bidali Odoora
            if ($this->gastu->odoo_id) {
                // UPDATE (Si ya tenemos ID o lo acabamos de recuperar)
                $odooService->write('task_tracer.gastu', [[(int) $this->gastu->odoo_id], $odooData]);
                Log::info('Gastua eguneratua Odoon: ' . $this->gastu->odoo_id);
            } else {
                // CREATE (Solo si realmente no existe)
                $odooId = $odooService->create('task_tracer.gastu', $odooData);

                if (!$odooId) {
                    throw new Exception('Odoo-k ez du IDrik itzuli (Gastu).');
                }

                $this->gastu->withoutEvents(function () use ($odooId) {
                    $this->gastu->update(['odoo_id' => $odooId]);
                });

                Log::info('Gastua sortua Odoon: ' . $odooId);
            }

            // Markatu sinkronizatuta
            $this->gastu->withoutEvents(function () {
                $this->gastu->update(['synced' => true, 'sync_error' => null]);
            });

        } catch (Exception $e) {
            Log::error('Errorea Odoorekin (Gastu): ' . $e->getMessage());

            $this->gastu->withoutEvents(function () use ($e) {
                $this->gastu->update([
                    'synced' => false,
                    'sync_error' => substr($e->getMessage(), 0, 255)
                ]);
            });
            throw $e;
        }
    }
}
