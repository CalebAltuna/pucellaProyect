<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// En Artisan::command SÍ funciona
Artisan::command('inspire', function () {//creamos un comando php artisan , y luego le damos la función
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');//un mensaje

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// });

// --- KOMANDOAK ---
Schedule::command('odoo:sync-pisuak')->everyMinute();