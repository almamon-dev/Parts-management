<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'pp_id', 'part_type_id', 'shop_view_id', 'sorting_id', 'description',
        'buy_price', 'list_price', 'stock_oakville',
        'stock_mississauga', 'stock_saskatoon', 'sku',
        'location_id', 'visibility', 'is_clearance',
    ];

    protected $casts = [
        'buy_price' => 'decimal:2',
        'list_price' => 'decimal:2',
        'is_clearance' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($product) {
            if (! $product->pp_id) {
                $last = static::orderBy('id', 'desc')->first();
                $nextNumber = $last ? intval(substr($last->pp_id, 2)) + 1 : 110001;
                $product->pp_id = 'PP'.$nextNumber;
            }
        });

        static::deleting(function ($product) {
            foreach ($product->files as $file) {
                \App\Helpers\Helper::deleteFile($file->file_path);
                \App\Helpers\Helper::deleteFile($file->thumbnail_path);
            }
        });
    }

    // ==========================================
    // Local Scopes (Query Refactoring)
    // ==========================================

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q, $search) {
            $q->where(function ($inner) use ($search) {
                $inner->where('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('partsNumbers', fn ($pq) => $pq->where('part_number', 'like', "%{$search}%"));
            });
        });
    }

    public function scopeFilterFitment($query, $filters)
    {
        if (! empty($filters['year_from']) || ! empty($filters['make']) || ! empty($filters['model'])) {
            $query->whereHas('fitments', function ($f) use ($filters) {
                if (! empty($filters['year_from'])) {
                    $f->where('year_from', '<=', $filters['year_from'])
                        ->where('year_to', '>=', $filters['year_from']);
                }
                if (! empty($filters['make'])) {
                    $f->where('make', $filters['make']);
                }
                if (! empty($filters['model'])) {
                    $f->where('model', $filters['model']);
                }
            });
        }

        return $query;
    }

    public function scopeFilterCategories($query, $filters)
    {
        $query->when($filters['category'] ?? null, fn ($q, $cat) => $q->whereHas('partType', fn ($c) => $c->where('name', $cat)));
        $query->when($filters['shop_view'] ?? null, fn ($q, $sv) => $q->whereHas('shopView', fn ($c) => $c->where('name', $sv)));
        $query->when($filters['sorting'] ?? null, fn ($q, $s) => $q->whereHas('sorting', fn ($c) => $c->where('name', $s)));

        return $query;
    }

    public function scopeSortByPositionCategory($query)
    {
        return $query->select('products.*')
            ->leftJoin('categories as sorting_cat', 'products.sorting_id', '=', 'sorting_cat.id')
            ->orderByRaw("CASE 
                WHEN sorting_cat.name = 'Front' THEN 1 
                WHEN sorting_cat.name = 'Driver Side' THEN 2 
                WHEN sorting_cat.name = 'Passenger Side' THEN 3 
                WHEN sorting_cat.name = 'Rear Side' THEN 4 
                WHEN sorting_cat.name = 'Interior' THEN 5 
                ELSE 6 END ASC")
            ->latest('products.created_at');
    }

    public function scopeWithUserContext($query, $userId)
    {
        return $query->with(['partType:id,name', 'shopView:id,name', 'sorting:id,name', 'partsNumbers', 'files', 'fitments'])
            ->withExists(['favourites as is_favorite' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->withExists(['carts as in_cart' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }]);
    }

    // ==========================================
    // Relationships
    // ==========================================

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
