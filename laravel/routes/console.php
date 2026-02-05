<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\SyncOdooToUser;
use App\Jobs\SyncOdooToPisua;
use App\Jobs\SyncOdooToAtazak;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// --- KOMANDOAK ---
Artisan::command('odoo:sync-users', function () {
    $this->info('Iniciando sincronización de usuarios desde Odoo...');
    SyncOdooToUser::dispatchSync();
    $this->info('¡Usuarios sincronizados correctamente!');
})->purpose('Importa o actualiza usuarios desde Odoo');

Artisan::command('odoo:sync-pisuak', function () {
    $this->info('Iniciando sincronización de pisos desde Odoo...');
    SyncOdooToPisua::dispatchSync();
    $this->info('¡Pisos sincronizados correctamente!');
})->purpose('Importa o actualiza los pisos desde Odoo');

Artisan::command('odoo:sync-atazak', function () {
    $this->info('Iniciando sincronización de atazak desde Odoo...');
    SyncOdooToAtazak::dispatchSync();
    $this->info('¡Atazak sincronizados correctamente!');
})->purpose('Importa o actualiza las tareas (atazak) desde Odoo');

// ---(CRONA) ---
Schedule::job(new SyncOdooToUser)->hourly();      // A en punto (XX:00)
Schedule::job(new SyncOdooToPisua)->hourlyAt(5);  // A y cinco (XX:05)
Schedule::job(new SyncOdooToAtazak)->hourlyAt(10);