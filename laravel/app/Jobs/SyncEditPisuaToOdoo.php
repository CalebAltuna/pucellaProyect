<?php

namespace App\Jobs;

use App\Models\Pisua;
use App\Services\OdooService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Exception;


class SyncEditPisuaToOdoo implements ShouldQueue
{
    use Queueable;
    public Pisua $pisua;

    /**
     * Create a new job instance.
     */
    public function __construct(Pisua $pisua)
    {
        //
        $this->pisua = $pisua;
    }

    /**
     * Execute the job.
     */
    public function handle(OdooService $odoo): void
    {
        //
        try {
            $odooId = $odoo->write('pisua', [[$this->pisua->odoo_id],
                'name' => $this->pisua->izena,
                'code' => $this->pisua->kodigoa,
            ]);
            $this->pisua->update([
                'odoo_id' => $odooId,
                'synced' => true,
                'sync_error' => null
            ]);
        } catch (Exception $e) {
            $this->pisua->update([
                'sync_error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

}

