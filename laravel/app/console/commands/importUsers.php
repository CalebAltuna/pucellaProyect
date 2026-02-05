<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pisua;
use App\Services\OdooService;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ImportUsers extends Command
{

    protected $signature = 'odoo:sync-users';
    protected $description = 'Users Odoo-tik inportatu eta SQLite eguneratu';

    public function handle(OdooService $odoo)
    {
        try {
            Log::info("Iniciando sincronización: Odoo -> Laravel (Pisuak)");

            $odooModel = 'res.partner';
            // Añadimos 'ref' que es el campo técnico del código en Odoo
            $fields = ['id', 'name', 'user_id', 'ref'];

            $domain = [['is_company', '=', true]];

            $odooRecords = $odoo->searchRead($odooModel, $domain, $fields);

            if (empty($odooRecords)) {
                Log::info("No se encontraron pisos en Odoo.");
                return;
            }

            foreach ($odooRecords as $record) {
                // Obtener el ID del usuario comercial asignado en Odoo
                $odooUserId = is_array($record['user_id']) ? $record['user_id'][0] : null;

                $localUser = null;
                if ($odooUserId) {
                    $localUser = User::where('odoo_id', $odooUserId)->first();
                }

                // IMPORTANTE: 'kodigoa' no puede ser null en tu DB.
                // Si Odoo no tiene 'ref', usamos un genérico con el ID.
                $codigo = !empty($record['ref']) ? $record['ref'] : 'COD-' . $record['id'];

                Pisua::updateOrCreate(
                    ['odoo_id' => $record['id']],
                    [
                        'izena'   => $record['name'],
                        'kodigoa' => $codigo,
                        'user_id' => $localUser?->id,
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
