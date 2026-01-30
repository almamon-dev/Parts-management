<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'errors' => function () use ($request) {
                return $request->session()->get('errors')
                    ? $request->session()->get('errors')->getBag('default')->getMessages()
                    : (object) [];
            },
            'settings' => function () {
                return \App\Models\Setting::all()->pluck('value', 'key');
            },

            'cart' => function () {
                if (! auth()->user()) {
                    return [
                        'items' => [],
                        'count' => 0,
                        'subtotal' => 0,
                    ];
                }

                $cartItems = auth()->user()->carts()
                    ->with('product.files')
                    ->get();

                $mappedItems = $cartItems->map(function ($item) {
                    $firstFile = $item->product->files->first();

                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'sku' => $item->product->sku,
                        'name' => $item->product->name,
                        'description' => $item->product->description,
                        'buy_price' => $item->product->buy_price ?? $item->product->list_price,
                        'quantity' => $item->quantity,
                        'image' => \App\Helpers\Helper::generateURL($firstFile?->file_path),
                    ];
                });

                $subtotal = $mappedItems->sum(function ($item) {
                    return $item['buy_price'] * $item['quantity'];
                });

                return [
                    'items' => $mappedItems,
                    'count' => $cartItems->count(),
                    'subtotal' => $subtotal,
                    'total' => $subtotal,
                ];
            },
        ];
    }
}
