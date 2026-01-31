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
        Schema::create('pisua', function (Blueprint $table) {
            $table->id(); // ID local de Laravel (SQLite)

            // Datos del Negocio
            $table->string('izena');
            $table->string('kodigoa');

            // Datos de Control (Odoo)
            $table->unsignedBigInteger('odoo_id')->nullable(); // Puede ser nulo al principio
            $table->boolean('synced')->default(false);         // Por defecto NO está sincronizado
            $table->text('sync_error')->nullable();            // Para guardar logs de errores
            $table->unsignedBigInteger('user_id')->nullable(); // Coordinador/Creador del Pisua
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pisua');
    }
};
