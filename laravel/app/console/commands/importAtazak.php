<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ataza;
use App\Services\OdooService;
use Illuminate\Support\Facades\Log;

class ImportUsers extends Command
{
    protected $signature = 'odoo:sync-atazak';
    protected $description = 'atazak Odoo-tik inportatu eta SQLite eguneratu';

    public function handle(): void
    {
        Log::info('Hasieratzen: Odoo (Custom) -> Atazak sinkronizazioa');

        try {
            $odooService = new OdooService();

            $model = 'task_tracer.ataza';

            $domain = [];

            $fields = ['id', 'izena', 'data', 'egoera'];

            $odooTasks = $odooService->searchRead($model, $domain, $fields);

            Log::info('Odoon aurkitutako atazak: ' . count($odooTasks));

            foreach ($odooTasks as $task) {

                Ataza::updateOrCreate(
                    ['odoo_id' => $task['id']],
                    [
                        'izena'        => $task['izena'],
                        'data'         => $task['data'] ?? null,
                        'egoera'       => $task['egoera'] ?? 'egiteko',
                        'synced'       => true,
                    ]
                );
            }

            Log::info('Atazak ondo sinkronizatu dira.');

        } catch (\Exception $e) {
            Log::error('Errorea SyncOdooToAtazak job-ean: ' . $e->getMessage());
            throw $e;
        }
    }
}
