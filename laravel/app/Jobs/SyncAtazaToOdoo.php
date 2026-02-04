<?php

namespace App\Jobs;

use App\Models\Ataza;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Exception;

class SyncAtazaToOdoo implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    protected $ataza;
    public $tries = 3;

    public function __construct(Ataza $ataza)
    {
        $this->ataza = $ataza->load(['user', 'arduradunak']);
    }

    public function handle(): void
    {
        try {
            $odooService = new OdooService();

            if (!$this->ataza->odoo_id) {
                $existente = $odooService->search('task_tracer.ataza', [
                    ['laravel_id', '=', (int) $this->ataza->id]
                ]);

                if (!empty($existente)) {
                    $recuperadoId = $existente[0];
                    $this->ataza->withoutEvents(function () use ($recuperadoId) {
                        $this->ataza->update(['odoo_id' => $recuperadoId]);
                    });
                    $this->ataza->odoo_id = $recuperadoId;
                    Log::info('Ataza ID recuperado de Odoo para evitar duplicados: ' . $recuperadoId);
                }
            }
            $egoeraOdoo = match($this->ataza->egoera) {
                'egiteko' => 'egiten',
                'eginda' => 'eginda',
                default => 'egiten',
            };

            $odooData = [
                'izena' => $this->ataza->izena,
                'data' => $this->ataza->data ? $this->ataza->data->format('Y-m-d') : null,
                'egoera' => $egoeraOdoo,
                'laravel_id' => (int) $this->ataza->id,

            ];

            if ($this->ataza->odoo_id) {
                $odooService->write('task_tracer.ataza', [[(int) $this->ataza->odoo_id], $odooData]);
                Log::info('Ataza eguneratua Odoon: ' . $this->ataza->odoo_id);
            } else {
                $odooId = $odooService->create('task_tracer.ataza', $odooData);

                if (!$odooId) {
                    throw new Exception('Odoo-k ez du IDrik itzuli.');
                }

                $this->ataza->withoutEvents(function () use ($odooId) {
                    $this->ataza->update(['odoo_id' => $odooId]);
                });

                Log::info('Ataza sortua Odoon: ' . $odooId);
            }

            $this->ataza->withoutEvents(function () {
                $this->ataza->update(['synced' => true, 'sync_error' => null]);
            });

        } catch (Exception $e) {
            Log::error('Errorea Odoorekin (Ataza): ' . $e->getMessage());

            $this->ataza->withoutEvents(function () use ($e) {
                $this->ataza->update([
                    'synced' => false,
                    'sync_error' => substr($e->getMessage(), 0, 255)
                ]);
            });
            throw $e;
        }
    }
}
