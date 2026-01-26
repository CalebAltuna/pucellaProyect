<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Ataza;
use App\Jobs\SyncUserToOdoo;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $cord = User::create([
            'name' => 'Haritz kordinatzailea',
            'email' => 'haritz@gmail.com',
            'password' => Hash::make('password'),
            'mota' => 'koordinatzailea',
        ]);
        SyncUserToOdoo::dispatch($cord);

        Ataza::create([
            'izena' => 'Lehenengo Ataza',
            'user_id' => $cord->id,
            'arduraduna_id' => $cord->id,
            'egoera' => 'egiteko', // Asegúrate de que este valor coincida con tu Enum Egoera
            'data' => now(),
        ]);
    }
}
