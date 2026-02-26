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
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ]) : null,
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

            'cart' => function () use ($request) {
                $user = $request->user();
                if (! $user) {
                    return [
                        'items' => [],
                        'count' => 0,
                        'subtotal' => 0,
                    ];
                }

                $cartItems = $user->carts()
                    ->with('product.files')
                    ->get();

                $mappedItems = $cartItems->map(function ($item) use ($user) {
                    $firstFile = $item->product->files->first();
                    $price = $item->product->getPriceForUser($user);

                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'sku' => $item->product->sku,
                        'name' => $item->product->name,
                        'description' => $item->product->description,
                        'buy_price' => $price,
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

            'pending_tickets_count' => function () use ($request) {
                $user = $request->user();
                if ($user && $user->can('support_tickets.view')) {
                    return \App\Models\SupportTicket::where('status', 'pending')->count();
                }

                return 0;
            },
            'app_url' => config('app.url'),
        ];
    }
}
