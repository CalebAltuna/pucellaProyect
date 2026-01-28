<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gastuak', function (Blueprint $table) {
            $table->id();
            $table->string('izena');
            $table->text('deskribapena')->nullable();
            $table->decimal('totala', 10, 2);

            // erlazioak
            $table->foreignId('pisua_id')->constrained('pisua')->onDelete('cascade');
            $table->foreignId('user_erosle_id')->constrained('users');

            // Odoo atala
            $table->unsignedBigInteger('odoo_id')->nullable();
            $table->boolean('synced')->default(false);
            $table->text('sync_error')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gastuak');
    }
};
