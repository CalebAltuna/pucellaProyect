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
        // IDs de grupos de Odoo (Verifica estos IDs en tu Odoo)
        $internalUserGroupId = 1;  // Permite loguearse (Usuario Interno)
        $adminSettingsGroupId = 2; // Ejemplo de ID de grupo de Administración/Ajustes que queremos EVITAR

        try {
            $existingUser = $odoo->search('res.users', [['login', '=', $this->user->email]]);

            if (!empty($existingUser) && is_array($existingUser)) {
                $odoo_id = $existingUser[0];
                Log::info("El usuario ya existe con ID: " . $odoo_id);
            } else {
                $data = [
                    'name' => $this->user->name,
                    'login' => $this->user->email,
                    'password' => $this->defaultOdooPassword,
                    'active' => true,
                    'email' => $this->user->email,
                    /**
                     * EXPLICACIÓN DE LOS GRUPOS:
                     * [4, ID] -> Añade el grupo
                     * [3, ID] -> Quita el grupo (útil si el template lo añade por defecto)
                     */
                    'groups_id' => [
                        [4, $internalUserGroupId], // Damos acceso para loguearse
                    ],
                ];

                // Si es coordinador, le das acceso a SUS herramientas, pero NO a ajustes
                if ($this->user->mota === 'koordinatzailea') {
                    $data['groups_id'][] = [4, 12]; // Tu grupo de Coordinador
                }

                $odoo_id = $odoo->create('res.users', $data);
                Log::info("Usuario creado sin permisos de admin: " . $odoo_id);
            }

            $this->user->update([
                'odoo_id' => $odoo_id,
                'synced' => true,
            ]);

        } catch (\Exception $e) {
            Log::error("Error en SyncUserToOdoo: " . $e->getMessage());
            $this->user->update(['sync_error' => $e->getMessage()]);
            throw $e;
        }
    }
}
