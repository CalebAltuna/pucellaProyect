<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Pisua;
use App\Services\OdooService;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SynclogPisuaToOdoo implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;
    protected Pisua $pisua;
    // public $tries  = 5;
    // public $backoff = [30 ,60, 120, 300, 500]; // Exponential backoff in seconds

    /**
     * Create a new job instance.
     */
    public function __construct(Pisua $pisua)
    {
        $this->pisua = $pisua;
    }

    /**
     * Execute the job.
     */
    public function handle(OdooService $odoo): void
    {
        try {
            // Cargar el usuario relacionado (coordinador/creador)
            $sortzailea = $this->pisua->load('user')->user;

            // Validar que el usuario existe
            if (!$sortzailea) {
                throw new Exception('El Pisua no tiene usuario asignado.');
            }

            // Validar que el usuario está sincronizado con Odoo
            if (!$sortzailea->odoo_id) {
                throw new Exception("El coordinador ({$sortzailea->name}) aún no tiene odoo_id.");
            }

            // Preparar datos para Odoo
            $data = [
                'name' => $this->pisua->izena,
                'code' => $this->pisua->kodigoa,
                'coordinator_id' => $sortzailea->odoo_id, // Campo correcto: coordinator_id (no cord_id)
            ];

            // Crear en Odoo
            $odooId = $odoo->create('pisua', $data);

            // Actualizar registro en Laravel
            $this->pisua->update([
                'odoo_id' => $odooId,
                'synced' => true,
                'sync_error' => null
            ]);

        } catch (Exception $e) {
            // Guardar error para debugging
            $this->pisua->update([
                'sync_error' => $e->getMessage()
            ]);
            throw $e;
        }

    }
}
