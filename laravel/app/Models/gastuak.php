<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class gastuak extends Model
{
    //
        protected $fillable = [
        'odoo_id',
        'synced',
        'sync_error',
    ];
}
