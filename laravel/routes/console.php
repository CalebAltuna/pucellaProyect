<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// En Artisan::command SÍ funciona
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// --- KOMANDOAK ---
// En Schedule::command NO existe 'purpose', quítalos:
// Schedule::command('odoo:sync-users')->everyMinute();

Schedule::command('odoo:sync-pisuak')->everyMinute();

// Schedule::command('odoo:sync-atazak')->everyMinute();
