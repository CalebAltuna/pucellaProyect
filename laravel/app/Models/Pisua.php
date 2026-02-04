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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    // app/Models/Pisua.php
    public function gastuak() {
        return $this->hasMany(Gastuak::class);
    }

    public function atazak() {
        return $this->hasMany(Ataza::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pisua_user');
    }


    public function gastuak(): HasMany
    {
        return $this->hasMany(Gastuak::class, 'pisua_id');
    }

    public function atazak(): HasMany
    {
        return $this->hasMany(Ataza::class, 'pisua_id');
    }
}