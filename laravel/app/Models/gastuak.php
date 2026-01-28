<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class gastuak extends Model
{
    //
        protected $fillable = [
        'id',
        'izena',
        'deskribapena',
        'gastu_mota',
        'user_erosle_id',
        'user_partaide_id',
        'totala',
        'odoo_id',
        'synced',
        'sync_error',
    ];
}
