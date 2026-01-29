<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\AtazaController;
use App\Http\Controllers\gastuak_controller;

/* -------------------  PÚBLICAS  ------------------- */

Route::get('/', fn() => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');

/* -------------------  PROTEGIDAS  ----------------- */

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [PisoController::class, 'zurePisuak'])->name('dashboard');

    // GRUPO PRINCIPAL: PISUA
    Route::prefix('pisua')->name('pisua.')->group(function () {

        // Rutas de PisoController
        Route::get('zurePisuak', [PisoController::class, 'zurePisuak'])->name('zurePisuak');
        Route::get('sortu', [PisoController::class, 'create'])->name('sortu');
        
        // ESTA RUTA ES 'pisua.store' (Crear Piso) - ¡NO USAR PARA TAREAS!
        Route::post('/', [PisoController::class, 'store'])->name('store'); 

        Route::get('erakutsi', [PisoController::class, 'index'])->name('index');
        Route::get('{pisua}/edit', [PisoController::class, 'edit'])->name('edit');
        Route::get('{pisua}/kudeatu', [PisoController::class, 'showMyPisua'])->name('kudeatu');
        Route::put('{pisua}', [PisoController::class, 'update'])->name('update');
        Route::delete('{pisua}', [PisoController::class, 'destroy'])->name('destroy');

        // SUBGRUPO: GESTIÓN ({pisua}/kudeatu)
        Route::prefix('{pisua}/kudeatu')->group(function () {
            
            // RUTAS DE ATAZAK (Tareas)
            // El nombre final será 'pisua.atazak.store'
            Route::prefix('atazak')->name('atazak.')->group(function () {
                Route::get('/', [AtazaController::class, 'index'])->name('index');
                Route::get('/create', [AtazaController::class, 'create'])->name('create');
                
                // ESTA ES LA RUTA CORRECTA PARA TAREAS: 'pisua.atazak.store'
                Route::post('/', [AtazaController::class, 'store'])->name('store'); 
                
                Route::get('/{ataza}', [AtazaController::class, 'show'])->name('show');
                Route::get('/{ataza}/edit', [AtazaController::class, 'edit'])->name('edit');
                Route::put('/{ataza}', [AtazaController::class, 'update'])->name('update');
                Route::delete('/{ataza}', [AtazaController::class, 'destroy'])->name('destroy');
            });

            // Rutas de Gastuak
            Route::prefix('gastuak')->name('gastuak.')->group(function () {
                Route::get('/', [gastuak_controller::class, 'index'])->name('index');
                Route::get('/create', [gastuak_controller::class, 'create'])->name('create');
                Route::post('/', [gastuak_controller::class, 'store'])->name('store');
                Route::put('/{gastua}', [gastuak_controller::class, 'update'])->name('update');
                Route::delete('/{gastua}', [gastuak_controller::class, 'destroy'])->name('destroy');
            });
        });
    });
});

require __DIR__ . '/settings.php';