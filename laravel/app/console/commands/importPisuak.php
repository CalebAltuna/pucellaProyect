<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pisua;
use App\Services\OdooService;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ImportPisuak extends Command
{
    protected $signature = 'odoo:sync-pisuak';
    protected $description = 'pisuak Odoo-tik inportatu eta SQLite eguneratu';

    public function handle(OdooService $odoo): void
    {
        try {
            Log::info("Iniciando sincronización: Odoo -> Laravel (Pisuak)");

            $odooModel = 'res.partner';
            $fields = ['id', 'name', 'user_id', 'ref'];

            $domain = [['is_company', '=', true]];

            $odooRecords = $odoo->searchRead($odooModel, $domain, $fields);

            if (empty($odooRecords)) {
                Log::info("No se encontraron pisos en Odoo.");
                return;
            }

            foreach ($odooRecords as $record) {
                $odooUserId = is_array($record['user_id']) ? $record['user_id'][0] : null;

                $localUser = null;
                if ($odooUserId) {
                    $localUser = User::where('odoo_id', $odooUserId)->first();
                }

                $codigo = !empty($record['ref']) ? $record['ref'] : 'COD-' . $record['id'];

                Pisua::updateOrCreate(
                    ['odoo_id' => $record['id']],
                    [
                        'izena' => $record['name'],
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
