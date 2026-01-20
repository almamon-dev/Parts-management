<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminProductSnapshot
{
    public static function get(Request $request)
    {
        $filters = $request->only([
            'search', 'status', 'category', 'sub_category', 'per_page', 'page',
        ]);
        $cacheKey = 'admin:products:'.md5(json_encode($filters));

        return Cache::remember($cacheKey, 300, function () use ($request) {
            $perPage = $request->per_page ?? 10;

            return Product::query()
                ->select(['id', 'sku', 'description', 'visibility', 'category_id', 'sub_category_id', 'created_at', 'list_price', 'buy_price', 'stock_oakville', 'stock_mississauga', 'stock_saskatoon', 'location_id'])
                ->with(['category:id,name', 'subCategory:id,name', 'files'])

                ->when($request->status, function ($q, $status) {
                    match ($status) {
                        'published' => $q->where('visibility', 'public'),
                        'draft' => $q->where('visibility', 'draft'),
                        'private' => $q->where('visibility', 'private'),
                        'no_image' => $q->whereDoesntHave('files'),
                        default => null,
                    };
                })
                ->when($request->search, function ($q, $search) {
                    $q->where(function ($qq) use ($search) {
                        $qq->where('sku', 'like', "{$search}%")
                            ->orWhere('description', 'like', "%{$search}%")
                            ->orWhereRelation('partsNumbers', 'part_number', 'like', "%{$search}%");
                    });
                })
                ->when($request->category, fn ($q, $cat) => $q->whereRelation('category', 'name', $cat))
                ->when($request->sub_category, fn ($q, $sub) => $q->whereRelation('subCategory', 'name', $sub))
                ->latest('id')
                ->paginate($perPage) // Standard pagination for page numbers
                ->withQueryString();
        });
    }

    public static function flush(): void
    {
        Cache::flush();
    }
}
