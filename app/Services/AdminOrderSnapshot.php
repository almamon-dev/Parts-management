<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminOrderSnapshot
{
    public static function get(Request $request)
    {
        $filters = $request->only([
            'search', 'status', 'per_page', 'page',
        ]);
        $cacheKey = 'admin:orders:'.md5(json_encode($filters));

        return Cache::remember($cacheKey, 180, function () use ($request) {
            $perPage = $request->per_page ?? 10;

            $query = Order::query()
                ->select(['id', 'user_id', 'order_number', 'subtotal', 'tax', 'total_amount', 'status', 'order_type', 'shipping_address', 'created_at'])
                ->whereHas('payment', function ($q) {
                    $q->where('status', 'succeeded');
                })
                ->with([
                    'user:id,first_name,last_name,email',
                    'payment:id,order_id,status,transaction_id',
                ])
                ->withCount('items');

            // Search
            if ($request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            }

            // Status Filter
            if ($request->status && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            return $query->latest('id')->paginate($perPage)->withQueryString();
        });
    }

    public static function flush(): void
    {
        Cache::flush();
    }
}
