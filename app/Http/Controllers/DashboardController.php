<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Order;
use App\Models\Quote;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user && $user->isAdmin()) {
            $leads = \App\Models\Lead::latest()->take(10)->get();
            $onlineOrders = \App\Models\Order::with(['user', 'items'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer' => $order->user ? $order->user->name : 'N/A',
                        'type' => 'Delivery', // Mocked as delivery/pickup info isn't in Order model yet
                        'items' => $order->items->count(),
                        'date' => $order->created_at->format('m/d/Y'),
                        'status' => ucfirst($order->status),
                    ];
                });

            $returnRequests = \App\Models\ReturnRequest::with(['user', 'order.items'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($req) {
                    return [
                        'id' => $req->id,
                        'return_number' => $req->return_number,
                        'customer' => $req->user ? $req->user->name : 'N/A',
                        'type' => 'Delivery',
                        'items' => $req->order && $req->order->items ? $req->order->items->count() : 0,
                        'date' => $req->created_at->format('m/d/Y'),
                        'status' => ucfirst($req->status),
                    ];
                });

            // Products stats
            $totalProducts = \App\Models\Product::count();
            $productsWithImages = \App\Models\Product::has('files')->count();
            $productsWithoutImages = $totalProducts - $productsWithImages;

            $listingsStats = [
                ['name' => 'Complete Listings', 'value' => $productsWithImages, 'color' => '#064e3b'],
                ['name' => 'Listings Without Images', 'value' => $productsWithoutImages, 'color' => '#991b1b'],
                ['name' => 'Unpublished Listings', 'value' => 338, 'color' => '#b45309'], // Mock placeholder
            ];

            $onlineSalesStats = [
                ['name' => 'Delivery', 'value' => 26875, 'color' => '#451a03'],
                ['name' => 'Pick ups', 'value' => 10750, 'color' => '#22d3ee'],
            ];

            $salesByChannel = [
                ['name' => 'Mississauga', 'value' => 162532],
                ['name' => 'Oakville', 'value' => 76525],
                ['name' => 'Brampton', 'value' => 35313],
                ['name' => 'Saskatoon', 'value' => 49656],
                ['name' => 'B2B Online', 'value' => 73252],
                ['name' => 'B2C Website', 'value' => 19650],
                ['name' => 'eBay', 'value' => 22794],
            ];

            $customerStats = [
                ['name' => 'Outbound', 'value' => 35, 'color' => '#451a03'],
                ['name' => 'Inbound', 'value' => 25, 'color' => '#22d3ee'],
            ];

            return Inertia::render('Admin/Dashboard', [
                'leads' => $leads,
                'onlineOrders' => $onlineOrders,
                'returnRequests' => $returnRequests,
                'listingsStats' => $listingsStats,
                'onlineSalesStats' => $onlineSalesStats,
                'salesByChannel' => $salesByChannel,
                'customerStats' => $customerStats,
            ]);
        }

        // Fetch products for different sections
        $sellingItems = \App\Models\Product::with(['files', 'partType', 'fitments'])
            ->latest()
            ->take(4)
            ->get();

        $mechanicalItems = \App\Models\Product::with(['files', 'partType', 'fitments'])
            ->whereHas('partType', function ($q) {
                $q->where('name', 'like', '%Mechanical%');
            })
            ->latest()
            ->take(4)
            ->get();

        if ($mechanicalItems->isEmpty()) {
            $mechanicalItems = $sellingItems;
        }

        $electricalItems = \App\Models\Product::with(['files', 'partType', 'fitments'])
            ->whereHas('partType', function ($q) {
                $q->where('name', 'like', '%Electrical%');
            })
            ->latest()
            ->take(4)
            ->get();

        if ($electricalItems->isEmpty()) {
            $electricalItems = $sellingItems;
        }

        $accessories = \App\Models\Product::with(['files', 'partType', 'fitments'])
            ->whereHas('partType', function ($q) {
                $q->where('name', 'like', '%Access%');
            })
            ->latest()
            ->take(4)
            ->get();

        if ($accessories->isEmpty()) {
            $accessories = $sellingItems;
        }

        $clearanceItems = \App\Models\Product::with(['files', 'partType', 'fitments'])
            ->where('is_clearance', true)
            ->latest()
            ->take(4)
            ->get();

        // Map helper for consistent discount calculation
        $mapProducts = function ($products) use ($user) {
            return $products->map(function ($product) use ($user) {
                $specificDiscount = $user
? $product->userProductDiscounts()->where('user_id', $user->id)->first()
: null;

                if ($specificDiscount && $specificDiscount->discount_rate > 0) {
                    $product->applied_discount = $specificDiscount->discount_rate;
                    $product->discount_type = 'specific';
                } elseif ($user && $user->discount_rate > 0) {
                    $product->applied_discount = $user->discount_rate;
                    $product->discount_type = 'global';
                } else {
                    $product->applied_discount = 0;
                    $product->discount_type = null;
                }

                $product->your_price = $user
                    ? number_format($product->getPriceForUser($user), 2, '.', '')
                    : number_format($product->list_price, 2, '.', '');

                return $product;
            });
        };

        $sellingItems = $mapProducts($sellingItems);
        $mechanicalItems = $mapProducts($mechanicalItems);
        $electricalItems = $mapProducts($electricalItems);
        $accessories = $mapProducts($accessories);
        $clearanceItems = $mapProducts($clearanceItems);

        // Fetch Categories for the grid
        $categories = \App\Models\Category::where('status', 'active')
            ->take(4)
            ->get()
            ->map(function ($cat, $index) {
                // Assign a color based on index if not stored in DB
                $colors = ['bg-black', 'bg-[#F5B52E]', 'bg-[#B90000]', 'bg-black'];

                return [
                    'id' => $cat->id,
                    'title' => $cat->name,
                    'img' => $cat->image ? '/'.$cat->image : null,
                    'color' => $colors[$index % count($colors)],
                ];
            });

        // Default user dashboard
        return Inertia::render('User/Dashboard', [
            'stats' => [
                'activeOrdersCount' => $user ? Order::where('user_id', $user->id)->whereIn('status', ['pending', 'processing', 'shipped'])->count() : 0,
                'savedQuotesCount' => $user ? Quote::where('user_id', $user->id)->count() : 0,
            ],
            'categories' => $categories,
            'announcement' => Announcement::where('is_active', true)->latest()->first(),
            'sections' => [
                'clearanceItems' => $clearanceItems,
                'sellingItems' => $sellingItems,
                'mechanicalItems' => $mechanicalItems,
                'electricalItems' => $electricalItems,
                'accessories' => $accessories,
            ],
        ]);
    }

    public function parts()
    {
        return Inertia::render('User/Parts/Index');
    }
}
