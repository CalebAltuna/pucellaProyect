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
    protected Pisua $pisua;//defino previamente la propiedad que guarda el objeto

    public function __construct(Pisua $pisua) //recibe el objeto pisua, es necesario para poder modificar el ojbeto, y manejarlo. si solo lo importas, no es necesario. Solo para export.
    {
        $this->pisua = $pisua; //al recibir todo el objeto, ya pilla todo lo relacionado con el modelo, sus atributos.
    }
    // el método handle hace todo, es lo importante
    public function handle(OdooService $odoo): void
    {
        try { //bucle para poder verificar y pillar errores

            $this->pisua->loadMissing('user'); //carga los datos que no tiene de user
            $sortzailea = $this->pisua->user;
            //BLOQUE QUE ES EXCLUSIVO POR SER PISO
            //--------------------------------------------------------------------------
            if (!$sortzailea) {
                throw new Exception('El Pisua no tiene usuario asignado (user_id nulo o inválido).'); //por si el user no tiene id, te manda directo al catch
            }
            if (!$sortzailea->odoo_id) {
                throw new Exception("El coordinador ({$sortzailea->name}) aún no tiene odoo_id. Sincroniza el usuario primero."); //por si el que lo crea no tiene odoo id, te manda directo al cathc
            }
            //--------------------------------------------------------------------------
            //Qué hace data? Aquí se relaciona, los campos de Laravel con odoo.
            // 'odooParam' => $this -> pisua -> laravelParam
            $data = [
                'name' => $this->pisua->izena,
                'code' => $this->pisua->kodigoa,
                'coordinator_id' => $sortzailea->odoo_id,//de nuevo linea de pisua, no sería necesaria para otros exports
            ];

            // para no crear duplicados...
            if ($this->pisua->odoo_id) {
                $odoo->write('pisua.pisua', [[$this->pisua->odoo_id], $data]);// Si ya tiene ID, actualizamos (el primer array es el ID a buscar, el segundo los datos) además importante meter le nombre del modelo de odoo
                $odooId = $this->pisua->odoo_id;
            } else {
                // Manda los datos a odoo, si se aceptan pasamos al update
                $odooId = $odoo->create('pisua.pisua', $data);
            }//el update es para actualizar el odoo_id y el synced dentro del propio laravel
            $this->pisua->update([
                'odoo_id' => $odooId,
                'synced' => true,
                'sync_error' => null
            ]);
            //gestion de errores,
        } catch (Exception $e) {
            $this->pisua->update([
                'synced' => false,
                'sync_error' => $e->getMessage() // te dice el error como parametro
            ]);
            throw $e; // para que salga como error, tengo dudas de si en laravel.log o si en el queue:work
        }
    }
}
