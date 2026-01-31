<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ataza extends Model
{
    use HasFactory;

    protected $table = 'atazak';

    protected $fillable = ['izena', 'user_id', 'pisua_id', 'egoera', 'data'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el Piso
    public function pisua()
    {
        return $this->belongsTo(Pisua::class, 'pisua_id');
    }

    public function arduradunak()
    {
        return $this->belongsToMany(User::class, 'ataza_user');
    }
}
