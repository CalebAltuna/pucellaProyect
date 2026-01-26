<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('atazak', function (Blueprint $table) {
            $table->id();
            $table->string('izena');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('arduraduna_id')->constrained('users');
            $table->enum('egoera', ['egiteko', 'egiten', 'egina', 'atzeratua'])
                ->default('egiteko');
            $table->date('data');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atazak');
    }
};
