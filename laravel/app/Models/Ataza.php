<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\Egoera;

class Ataza extends Model
{
    use HasFactory;
    protected $table = 'atazak';
    protected $fillable = [
        'izena',
        'user_id',//egilearen id
        'arduraduna_id',//egin behar duenaren id
        'egoera',
        'data',
    ];
    protected $casts = [
        'data' => 'date',
        'egoera' => Egoera::class,
    ];
}
