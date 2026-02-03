<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\AtazaController;
use App\Http\Controllers\gastuak_controller;
use App\Http\Controllers\JakinarazpenakController;
/* -------------------   PÚBLICAS   ------------------- */

Route::get('/', fn() => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');

/* -------------------   PROTEGIDAS   ----------------- */

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [PisoController::class, 'zurePisuak'])->name('dashboard');

    // GRUPO PRINCIPAL: PISUA
    // Prefijo URL: /pisua
    Route::prefix('pisua')->name('pisua.')->group(function () {

        // --- Rutas Generales de Piso ---
        Route::get('zurePisuak', [PisoController::class, 'zurePisuak'])->name('zurePisuak');
        Route::get('sortu', [PisoController::class, 'create'])->name('sortu');
        Route::post('/', [PisoController::class, 'store'])->name('store');

        Route::get('erakutsi', [PisoController::class, 'index'])->name('index');
        Route::get('{pisua}/edit', [PisoController::class, 'edit'])->name('edit');
        Route::get('{pisua}/kudeatu', [PisoController::class, 'showMyPisua'])->name('kudeatu');
        Route::put('{pisua}', [PisoController::class, 'update'])->name('update');
        Route::delete('{pisua}', [PisoController::class, 'destroy'])->name('destroy');


        // --- CORRECCIÓN IMPORTANTE ---
        Route::post('/{pisua}/gastuak/{gastua}/toggle/{user}', [gastuak_controller::class, 'toggleUserPayment'])
            ->name('gastuak.togglePayment');


        // --- GRUPO DE GESTIÓN (KUDEATU) ---
        Route::prefix('{pisua}/kudeatu')->group(function () {


            Route::prefix('atazak')->name('atazak.')->group(function () {
                Route::get('/', [AtazaController::class, 'index'])->name('index');
                Route::get('/create', [AtazaController::class, 'create'])->name('create');
                Route::post('/', [AtazaController::class, 'store'])->name('store');
                Route::get('/{ataza}', [AtazaController::class, 'show'])->name('show');
                Route::get('/{ataza}/edit', [AtazaController::class, 'edit'])->name('edit');
                Route::put('/{ataza}', [AtazaController::class, 'update'])->name('update');
                Route::delete('/{ataza}', [AtazaController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('gastuak')->name('gastuak.')->group(function () {
                Route::get('/', [gastuak_controller::class, 'index'])->name('index');
                Route::get('/create', [gastuak_controller::class, 'create'])->name('create');
                Route::post('/', [gastuak_controller::class, 'store'])->name('store');
                Route::put('/{gastua}', [gastuak_controller::class, 'update'])->name('update');
                Route::delete('/{gastua}', [gastuak_controller::class, 'destroy'])->name('destroy');
            });
            Route::get('/jakinarazpenak', [JakinarazpenakController::class, 'index'])
                    ->name('jakinarazpenak.index');

                Route::post('/jakinarazpenak/mark-as-read', [JakinarazpenakController::class, 'markAsRead'])
                    ->name('jakinarazpenak.markAsRead');

                Route::post('/jakinarazpenak/clear-all', [JakinarazpenakController::class, 'clearAll'])
                    ->name('jakinarazpenak.clearAll');
        });
    });
});

require __DIR__ . '/settings.php';
