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
Schedule::command('odoo:sync-users')->purpose('Importa o actualiza usuarios desde Odoo')->everyMinute();

Schedule::command('odoo:sync-pisuak')->purpose('Importa o actualiza los pisos desde Odoo')->everyMinute();

Schedule::command('odoo:sync-atazak')->purpose('Importa o actualiza las tareas (atazak) desde Odoo')->everyMinute();
