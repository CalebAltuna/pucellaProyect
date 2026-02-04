<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Gastuak extends Model
{
    use HasFactory;

    protected $table = 'gastuak';

    protected $fillable = [
        'izena',
        'deskribapena',
        'totala',
        'oharrak',
        'pisua_id',
        'user_erosle_id',
        'odoo_id',
        'synced',
        'sync_error',
    ];

    // Relación con el usuario que pagó (asumiendo que hay un erosle_id en la tabla)
    public function erosle(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function ordaintzaileak(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'gastu_user', 'gastuak_id', 'user_id')
            ->withPivot('kopurua')
            ->withTimestamps();
    }

    public function pisua(): BelongsTo
    {
        return $this->belongsTo(Pisua::class);
    }
}
