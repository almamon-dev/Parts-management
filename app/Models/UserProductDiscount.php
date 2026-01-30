<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProductDiscount extends Model
{
    protected $fillable = ['user_id', 'product_id', 'discount_rate'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
