<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SyncOdooToUser implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //Ez du behar parametrorik, instantzia bat sortzeko eguneratzean.
    }

    public function handle(OdooService $odoo): void
    {
        try {
            Log::info("Iniciando sincronización: Odoo -> users");

            // 1. Traer usuarios de Odoo.
            // Filtramos por active=true y que tengan email (login).
            $odooUsers = $odoo->searchRead(
                'res.users',
                [['active', '=', true]],
                ['id', 'name', 'login', 'email']
            );

            if (empty($odooUsers)) {
                Log::info("No se encontraron usuarios en Odoo para sincronizar.");
                return;
            }

            $count = 0;
            foreach ($odooUsers as $oUser) {
                // Erabiltzailea existitzen da?
                $user = User::where('email', $oUser['login'])
                ->where('name', $oUser['name'])
                ->first();
                if ($user) {
                    // Existitzen bada, eguneratuko dugu
                    $user->update([
                        'name' => $oUser['name'],
                        'odoo_id' => $oUser['id'],
                        'synced' => true,
                    ]);
                } else {
                    // ez bada existitzen sortuko dugu
                    User::create([
                        'name' => $oUser['name'],
                        'email' => $oUser['login'],
                        'odoo_id' => $oUser['id'],
                        'password' => bcrypt('password'), // O una aleatoria
                        'synced' => true,
                    ]);
                }
                $count++;
            }

            Log::info("Sincronización de usuarios completada: {$count} usuarios procesados.");

        } catch (\Exception $e) {
            Log::error("Error en SyncOdooToUser: " . $e->getMessage());
            throw $e;
        }
    }
}
