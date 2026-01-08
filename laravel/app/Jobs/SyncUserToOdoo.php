<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncUserToOdoo implements ShouldQueue
{
    use Queueable;

    protected User $user;
    protected string $defaultOdooPassword = '123456';

    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(OdooService $odoo): void
    {
        $internalUserGroupId = 1;
        $cordGroupId = 12;
        try {
            if ($this->user->mota === 'koordinatzailea') {
                $odoo_id = $odoo->create('res.users', [
                    'name' => $this->user->name,
                    'login' => $this->user->email,
                    'password' => $this->defaultOdooPassword,
                    'active' => true,
                    'groups_id' => [
                        [4, $internalUserGroupId], // Internal User group ID in Odoo
                        [4, $cordGroupId], // Manager group ID in Odoo
                    ],
                ]);

                $this->user->update([
                    'odoo_id' => $odoo_id,
                    'synced' => true,
                    'sync_error' => null,
                ]);
            } /* else {
                $odoo->create('res.users', [
                    'name' => $this->user->name,
                    'login' => $this->user->email,
                    'password' => $this->defaultOdooPassword,
                    'active' => true,
                ]);
            } */
        } catch (\Exception $e) {
            $this->user->update([
                'sync_error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
