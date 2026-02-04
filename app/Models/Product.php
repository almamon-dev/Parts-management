<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'pp_id', 'part_type_id', 'shop_view_id', 'sorting_id', 'description',
        'buy_price', 'list_price', 'stock_oakville',
        'stock_mississauga', 'stock_saskatoon', 'sku',
        'location_id', 'visibility', 'position', 'is_clearance',
    ];

    protected $casts = [
        'buy_price' => 'decimal:2',
        'list_price' => 'decimal:2',
        'is_clearance' => 'boolean',
    ];

    protected static function booted()
    {
        static::deleting(function ($product) {
            foreach ($product->files as $file) {
                \App\Helpers\Helper::deleteFile($file->file_path);
                \App\Helpers\Helper::deleteFile($file->thumbnail_path);
            }
        });
    }

    public function partType()
    {
        return $this->belongsTo(Category::class, 'part_type_id');
    }

    public function shopView()
    {
        return $this->belongsTo(Category::class, 'shop_view_id');
    }

    public function sorting()
    {
        return $this->belongsTo(Category::class, 'sorting_id');
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

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function quoteItems()
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function userProductDiscounts()
    {
        return $this->hasMany(UserProductDiscount::class);
    }

    /**
     * Calculate the dynamic price for a specific user.
     * Logic: Specific User-Product Discount > User Global Discount > Default List Price
     * Note: list_price is the base/original price, discounts are applied to calculate the final price
     */
    public function getPriceForUser($user)
    {
        if (! $user) {
            return $this->list_price;
        }

        // 1. Check for specific user-product discount (Override)
        $specificDiscount = $this->userProductDiscounts()
            ->where('user_id', $user->id)
            ->first();

        if ($specificDiscount && $specificDiscount->discount_rate > 0) {
            return $this->list_price * (1 - $specificDiscount->discount_rate / 100);
        }

        // 2. Check for user-wide discount rate (Global)
        if ($user->discount_rate > 0) {
            return $this->list_price * (1 - $user->discount_rate / 100);
        }

        // Default to the standard list_price (no discount)
        return $this->list_price;
    }
}
