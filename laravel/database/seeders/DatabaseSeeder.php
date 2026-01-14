<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
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

    }
}
