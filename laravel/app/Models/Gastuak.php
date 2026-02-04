<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <--- Faltaba esto
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // <--- Y esto

class Gastuak extends Model // Asegúrate de que la clase empiece por Mayúscula (estándar PSR-4)
{
    use HasFactory;

    protected $table = 'gastuak'; // Aseguramos que apunte a la tabla correcta

    protected $fillable = [
        'izena',
        'deskribapena',
        'totala',
        'pisua_id',
        'user_erosle_id', // <--- AÑADIDO: Necesario si quieres guardar quién pagó
        'odoo_id',
        'synced',
        'sync_error',
    ];

    // Relación: Quién ha pagado el gasto (Un usuario)
    public function eroslea(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_erosle_id');
    }

    // Relación: Usuarios implicados en el gasto (Muchos a Muchos)
    public function ordaintzaileak(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'gastu_user', 'gastuak_id', 'user_id')
                    ->withPivot('kopurua')
                    ->withTimestamps();
    }

    public function pisua(): BelongsTo
    {
        return $this->belongsTo(Pisua::class, 'pisua_id');
    }
}