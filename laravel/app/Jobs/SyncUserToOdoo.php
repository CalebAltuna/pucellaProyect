<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncUserToOdoo implements ShouldQueue
{
    use Queueable;

    protected User $user;
    protected string $defaultOdooPassword = 'myodoo';

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle(OdooService $odoo): void
    {
        // IDs de grupos en tu Odoo (asegúrate de que el 12 existe como Coordinador)
        $internalUserGroupId = 1;
        $cordGroupId = 12;

        try {
            // 1. Verificar si el usuario ya existe en Odoo por su email (login)
            $existingUser = $odoo->search('res.users', [['login', '=', $this->user->email]]);

            if (!empty($existingUser)) {
                // Si existe, simplemente recuperamos el ID
                $odoo_id = $existingUser[0];
                Log::info("Erabiltzailea jada Odoon zegoen IDarekin: " . $odoo_id);
            } else {
                // 2. Si no existe, lo creamos
                $data = [
                    'name' => $this->user->name,
                    'login' => $this->user->email,
                    'password' => $this->defaultOdooPassword,
                    'active' => true,
                    'email' => $this->user->email,
                ];

                // Si es coordinador, le asignamos los grupos especiales
                if ($this->user->mota === 'koordinatzailea') {
                    $data['groups_id'] = [
                        [4, $internalUserGroupId],
                        [4, $cordGroupId],
                    ];
                }

                $odoo_id = $odoo->create('res.users', $data);
                Log::info("Erabiltzaile berria sortu da Odoon: " . $odoo_id);
            }

            // 3. Actualizar nuestro modelo en Laravel con el ID de Odoo
            $this->user->update([
                'odoo_id' => $odoo_id,
                'synced' => true,
                'sync_error' => null,
            ]);

        } catch (\Exception $e) {
            Log::error("Errorea SyncUserToOdoo-n: " . $e->getMessage());
            $this->user->update([
                'sync_error' => $e->getMessage(),
            ]);
            throw $e; // Reintentar el Job si falla
        }
    }
}
