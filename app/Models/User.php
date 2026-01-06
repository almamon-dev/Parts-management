<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'position', 'phone_number',
        'profile_photo', 'company_name', 'address', 'company_phone', 'account_type',
        'store_hours', 'marketing_emails', 'order_confirmation',
        'order_cancellation', 'monthly_statement', 'is_verified', 'email_verified_at',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'store_hours' => 'array',
        'marketing_emails' => 'boolean',
        'order_confirmation' => 'boolean',
        'order_cancellation' => 'boolean',
        'monthly_statement' => 'boolean',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the OTPs for the user.
     */
    public function otps(): HasMany
    {
        return $this->hasMany(Otp::class);
    }
}
