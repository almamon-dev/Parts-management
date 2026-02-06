<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_name',
        'manager_name',
        'contact_number',
        'street_address',
        'city',
        'province',
        'post_code',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
