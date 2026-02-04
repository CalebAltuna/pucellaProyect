<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pisua extends Model
{
    use HasFactory;

    protected $table = 'pisua';

    protected $fillable = [
        'izena',
        'kodigoa',
        'odoo_id',
        'synced',
        'sync_error',
        'user_id'
    ];

    protected $casts = [
        'synced' => 'boolean',
        'odoo_id' => 'integer',
    ];

    public function scopePending($query)
    {
        return $query->where('synced', false);
    }

    /**
     * El creador/dueño del piso.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Los miembros que viven en el piso.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pisua_user');
    }

    /**
     * Gastos asociados al piso.
     */
    public function gastuak(): HasMany
    {
        return $this->hasMany(Gastuak::class, 'pisua_id');
    }

    /**
     * Tareas asociadas al piso.
     */
    public function atazak(): HasMany
    {
        return $this->hasMany(Ataza::class, 'pisua_id');
    }
}
