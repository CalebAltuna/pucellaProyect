<?php

namespace App\Jobs;

use App\Models\Gastuak; // <--- ESTO ES LA CLAVE (Tu modelo es Gastuak, no Gastu)
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

    public $tries = 3;
    protected $gastu;

    public function __construct(Gastuak $gastu)
    {
        $this->gastu = $gastu;
    }

    public function handle(): void
    {
        try {
            $odooService = new OdooService();

            if (!$this->gastu->odoo_id) {
                $existente = $odooService->search('task_tracer.gastu', [
                    ['laravel_id', '=', (int) $this->gastu->id]
                ]);

                if (!empty($existente)) {
                    $recuperadoId = $existente[0];
                    $this->gastu->withoutEvents(function () use ($recuperadoId) {
                        $this->gastu->update(['odoo_id' => $recuperadoId]);
                    });
                    $this->gastu->odoo_id = $recuperadoId;
                    Log::info('Gastu ID recuperado de Odoo: ' . $recuperadoId);
                }
            }

            $odooData = [
                'izena' => $this->gastu->izena,
                'zenbatekoa' => (float) $this->gastu->totala, // Usamos 'totala'
                'laravel_id' => (int) $this->gastu->id,
            ];

            if ($this->gastu->odoo_id) {
                $odooService->write('task_tracer.gastu', [[(int) $this->gastu->odoo_id], $odooData]);
                Log::info('Gastua eguneratua Odoon: ' . $this->gastu->odoo_id);
            } else {
                $odooId = $odooService->create('task_tracer.gastu', $odooData);
                if (!$odooId) {
                    throw new Exception('Odoo-k ez du IDrik itzuli (Gastu).');
                }
                $this->gastu->withoutEvents(function () use ($odooId) {
                    $this->gastu->update(['odoo_id' => $odooId]);
                });

                Log::info('Gastua sortua Odoon: ' . $odooId);
            }
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
