<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Importante
use App\Enums\Egoera;

class Ataza extends Model
{
    use HasFactory;

    protected $table = 'atazak';

    protected $fillable = [
        'izena',
        'user_id',
        'arduraduna_id',
        'egoera',
        'data',
    ];

    protected $casts = [
        'data' => 'date',
        'egoera' => Egoera::class,
    ];

    /**
     * Obtiene el usuario que creó la tarea (egilea).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Obtiene el usuario responsable de realizar la tarea (arduraduna).
     */
    public function arduraduna(): BelongsTo
    {
        return $this->belongsTo(User::class, 'arduraduna_id');
    }
}
