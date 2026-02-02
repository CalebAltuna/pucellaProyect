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
        Schema::table('gastuak', function (Blueprint $table) {
            // Verificamos si no existe por si acaso
            if (!Schema::hasColumn('gastuak', 'egoera')) {
                $table->string('egoera')->default('ordaintzeko')->after('totala');
            }
        });
    }

    public function down(): void
    {
        Schema::table('gastuak', function (Blueprint $table) {
            $table->dropColumn('egoera');
        });
    }
};
