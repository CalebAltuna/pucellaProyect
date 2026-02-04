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

class AtazakToOdoo implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    protected $ataza;
    public $tries = 3;
    public $timeout = 120;

    public function __construct(Ataza $ataza)
    {
        // Cargamos las relaciones necesarias para evitar consultas extra en el handle
        $this->ataza = $ataza->load(['pisua', 'user', 'arduradunak']);
    }

    public function handle(): void
    {
        try {
            $odooService = new OdooService();

            // 1. Validar que el piso tenga vinculación con Odoo
            if (!$this->ataza->pisua->odoo_project_id) {
                throw new Exception("El piso asociado no tiene un odoo_project_id.");
            }

            // 2. Preparar datos base para Odoo
            $odooData = [
                'name' => $this->ataza->izena,
                'date_deadline' => $this->ataza->data->format('Y-m-d'),
                'project_id' => (int) $this->ataza->pisua->odoo_project_id,
                'stage_id' => $this->getOdooStageId($this->ataza->egoera),
                // Usamos el odoo_user_id del creador
                'user_id' => $this->ataza->user->odoo_user_id ?? null,
            ];

            // 3. Mapear Responsables (Many2Many en Odoo)
            // Usamos la sintaxis [6, 0, [ids]] para sincronizar la lista de IDs de Odoo
            if ($this->ataza->arduradunak->count() > 0) {
                $odooUserIds = $this->ataza->arduradunak
                    ->pluck('odoo_user_id')
                    ->filter() // Quitamos nulos por seguridad
                    ->toArray();

                if (!empty($odooUserIds)) {
                    $odooData['user_ids'] = [[6, 0, $odooUserIds]];
                }
            }

            Log::info('Sinkronizazioa abiarazten Odoorekin', [
                'ataza_id' => $this->ataza->id,
                'data' => $odooData,
            ]);

            // 4. Crear o Actualizar
            if ($this->ataza->odoo_id) {
                // Actualizar tarea existente
                $odooService->write('project.task', [
                    [(int) $this->ataza->odoo_id],
                    $odooData
                ]);
                Log::info('Ataza eguneratua Odoon: ' . $this->ataza->odoo_id);
            } else {
                // Crear nueva tarea
                $odooId = $odooService->create('project.task', $odooData);

                if (!$odooId) {
                    throw new Exception('Odoo-k ez du ID balidopolik itzuli');
                }

                // Guardar el ID de Odoo en local sin disparar eventos de nuevo
                $this->ataza->withoutEvents(function () use ($odooId) {
                    $this->ataza->update(['odoo_id' => $odooId]);
                });
            }

            // Marcamos éxito
            $this->ataza->update([
                'synced' => true,
                'sync_error' => null,
            ]);

        } catch (Exception $e) {
            Log::error('Errorea Odoorekin sinkronizatzean', [
                'ataza_id' => $this->ataza->id,
                'message' => $e->getMessage(),
            ]);

            $this->ataza->update([
                'synced' => false,
                'sync_error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    private function getOdooStageId(string $egoeraLaravel): int
    {
        // Estos IDs deben coincidir con los IDs de 'project.task.type' en tu Odoo
        $stageMap = [
            'egiteko' => 1, // Berria / To Do
            'egiten' => 2, // Prozesuan / In Progress
            'egina' => 3, // Eginda / Done
            'atzeratua' => 4, // Ezeztatua / Cancelled
        ];

        return $stageMap[$egoeraLaravel] ?? 1;
    }
}
