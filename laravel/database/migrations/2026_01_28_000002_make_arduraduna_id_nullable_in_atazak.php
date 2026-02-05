<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('atazak', function (Blueprint $table) {
            // Hacer arduraduna_id nullable ya que la relación many-to-many
            // se maneja a través de la tabla intermedia ataza_user
            $table->unsignedBigInteger('arduraduna_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('atazak', function (Blueprint $table) {
            $table->unsignedBigInteger('arduraduna_id')->nullable(false)->change();
        });
    }
};
