<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('atazak', function (Blueprint $table) {
            // Agregar campos de sincronización con Odoo si no existen
            if (!Schema::hasColumn('atazak', 'odoo_id')) {
                $table->unsignedBigInteger('odoo_id')->nullable()->after('pisua_id');
            }

            if (!Schema::hasColumn('atazak', 'synced')) {
                $table->boolean('synced')->default(false)->after('odoo_id');
            }

            if (!Schema::hasColumn('atazak', 'sync_error')) {
                $table->text('sync_error')->nullable()->after('synced');
            }
        });
    }

    public function down(): void
    {
        Schema::table('atazak', function (Blueprint $table) {
            $table->dropColumn(['odoo_id', 'synced', 'sync_error']);
        });
    }
};
