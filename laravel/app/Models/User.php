<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
// IMPORTANTE: Añadir estas dos líneas
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'mota',
        'odoo_id',
        'synced',
        'sync_error',
        'profile_photo_path',
        'biografia',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Pisos en los que vive el usuario
     */
    public function pisuak(): BelongsToMany
    {
        return $this->belongsToMany(Pisua::class, 'pisua_user');
    }

    /**
     * Gastos en los que participa el usuario
     */
    public function gastuak(): BelongsToMany
    {
        // Asegúrate de que el modelo se llame Gastuak (con G mayúscula)
        return $this->belongsToMany(Gastuak::class, 'gastu_user', 'user_id', 'gastuak_id')
            ->withPivot('kopurua');
    }

    /**
     * Tareas asignadas al usuario (Arduraduna)
     */
    public function atazak(): BelongsToMany
    {
        return $this->belongsToMany(Ataza::class, 'ataza_user', 'user_id', 'ataza_id');
    }
}
