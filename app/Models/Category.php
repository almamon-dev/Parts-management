<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $fillable = [
        'name', 'status', 'slug', 'image', 'category_type',
    ];

    protected static function booted()
    {
        static::deleting(function ($category) {
            if ($category->image) {
                \App\Helpers\Helper::deleteFile($category->image);
            }
        });
    }

    public function productsByPartType()
    {
        return $this->hasMany(Product::class, 'part_type_id');
    }

    public function productsByShopView()
    {
        return $this->hasMany(Product::class, 'shop_view_id');
    }

    public function productsBySorting()
    {
        return $this->hasMany(Product::class, 'sorting_id');
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('category_type', $type);
    }
}
