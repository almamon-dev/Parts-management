<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'sub_category_id', 'description',
        'buy_price', 'list_price', 'stock_oakville',
        'stock_mississauga', 'stock_saskatoon', 'sku',
        'location_id', 'visibility',
    ];

    protected $casts = [
        'buy_price' => 'decimal:2',
        'list_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function files()
    {
        return $this->hasMany(ProductFile::class);
    }

    public function fitments()
    {
        return $this->hasMany(Fitment::class);
    }

    public function partsNumbers()
    {
        return $this->hasMany(PartsNumber::class, 'product_id');
    }

    public function favourites()
    {
        return $this->hasMany(Favourite::class);
    }
}
