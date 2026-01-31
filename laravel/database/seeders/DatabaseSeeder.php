<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Ataza;
use App\Models\Pisua;
use App\Jobs\SyncUserToOdoo;
use App\Jobs\SyncPisuaToOdoo;
use Illuminate\Database\Seeder;

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

        if (!$cord->synced) {
            SyncUserToOdoo::dispatch($cord);
        }

        // 2. Crear o actualizar el Piso
        $pisua = Pisua::updateOrCreate(
            ['kodigoa' => 'SS-001'],
            [
                'izena' => 'Piso aretxabaleta',
                'user_id' => $cord->id, // Esto es el creador/coordinador, NO los usuarios del piso
                'synced' => false,
            ]
        );

        // 3. ¡IMPORTANTE! Asignar el usuario al piso (tabla pivote pisua_user)
        // Esto es lo que hace que $pisua->users devuelva algo
        $pisua->users()->sync([$cord->id]);

        // Opcional: Crear más usuarios y asignarlos al piso
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

        // Asignar múltiples usuarios al piso
        $pisua->users()->sync([$cord->id, $user2->id, $user3->id]);

        // O usar attach() para añadir sin eliminar los anteriores
        // $pisua->users()->attach([$user2->id, $user3->id]);

        if ($pisua && !$pisua->synced) {
            SyncPisuaToOdoo::dispatch($pisua);
        }

        // 4. Crear tarea
        Ataza::updateOrCreate([
            'izena' => 'Lehenengo Ataza',
            'pisua_id' => $pisua->id,
        ], [
            'izena' => 'Lehenengo Ataza',
            'user_id' => $cord->id,
            'pisua_id' => $pisua->id,
            'egoera' => 'egiteko',
            'data' => now(),
        ]);

        $this->command->info('Seeder ejecutado: Usuario, Piso (con usuarios asignados) y Ataza creados/actualizados.');

        // Mostrar información útil
        $this->command->info("\n=== INFORMACIÓN DE DEBUG ===");
        $this->command->info("Piso ID: " . $pisua->id);
        $this->command->info("Usuarios asignados al piso: " . $pisua->users()->count());
        $this->command->info("Usuarios: " . implode(', ', $pisua->users->pluck('name')->toArray()));

        // Verificar tabla pivote directamente
        $count = \DB::table('pisua_user')->where('pisua_id', $pisua->id)->count();
        $this->command->info("Registros en pisua_user para este piso: " . $count);
    }
}
