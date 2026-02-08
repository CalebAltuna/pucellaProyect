<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Pisua;
use App\Services\OdooService;
use Exception;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncPisuaToOdoo implements ShouldQueue //el implements ShouldQueue hace que se ejecute en la cola, y requiera el queue:work

{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;
    protected Pisua $pisua;

    public function __construct(Pisua $pisua) //recibe el objeto pisua
    {
        $this->pisua = $pisua;
    }
    // el método handle hace todo, es lo importante
    public function handle(OdooService $odoo): void
    {
        try { //bucle para poder verificar y pillar errores
            $this->pisua->loadMissing('user');
            $sortzailea = $this->pisua->user;
            if (!$sortzailea) {
                throw new Exception('El Pisua no tiene usuario asignado (user_id nulo o inválido).');
            }
            if (!$sortzailea->odoo_id) {
                throw new Exception("El coordinador ({$sortzailea->name}) aún no tiene odoo_id. Sincroniza el usuario primero.");
            }
            $data = [
                'name' => $this->pisua->izena,
                'code' => $this->pisua->kodigoa,
                'coordinator_id' => $sortzailea->odoo_id,
            ];
            $odooId = $odoo->create('pisua', $data);
            $this->pisua->update([
                'odoo_id' => $odooId,
                'synced' => true,
                'sync_error' => null
            ]);
        } catch (Exception $e) {
            $this->pisua->update([
                'synced' => false,
                'sync_error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
