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
    public $tries = 3; // Reintentar 3 veces si falla
    public $timeout = 120; // Timeout de 120 segundos

    public function __construct(Ataza $ataza)
    {
        $this->ataza = $ataza;
    }

    public function handle(): void
    {
        try {
            $odooService = new OdooService();

            // Preparar datos para Odoo
            $odooData = [
                'name' => $this->ataza->izena,
                'date_deadline' => $this->ataza->data->format('Y-m-d'),
                'user_id' => $this->ataza->user_id, // Usuario que creó la tarea
                'stage_id' => $this->getOdooStageId($this->ataza->egoera), // Mapear estado
            ];

            // Si hay responsables (arduraduna), agregarlos
            if ($this->ataza->arduradunak && $this->ataza->arduradunak->count() > 0) {
                $odooData['user_ids'] = $this->ataza->arduradunak->pluck('id')->toArray();
            }

            Log::info('Enviando tarea a Odoo', [
                'ataza_id' => $this->ataza->id,
                'izena' => $this->ataza->izena,
                'data_odoo' => $odooData,
            ]);

            // Llamar a Odoo para crear o actualizar
            if ($this->ataza->odoo_id) {
                // Si ya existe en Odoo, actualizar
                $odooService->write('project.task', [
                    [$this->ataza->odoo_id],
                    $odooData
                ]);

                Log::info('Tarea actualizada en Odoo', [
                    'ataza_id' => $this->ataza->id,
                    'odoo_id' => $this->ataza->odoo_id,
                ]);
            } else {
                // Si es nueva, crear en Odoo
                $odooId = $odooService->create('project.task', $odooData);

                if (!$odooId) {
                    throw new Exception('Odoo no retornó un ID válido');
                }

                // Guardar el ID de Odoo
                $this->ataza->update([
                    'odoo_id' => $odooId,
                ]);

                Log::info('Tarea creada en Odoo', [
                    'ataza_id' => $this->ataza->id,
                    'odoo_id' => $odooId,
                ]);
            }

            // Marcar como sincronizada exitosamente
            $this->ataza->update([
                'synced' => true,
                'sync_error' => null,
            ]);

            Log::info('Sincronización con Odoo exitosa', [
                'ataza_id' => $this->ataza->id,
                'odoo_id' => $this->ataza->odoo_id,
            ]);

        } catch (Exception $e) {
            Log::error('Error sincronizando con Odoo', [
                'ataza_id' => $this->ataza->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Guardar el error en la BD
            $this->ataza->update([
                'synced' => false,
                'sync_error' => $e->getMessage(),
            ]);

            // Relanzar la excepción para que Laravel reintente
            throw $e;
        }
    }

    /**
     * Mapear estados de Laravel a estados de Odoo
     * En Odoo los estados típicos son: Todo, In Progress, Done, Cancelled
     */
    private function getOdooStageId(string $egoeraLaravel): int
    {
        $stageMap = [
            'egiteko' => 1,      // To Do
            'egiten' => 2,       // In Progress
            'egina' => 3,        // Done
            'atzeratua' => 4,    // Cancelled o estado especial
        ];

        return $stageMap[$egoeraLaravel] ?? 1;
    }
}
