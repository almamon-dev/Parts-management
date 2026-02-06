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
        'username', 'customer_number', 'user_type', 'first_name', 'last_name', 'email', 'password', 'position', 'phone_number',
        'profile_photo', 'company_name', 'address', 'company_phone', 'account_type',
        'store_hours', 'marketing_emails', 'order_confirmation',
        'order_cancellation', 'monthly_statement', 'is_verified', 'email_verified_at', 'reset_password_token', 'reset_password_token_expire_at',
        'discount_rate', 'total_purchases', 'total_returns',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'store_hours' => 'array',
        'marketing_emails' => 'boolean',
        'order_confirmation' => 'boolean',
        'order_cancellation' => 'boolean',
        'monthly_statement' => 'boolean',
        'discount_rate' => 'decimal:2',
        'total_purchases' => 'decimal:2',
        'total_returns' => 'decimal:2',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function isAdmin(): bool
    {
        return trim($this->user_type) === 'admin';
    }

    protected static function booted()
    {
        static::creating(function ($user) {
            if (! $user->customer_number) {
                // Get the last customer number from DB
                $lastUser = static::whereNotNull('customer_number')
                    ->where('customer_number', 'LIKE', 'CT%')
                    ->orderBy('id', 'desc')
                    ->first();

                $nextNumber = $lastUser ? (intval(substr($lastUser->customer_number, 2)) + 1) : 5101;
                $user->customer_number = 'CT'.$nextNumber;
            }

            // Also set username to customer_number as per request
            if (! $user->username) {
                $user->username = $user->customer_number;
            }
        });

        static::deleting(function ($user) {
            if ($user->profile_photo) {
                \App\Helpers\Helper::deleteFile($user->profile_photo);
            }
        });
    }

    /**
     * Get the OTPs for the user.
     */
    public function otps(): HasMany
    {
        return $this->hasMany(Otp::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function productDiscounts()
    {
        return $this->hasMany(UserProductDiscount::class);
    }

    public function userAddresses()
    {
        return $this->hasMany(UserAddress::class);
    }
}
