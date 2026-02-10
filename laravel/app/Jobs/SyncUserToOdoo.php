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

    protected User $user;//definición previa del user
    protected string $defaultOdooPassword = 'myodoo'; //password por defecto always que tiree, aunque no es la misma que laravel

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
            //busca si existe el user con el mail
            $existingUser = $odoo->search('res.users', [['login', '=', $this->user->email]]);
//----------PARTE EXCLUSIVA USUARIO, NO PUEDE HABER DOS USERS MISMO MAIL------------------------
            if (!empty($existingUser) && is_array($existingUser)) {
                $odoo_id = $existingUser[0];
                Log::info("El usuario ya existe con ID: " . $odoo_id);
            }
//----------------------------------------------------------------------------------------------
            //te crea el usuario en odoo, en base al de laravel
            else {
                $data = [
                    'name' => $this->user->name,
                    'login' => $this->user->email,
                    'password' => $this->defaultOdooPassword, //podrías meter la misma que laravel? creo que sí
                    'active' => true,
                    'email' => $this->user->email,//coge el mail de laravel
                    'groups_id' => [
                        [4, $internalUserGroupId], // En principio solo tiene id de internal_user
                    ],
                ];

                // Si es coordinador, le das acceso a SUS herramientas, pero NO a ajustes
                if ($this->user->mota === 'koordinatzailea') {
                    $data['groups_id'][] = [4, 12]; // Tu grupo de Coordinador
                }

                $odoo_id = $odoo->create('res.users', $data);
                Log::info("Usuario creado sin permisos de admin: " . $odoo_id);
            }
            //una vez te ha pillado que bien, te lo sincroniza, con el odoo_id
            $this->user->update([
                'odoo_id' => $odoo_id,
                'synced' => true,
                'sync_error' => null
            ]);
        //de toda la vida para pillar errores
        } catch (\Exception $e) {
            Log::error("Error en SyncUserToOdoo: " . $e->getMessage());
            $this->user->update(['sync_error' => $e->getMessage()]);
            throw $e;
        }
    }
}
