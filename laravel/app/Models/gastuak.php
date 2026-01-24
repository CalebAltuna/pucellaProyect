<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class gastuak extends Model
{
    //
    use HasFactory;
    protected $fillable = [
        'izena',
        'diruKopurua',
        'data',
        'deskribapena',
        //info extra
        'user_id',
        'pisua_id,',
        'odoo_id',
        'synced',
        'sync_error',
    ];

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

}