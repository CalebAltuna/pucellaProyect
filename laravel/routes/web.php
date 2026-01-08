<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;


/* -------------------  PÚBLICAS  ------------------- */
Route::get('/', fn() => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');

// Ziggy siempre verá estas dos rutas
Route::get('pisua/sortu', [PisoController::class, 'create'])->name('pisua.sortu')->middleware(['auth', 'verified']);   // o solo 'auth' si prefieres

Route::get('pisua/erakutsi', [PisoController::class, 'index'])
    ->name('pisua.index')
    ->middleware(['auth', 'verified']);

/* -------------------  PROTEGIDAS  ----------------- */
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard');

    // el resto de operaciones que SÍ requieren estar logueado
    Route::prefix('pisua')->name('pisua.')->group(function () {
        Route::post('/', [PisoController::class, 'store'])->name('store');
        Route::get('zurePisuak', [PisoController::class, 'zurePisuak'])->name('zurePisuak');
        Route::get('{pisua}/edit', [PisoController::class, 'edit'])->name('edit');
        Route::put('{pisua}', [PisoController::class, 'update'])->name('update');
        Route::delete('{pisua}', [PisoController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/settings.php';
