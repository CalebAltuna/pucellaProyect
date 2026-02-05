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

// CORREGIDO: De SynclogPisuaToOdoo a SyncPisuaToOdoo
class SyncPisuaToOdoo implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    protected Pisua $pisua;
    // public $tries = 5;
    // public $backoff = [30 ,60, 120, 300, 500];

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
            // Usamos loadMissing para no recargar si ya está cargado
            $this->pisua->loadMissing('user');
            $sortzailea = $this->pisua->user;

            // Validar que el usuario existe
            if (!$sortzailea) {
                throw new Exception('El Pisua no tiene usuario asignado (user_id nulo o inválido).');
            }

            // Validar que el usuario está sincronizado con Odoo
            if (!$sortzailea->odoo_id) {
                throw new Exception("El coordinador ({$sortzailea->name}) aún no tiene odoo_id. Sincroniza el usuario primero.");
            }

            // Preparar datos para Odoo
            $data = [
                'name' => $this->pisua->izena,
                'code' => $this->pisua->kodigoa,
                'coordinator_id' => $sortzailea->odoo_id,
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
            // Guardar error para debugging en la base de datos
            $this->pisua->update([
                'synced' => false,
                'sync_error' => $e->getMessage() // Guardamos el mensaje de error real
            ]);
            
            // Re-lanzamos la excepción para que el Job falle y (si configuras retries) se reintente
            throw $e;
        }
    }
}