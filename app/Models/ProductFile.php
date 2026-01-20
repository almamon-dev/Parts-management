<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductFile extends Model
{
    protected $fillable = [
        'product_id',
        'file_name',
        'file_path',
        'thumbnail_path',
        'file_size',
        'file_type',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
