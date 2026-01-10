<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'carts';

    protected $fillable = ['user_id', 'product_id', 'quantity'];

    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id');
    }

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
    }
}
