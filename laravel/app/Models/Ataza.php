<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ataza extends Model
{
    use HasFactory;

    protected $fillable = [
        'izena',
        'egilea',
        'arduraduna',
        'egoera',
    ];
}