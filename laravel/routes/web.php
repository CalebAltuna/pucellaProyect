<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;

/* -------------------  PÚBLICAS  ------------------- */

Route::get('/', fn() => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');


/* -------------------  PROTEGIDAS  ----------------- */

Route::middleware(['auth', 'verified'])->group(function () {

    //zurePisuak pisuak kargatzeko
    Route::get('dashboard', [PisoController::class, 'zurePisuak'])->name('dashboard');

    // prefix de Pisos
    Route::prefix('pisua')->name('pisua.')->group(function () {

        // List...
        Route::get('zurePisuak', [PisoController::class, 'zurePisuak'])->name('zurePisuak');

        // Sortu eta store
        Route::get('sortu', [PisoController::class, 'create'])->name('sortu');
        Route::post('/', [PisoController::class, 'store'])->name('store');

        // (index)
        Route::get('erakutsi', [PisoController::class, 'index'])->name('index');

        // Rutas específicas con parámetro (van antes de las genéricas)
        Route::get('{pisua}/edit', [PisoController::class, 'edit'])->name('edit');
        Route::get('{pisua}/kudeatu', [PisoController::class, 'showMyPisua'])->name('kudeatu');
        Route::put('{pisua}', [PisoController::class, 'update'])->name('update');
        Route::delete('{pisua}', [PisoController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
