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
            $table->string('egilea');
            $table->string('arduraduna');
            $table->string('egoera')->default('egiteko');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atazak');
    }
};
