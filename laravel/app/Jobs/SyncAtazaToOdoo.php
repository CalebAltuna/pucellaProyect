<?php

namespace App\Jobs;


use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Ataza;
use App\Services\OdooService;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncAtazaToOdoo implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;
    protected Ataza $ataza;
    // public $tries  = 5;
    // public $backoff = [30 ,60, 120, 300, 500]; // Exponential backoff in seconds

    /**
     * Create a new job instance.
     */
    public function __construct(Ataza $ataza)
    {
        $this->ataza = $ataza;
    }

    /**
     * Execute the job.
     */
    public function handle(OdooService $odoo): void
    {
        try {
            // Cargar el usuario relacionado (coordinador/creador)
            $sortzailea = $this->ataza->load('user')->user;
            $pisua = $this->ataza->load('pisua')->pisua;

            
            // Validar que el usuario existe
            if (!$sortzailea) {
                throw new Exception('El Pisua no tiene usuario asignado.');
            }
            
            // Validar que el usuario está sincronizado con Odoo
            if (!$sortzailea->odoo_id) {
                throw new Exception('El usuario coordinador no está sincronizado con Odoo. Sincroniza el usuario primero.');
            }

            // Preparar datos para Odoo
            $data = [
                'izena' => $this->ataza->izena,
                'egoera' => $this->ataza->kodigoa,
                'data' => $this->ataza->kodigoa,
                //'coordinator_id' => $sortzailea->odoo_id, // Campo correcto: coordinator_id (no cord_id)
            ];

            // Crear en Odoo
            $odooId = $odoo->create('task_tracer.ataza', $data);

            // Actualizar registro en Laravel
            $this->ataza->update([
                'odoo_id' => $odooId,
                'synced' => true,
                'sync_error' => null
            ]);

        } catch (Exception $e) {
            // Guardar error para debugging
            $this->ataza->update([
                'sync_error' => $e->getMessage()
            ]);
            throw $e;
        }

    }
}
