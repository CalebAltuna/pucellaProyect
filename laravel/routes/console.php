<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\SyncOdooToUser;
use App\Jobs\SyncOdooToPisua;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// --- COMANDOS MANUALES ---
/**
 * Comando para sincronizar usuarios: php artisan odoo:sync-users
 */
Artisan::command('odoo:sync-users', function () {
    $this->info('Iniciando sincronización de usuarios desde Odoo...');
    SyncOdooToUser::dispatchSync();
    $this->info('¡Usuarios sincronizados correctamente!');
})->purpose('Importa o actualiza usuarios desde Odoo');

/**
 * Comando para sincronizar pisos: php artisan odoo:sync-pisuak
 */
Artisan::command('odoo:sync-pisuak', function () {
    $this->info('Iniciando sincronización de pisos desde Odoo...');
    SyncOdooToPisua::dispatchSync();
    $this->info('¡Pisos sincronizados correctamente!');
})->purpose('Importa o actualiza los pisos desde Odoo');

Schedule::job(new SyncOdooToUser)->hourly();
Schedule::job(new SyncOdooToPisua)->hourlyAt(5);
