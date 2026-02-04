<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'user_id' //id sortzailea/cordinador
    ];

    /**
     * Conversión de tipos automática.
     * Ayuda a tratar 'synced' como true/false en lugar de 1/0.
     */
    protected $casts = [
        'synced' => 'boolean',
        'odoo_id' => 'integer',
    ];

    public function scopePending($query)
    {
        return $query->where('synced', false);
    }

    public function user()
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

}
