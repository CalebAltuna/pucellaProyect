<?php

namespace App\Jobs;

use App\Models\Pisua;
use App\Models\User;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncOdooToPisua implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        // Generalmente no necesitamos pasar nada,
        // ya que queremos traer todos los cambios de Odoo.
    }

    public function handle(OdooService $odoo): void
    {
        try {
            Log::info("Iniciando sincronización: Odoo -> Laravel (Pisuak)");

            /**
             * 1. Definir el modelo y campos de Odoo.
             * Cambia 'res.partner' por tu modelo real de Pisos si es distinto.
             * Cambia 'user_id' por el campo que guarda el coordinador en Odoo.
             */
            $odooModel = 'res.partner';
            $fields = ['id', 'name', 'user_id'];

            // Filtro: solo traer los que son "Pisos" (si tienes un campo para distinguirlos)
            // Ejemplo: [['is_company', '=', true]] o dejar vacío [] para traer todos
            $domain = [['is_company', '=', true]];

            $odooRecords = $odoo->searchRead($odooModel, $domain, $fields);

            if (empty($odooRecords)) {
                Log::info("No se encontraron pisos nuevos o modificados en Odoo.");
                return;
            }

            foreach ($odooRecords as $record) {
                // Odoo devuelve los IDs relacionales como un array: [ID, "Nombre"]
                $odooUserId = is_array($record['user_id']) ? $record['user_id'][0] : null;

                // Buscamos si el coordinador existe en nuestro Laravel
                $localUser = null;
                if ($odooUserId) {
                    $localUser = User::where('odoo_id', $odooUserId)->first();
                }

                // Sincronizamos con nuestra tabla local 'pisuak'
                Pisua::updateOrCreate(
                    ['odoo_id' => $record['id']], // Buscamos por el ID de Odoo
                    [
                        'izena'   => $record['name'],
                        'user_id' => $localUser?->id, // Asignamos nuestro ID de usuario si existe
                    ]
                );
            }

            Log::info("Sincronización finalizada: " . count($odooRecords) . " pisos procesados.");

        } catch (\Exception $e) {
            Log::error("Error sincronizando Odoo a Pisua: " . $e->getMessage());
            throw $e;
        }
    }
}
