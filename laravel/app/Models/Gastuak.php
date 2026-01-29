<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class gastuak extends Model
{
    protected $fillable = [
        'izena',
        'deskribapena',
        'totala',
        'pisua_id',
        'odoo_id',
        'synced',
        'sync_error',
    ];

    // Para saber quiénes pagan/participan y cuánto cada uno
    public function ordaintzaileak(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'gastu_user', 'gastuak_id', 'user_id')
                    ->withPivot('kopurua')
                    ->withTimestamps(); // Recomendado para trazabilidad
    }

    public function pisua(): BelongsTo
    {
        return $this->belongsTo(Pisua::class, 'pisua_id');
    }
}
