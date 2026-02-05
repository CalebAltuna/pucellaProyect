<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Ataza;
use App\Models\Pisua;
use App\Models\Gastuak;
// Si estos archivos no existen físicamente en app/Jobs, darán error.
// Los dejo comentados para que no falle el Seeder.
// use App\Jobs\SyncUserToOdoo;
// use App\Jobs\SyncPisuaToOdoo;
use App\Jobs\SyncAtazaToOdoo;
use App\Jobs\SyncGastuakToOdoo;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear o actualizar el Coordinador
        $cord = User::updateOrCreate(
            ['email' => 'haritz@gmail.com'],
            [
                'name' => 'Haritz kordinatzailea',
                'password' => Hash::make('password'),
                'mota' => 'koordinatzailea',
            ]
        );

        // COMENTADO TEMPORALMENTE PARA EVITAR ERRORES SI NO EXISTE EL JOB
        // if (!$cord->synced) {
        //    SyncUserToOdoo::dispatch($cord);
        // }

        // 2. Crear o actualizar el Piso
        $pisua = Pisua::updateOrCreate(
            ['kodigoa' => 'SS-001'],
            [
                'izena' => 'Piso aretxabaleta',
                'user_id' => $cord->id,
                'synced' => false,
            ]
        );

        // 3. Crear Usuarios Normales
        $user2 = User::updateOrCreate(
            ['email' => 'usuario2@gmail.com'],
            [
                'name' => 'Usuario Normal 2',
                'password' => Hash::make('password'),
                'mota' => 'normala',
            ]
        );

        $user3 = User::updateOrCreate(
            ['email' => 'usuario3@gmail.com'],
            [
                'name' => 'Usuario Normal 3',
                'password' => Hash::make('password'),
                'mota' => 'normala',
            ]
        );

        // 4. VINCULACIÓN: Meter a los usuarios a vivir en el piso
        $pisua->users()->sync([$cord->id, $user2->id, $user3->id]);

        // COMENTADO TEMPORALMENTE
        // if (!$pisua->synced) {
        //    SyncPisuaToOdoo::dispatch($pisua);
        // }

        // 5. Crear una Tarea de ejemplo
        Ataza::updateOrCreate(
            [
                'izena' => 'Lehenengo Ataza',
                'pisua_id' => $pisua->id,
            ],
            [
                'user_id' => $cord->id,
                'egoera' => 'egiteko',
                'data' => now()->addDays(2),
            ]
        );

        // 6. Crear un Gasto (Gastuak)
        $gastu = Gastuak::create([
            'izena' => 'Argiaren faktura',
            'totala' => 90.00,
            'pisua_id' => $pisua->id,
            'user_erosle_id' => $cord->id,
            'egoera' => 'ordaintzeko',
            'synced' => false,
        ]);

        // 7. Repartir el gasto
        $gastu->ordaintzaileak()->attach([
            $cord->id => [
                'kopurua' => 30.00,
                'egoera' => 'ordaindua',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            $user2->id => [
                'kopurua' => 30.00,
                'egoera' => 'ordaintzeko',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            $user3->id => [
                'kopurua' => 30.00,
                'egoera' => 'ordaintzeko',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('Seeder ejecutado con éxito (Jobs de sincronización omitidos).');
    }
}