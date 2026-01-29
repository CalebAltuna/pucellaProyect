<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Ataza;
use App\Models\Pisua; // No olvides importar el modelo
use App\Jobs\SyncUserToOdoo;
use App\Jobs\SyncPisuaToOdoo;
use Illuminate\Database\Seeder;



class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear o actualizar el Coordinador
        // Usamos updateOrCreate para que no falle por "email duplicado"
        $cord = User::updateOrCreate(
            ['email' => 'haritz@gmail.com'],
            [
                'name' => 'Haritz kordinatzailea',
                'password' => Hash::make('password'),
                'mota' => 'koordinatzailea',
            ]
        );

        if (!$cord->synced) {
            SyncUserToOdoo::dispatch($cord);
        }

        Pisua::updateOrCreate(
            ['kodigoa' => 'SS-001'], // Clave única para identificar el piso
            [
                'izena' => 'Piso aretxabaleta',
                'user_id' => $cord->id,
                'synced' => false,
            ]
        );

        $pisua = Pisua::where('kodigoa', 'SS-001')->first();
        if ($pisua && !$pisua->synced) {
            SyncPisuaToOdoo::dispatch($pisua);
        }

        Ataza::updateOrCreate([
            'izena' => 'Lehenengo Ataza',
            'user_id' => $cord->id,
            'pisua_id' => $pisua->id,
            'egoera' => 'egiteko',
            'data' => now(),
        ], [
            'izena' => 'Lehenengo Ataza',
            'user_id' => $cord->id,
            'pisua_id' => $pisua->id,
            'egoera' => 'egiteko',
            'data' => now(),
        ]);


        $this->command->info('Seeder ejecutado: Usuario, Piso y Ataza creados/actualizados.');
    }
}
