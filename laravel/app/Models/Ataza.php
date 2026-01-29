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

      public function pisua(): BelongsTo
    {
        return $this->belongsTo(Pisua::class, 'pisua_id');
    }

    /**
     * Obtiene el usuario responsable de realizar la tarea (arduraduna).
     */
public function arduradunak()
{
    // Esto permite obtener todos los responsables de la tarea
    return $this->belongsToMany(User::class, 'ataza_user', 'atazak_id', 'user_id');
}
}
