<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('gastuak', function (Blueprint $table) {
        $table->text('oharrak')->nullable(); // Campo para las notas
    });
}

public function down(): void
{
    Schema::table('gastuak', function (Blueprint $table) {
        $table->dropColumn('oharrak');
    });
}
};
