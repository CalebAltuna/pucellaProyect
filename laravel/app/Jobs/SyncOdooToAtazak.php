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

class SyncOdooToAtazak implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public $tries = 3;

    public function __construct()
    {
        //
    }

    public function handle(): void
    {
        Log::info('Hasieratzen: Odoo (Custom) -> Atazak sinkronizazioa');

        try {
            $odooService = new OdooService();
            
            // 1. CAMBIO IMPORTANTE: Usamos tu modelo personalizado
            $model = 'task_tracer.ataza'; 

            $domain = []; 
            
            // 2. CAMBIO IMPORTANTE: Pedimos los campos de TU modelo en Odoo
            // En tu código anterior usabas 'izena', 'data', 'egoera'.
            $fields = ['id', 'izena', 'data', 'egoera'];

            // Llamamos a Odoo
            $odooTasks = $odooService->searchRead($model, $domain, $fields);

            Log::info('Odoon aurkitutako atazak: ' . count($odooTasks));

            // 3. Guardar en Laravel
            foreach ($odooTasks as $task) {
                
                // Mapeamos los datos de Odoo a Laravel
                Ataza::updateOrCreate(
                    ['odoo_id' => $task['id']], // Buscamos por ID de Odoo
                    [
                        'izena'        => $task['izena'], // Odoo 'izena' -> Laravel 'izena'
                        'data'         => $task['data'] ?? null, // Odoo 'data' -> Laravel 'data'
                        'egoera'       => $task['egoera'] ?? 'egiteko', // Odoo 'egoera' -> Laravel 'egoera'
                        'synced'       => true,
                    ]
                );
            }

            Log::info('Atazak ondo sinkronizatu dira.');

        } catch (Exception $e) {
            Log::error('Errorea SyncOdooToAtazak job-ean: ' . $e->getMessage());
            throw $e;
        }
    }
}