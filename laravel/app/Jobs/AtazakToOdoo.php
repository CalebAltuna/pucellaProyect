<?php

namespace App\Jobs;

use App\Models\Ataza;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Exception;

class AtazakToOdoo implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    protected $ataza;

    // Pasamos el modelo de la tarea al Job
    public function __construct(Ataza $ataza)
    {
        $this->ataza = $ataza;
    }

    public function handle(): void
    {
        try {
            // 1. Aquí iría tu lógica de conexión con la API de Odoo
            // $odooResponse = Odoo::createTask([...]);

            // Ejemplo de actualización tras éxito:
            $this->ataza->update([
                'synced' => true,
                'odoo_id' => 123, // El ID que te devuelva Odoo
                'sync_error' => null,
            ]);

        } catch (Exception $e) {
            // Si falla, guardamos el error para saber qué pasó
            $this->ataza->update([
                'synced' => false,
                'sync_error' => $e->getMessage(),
            ]);

            // Opcional: lanzar el error para que el Job reintente
            throw $e;
        }
    }
}
