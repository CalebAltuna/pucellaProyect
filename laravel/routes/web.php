<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PisoController;
use App\Http\Controllers\AtazaController;
use App\Http\Controllers\gastuak_controller;
use App\Http\Controllers\JakinarazpenakController;
use Illuminate\Http\Request; // <--- NECESARIO PARA EL BUSCADOR
use App\Models\User;           // <--- NECESARIO PARA EL BUSCADOR

/* -------------------   PÚBLICAS   ------------------- */
Route::get('/', fn() => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');

/* -------------------   PROTEGIDAS   ----------------- */
Route::middleware(['auth', 'verified'])->group(function () {

    // =========================================================================
    //  BUSCADOR DE USUARIOS (NUEVO)
    //  Esta ruta responde al autocompletado del Modal "Kidea gonbidatu"
    // =========================================================================
    Route::get('/api/users/search', function (Request $request) {
        $query = $request->get('query');

        // Si escribe menos de 3 letras, no buscamos nada para no saturar
        if (strlen($query) < 3)
            return [];

        return User::query()
            ->where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->select('id', 'name', 'email') // Solo devolvemos lo necesario
            ->limit(5)
            ->get();
    });
    // =========================================================================

    Route::get('dashboard', [PisoController::class, 'zurePisuak'])->name('dashboard');

    // GRUPO PRINCIPAL: PISUA
    Route::prefix('pisua')->name('pisua.')->group(function () {

        Route::get('zurePisuak', [PisoController::class, 'zurePisuak'])->name('zurePisuak');
        Route::get('sortu', [PisoController::class, 'create'])->name('sortu');
        Route::post('/', [PisoController::class, 'store'])->name('store');
        Route::get('erakutsi', [PisoController::class, 'index'])->name('index');

        // --- ACCIONES DEL PISO ---
        Route::post('{pisua}/kideak', [PisoController::class, 'addMember'])->name('addMember'); // <--- NUEVA RUTA: AÑADIR MIEMBRO
        Route::get('{pisua}/edit', [PisoController::class, 'edit'])->name('edit');
        Route::get('{pisua}/kudeatu', [PisoController::class, 'showMyPisua'])->name('kudeatu');
        Route::put('{pisua}', [PisoController::class, 'update'])->name('update');
        Route::delete('{pisua}', [PisoController::class, 'destroy'])->name('destroy');

        // --- GRUPO DE GESTIÓN (KUDEATU) ---
        Route::prefix('{pisua}/kudeatu')->group(function () {

            // ATAZAK
            Route::prefix('atazak')->name('atazak.')->group(function () {
                Route::get('/', [AtazaController::class, 'index'])->name('index');
                Route::get('/create', [AtazaController::class, 'create'])->name('create');
                Route::post('/', [AtazaController::class, 'store'])->name('store');

                Route::get('/{ataza}', [AtazaController::class, 'show'])->name('show');
                Route::get('/{ataza}/edit', [AtazaController::class, 'edit'])->name('edit');
                Route::put('/{ataza}', [AtazaController::class, 'update'])->name('update');
                Route::delete('/{ataza}', [AtazaController::class, 'destroy'])->name('destroy');
            });

            // GASTUAK
            Route::prefix('gastuak')->name('gastuak.')->group(function () {
                Route::get('/', [gastuak_controller::class, 'index'])->name('index');
                Route::get('/create', [gastuak_controller::class, 'create'])->name('create');
                Route::post('/', [gastuak_controller::class, 'store'])->name('store');
                Route::put('/{gastua}', [gastuak_controller::class, 'update'])->name('update');
                Route::delete('/{gastua}', [gastuak_controller::class, 'destroy'])->name('destroy');
                Route::post('/{gastua}/toggle/{user}', [gastuak_controller::class, 'toggleUserPayment'])->name('togglePayment');
            });

            // JAKINARAZPENAK
            Route::get('/jakinarazpenak', [JakinarazpenakController::class, 'index'])->name('jakinarazpenak.index');
            Route::post('/jakinarazpenak/mark-as-read', [JakinarazpenakController::class, 'markAsRead'])->name('jakinarazpenak.markAsRead');
            Route::post('/jakinarazpenak/clear-all', [JakinarazpenakController::class, 'clearAll'])->name('jakinarazpenak.clearAll');
        });
    });
});

require __DIR__ . '/settings.php';
