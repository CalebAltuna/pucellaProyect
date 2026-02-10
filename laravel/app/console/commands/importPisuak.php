<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pisua;
use App\Services\OdooService;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ImportPisuak extends Command
{
    protected $signature = 'odoo:sync-pisuak';// lo que hace que funcione el console.php
    protected $description = 'pisuak Odoo-tik inportatu eta SQLite eguneratu';//simple description

    public function handle(OdooService $odoo): void //funciona igual que el job, al pedir el odoo service te funciona todo bien
    {
        try {
            Log::info("Iniciando sincronización: Odoo -> Laravel (Pisuak)");//un Log

            $odooModel = 'pisua.pisua';//defines el modelo como odoo

            $fields = ['id', 'name', 'code', 'coordinator_id'];//definimos los field

            $domain = [];

            $odooRecords = $odoo->searchRead($odooModel, $domain, $fields);// lo contrario al create y write. Esto busca en odoo, los fields.

            if (empty($odooRecords)) {
                Log::info("No se encontraron pisos en Odoo.");
                return;
            } //por si está vacío
            
            //devuelve la lista de pisos
            foreach ($odooRecords as $record) {
                $odooUserId = is_array($record['coordinator_id']) ? $record['coordinator_id'][0] : null;

                $localUser = null;
                if ($odooUserId) {
                    $localUser = User::where('odoo_id', $odooUserId)->first();
                }

                Pisua::updateOrCreate(
                    ['odoo_id' => $record['id']],//revisa el tener o no ya el id. Si está update, sino create.
                    [
                        'izena' => $record['name'],
                        'kodigoa' => $record['code'], 
                        'user_id' => $localUser?->id, 
                        'synced' => true,
                    ]
                );
            }

            Log::info("Sincronización finalizada: " . count($odooRecords) . " pisos procesados.");

        } catch (\Exception $e) {
            Log::error("Error sincronizando Odoo a Pisua: " . $e->getMessage());//te da el error en el log.
            throw $e;
        }
    }
}
