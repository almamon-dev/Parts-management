<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductSnapshot
{
    public static function get(Request $request)
    {
        $perPage = $request->per_page ?? 10;

        $query = Product::query()
            ->select([
                'id', 'pp_id', 'sku', 'description', 'visibility',
                'part_type_id', 'shop_view_id', 'sorting_id',
                'created_at', 'list_price', 'buy_price',
                'stock_oakville', 'stock_mississauga', 'stock_saskatoon', 'location_id',
            ])
            ->with([
                'partType' => fn ($q) => $q->select(['id', 'name']),
                'shopView' => fn ($q) => $q->select(['id', 'name']),
                'sorting' => fn ($q) => $q->select(['id', 'name']),
                'files' => function ($query) {
                    $query->select(['id', 'product_id', 'thumbnail_path', 'file_type'])
                        ->where('file_type', 'like', 'image%')
                        ->orderBy('id', 'asc')
                        ->limit(1);
                },
                'fitments' => fn ($q) => $q->select(['id', 'product_id', 'year_from', 'year_to', 'make', 'model']),
            ])
            ->when($request->status, function ($q, $status) {
                if ($status === 'published') {
                    $q->where('visibility', 'public');
                } elseif ($status === 'draft') {
                    $q->where('visibility', 'draft');
                } elseif ($status === 'private') {
                    $q->where('visibility', 'private');
                } elseif ($status === 'no_image') {
                    $q->whereDoesntHave('files');
                }
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('sku', 'like', "{$search}%")
                        ->orWhere('pp_id', 'like', "{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('partsNumbers', function ($pq) use ($search) {
                            $pq->where('part_number', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->category, fn ($q, $cat) => $q->whereHas('partType', fn ($cq) => $cq->where('name', $cat)))
            ->when($request->category_2, fn ($q, $cat) => $q->whereHas('shopView', fn ($cq) => $cq->where('name', $cat)))
            ->when($request->category_3, fn ($q, $cat) => $q->whereHas('sorting', fn ($cq) => $cq->where('name', $cat)))
            ->latest('id');

        return $query->paginate($perPage)->withQueryString();
    }
}
