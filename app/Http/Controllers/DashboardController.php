<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        $filters = [
            'leads_filter' => $request->input('leads_filter', 'last_30_days'),
            'listings_filter' => $request->input('listings_filter', 'last_30_days'),
            'sales_filter' => $request->input('sales_filter', 'last_30_days'),
            'channels_filter' => $request->input('channels_filter', 'last_30_days'),
            'customers_filter' => $request->input('customers_filter', 'last_30_days'),
        ];

        // Helper to calculate start date
        $getStartDate = function ($filter) {
            return match ($filter) {
                'last_7_days' => now()->subDays(7),
                'last_year' => now()->subYear(),
                default => now()->subDays(30),
            };
        };

        // Helper to apply date filter
        $applyDateToQuery = function ($query, $startDate) {
            return $query->where('created_at', '>=', $startDate);
        };

        if ($user && $user->isAdmin()) {
            // Leads (Filtered)
            $leadsStartDate = $getStartDate($filters['leads_filter']);
            $leadsQuery = \App\Models\Lead::latest();
            $applyDateToQuery($leadsQuery, $leadsStartDate);
            $leads = $leadsQuery->take(8)->get();

            // Online Orders (Fixed: Last 30 Days)
            $ordersStartDate = $getStartDate('last_30_days');
            $onlineOrdersQuery = \App\Models\Order::with(['user', 'items'])
                ->whereHas('payment', fn ($q) => $q->where('status', 'succeeded'))
                ->latest();
            $applyDateToQuery($onlineOrdersQuery, $ordersStartDate);
            $onlineOrders = $onlineOrdersQuery->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer' => $order->user ? $order->user->name : 'N/A',
                        'type' => $order->order_type ?? 'Delivery',
                        'items' => $order->items->count(),
                        'date' => $order->created_at->format('m/d/Y'),
                        'status' => ucfirst($order->status),
                    ];
                });

            // Return Requests (Fixed: Last 30 Days)
            $returnsStartDate = $getStartDate('last_30_days');
            $returnRequestsQuery = \App\Models\ReturnRequest::with(['user', 'order.items'])->latest();
            $applyDateToQuery($returnRequestsQuery, $returnsStartDate);
            $returnRequests = $returnRequestsQuery->take(5)
                ->get()
                ->map(function ($req) {
                    return [
                        'id' => $req->id,
                        'return_number' => $req->return_number,
                        'customer' => $req->user ? $req->user->name : 'N/A',
                        'type' => $req->order ? $req->order->order_type : 'Delivery',
                        'items' => $req->order && $req->order->items ? $req->order->items->count() : 0,
                        'date' => $req->created_at->format('m/d/Y'),
                        'status' => ucfirst($req->status),
                    ];
                });

            // Products stats (Filtered)
            $listingsStartDate = $getStartDate($filters['listings_filter']);
            $applyListingsDate = fn ($q) => $q->where('created_at', '>=', $listingsStartDate);

            $completeListings = $applyListingsDate(\App\Models\Product::where('visibility', 'public')->has('files'))->count();
            $listingsWithoutImages = $applyListingsDate(\App\Models\Product::where('visibility', 'public')->doesntHave('files'))->count();
            $unpublishedListings = $applyListingsDate(\App\Models\Product::whereIn('visibility', ['private', 'draft']))->count();

            $listingsStats = [
                ['name' => 'Published Listings With Images', 'value' => $completeListings, 'color' => '#064e3b'],
                ['name' => 'Listings Without Images', 'value' => $listingsWithoutImages, 'color' => '#991b1b'],
                ['name' => 'Unpublished Listings', 'value' => $unpublishedListings, 'color' => '#b45309'],
            ];

            // Online Sales (Filtered)
            $salesStartDate = $getStartDate($filters['sales_filter']);
            $applySalesDate = fn ($q) => $q->where('created_at', '>=', $salesStartDate);

            $deliverySales = $applySalesDate(\App\Models\Order::whereIn('order_type', ['Delivery', 'Ship'])->whereHas('payment', fn($q) => $q->where('status', 'succeeded')))->sum('total_amount');
            $pickupSales = $applySalesDate(\App\Models\Order::where('order_type', 'Pick up')->whereHas('payment', fn($q) => $q->where('status', 'succeeded')))->sum('total_amount');

            $onlineSalesStats = [
                ['name' => 'Delivery', 'value' => $deliverySales, 'color' => '#451a03'],
                ['name' => 'Pick ups', 'value' => $pickupSales, 'color' => '#22d3ee'],
            ];

            // Sales - All Channels (Filtered)
            $channelsStartDate = $getStartDate($filters['channels_filter']);
            $applyChannelsDate = fn ($q) => $q->where('created_at', '>=', $channelsStartDate);

            $b2bSales = $applyChannelsDate(\App\Models\Order::whereHas('user', function ($q) {
                $q->where('is_b2b', true);
            })->whereHas('payment', function ($q) {
                $q->where('status', 'succeeded');
            }))->sum('total_amount');

            $salesByChannel = [];

            // B2B Online Sales
            $salesByChannel[] = ['name' => 'B2B Online', 'value' => $b2bSales];

            // Fulfilled Leads Sales
            $fulfilledLeadsSales = $applyChannelsDate(\App\Models\Lead::where('status', 'Fulfilled'))
                ->with('parts')
                ->get()
                ->sum(function ($lead) {
                    return $lead->parts->sum('sell_price');
                });
            $salesByChannel[] = ['name' => 'Fulfilled Leads', 'value' => $fulfilledLeadsSales];          // Customer Stats (Filtered)
            $customersStartDate = $getStartDate($filters['customers_filter']);
            $applyCustomersDate = fn ($q) => $q->where('created_at', '>=', $customersStartDate);

            $outboundCustomers = $applyCustomersDate(\App\Models\Order::whereIn('order_type', ['Delivery', 'Ship'])->whereHas('payment', fn($q) => $q->where('status', 'succeeded')))->distinct('user_id')->count('user_id');
            $inboundCustomers = $applyCustomersDate(\App\Models\Order::where('order_type', 'Pick up')->whereHas('payment', fn($q) => $q->where('status', 'succeeded')))->distinct('user_id')->count('user_id');

            $customerStats = [
                ['name' => 'Delivery', 'value' => $outboundCustomers, 'color' => '#451a03'],
                ['name' => 'Pick up', 'value' => $inboundCustomers, 'color' => '#22d3ee'],
            ];

            return Inertia::render('Admin/Dashboard', [ 
                'leads' => $leads,
                'onlineOrders' => $onlineOrders,
                'returnRequests' => $returnRequests,
                'listingsStats' => $listingsStats,
                'onlineSalesStats' => $onlineSalesStats,
                'salesByChannel' => $salesByChannel,
                'customerStats' => $customerStats,
                'filters' => $filters,
            ]);
        }

        // --- USER DASHBOARD ---
        $sellingItems = \App\Models\Product::with(['files', 'partType', 'shopView', 'fitments'])
            ->latest()
            ->take(4)
            ->get();

        $mechanicalItems = \App\Models\Product::with(['files', 'partType', 'shopView', 'fitments'])
            ->whereHas('partType', fn ($q) => $q->where('name', 'like', '%Mechanical%'))
            ->latest()
            ->take(4)
            ->get();

        if ($mechanicalItems->isEmpty()) {
            $mechanicalItems = $sellingItems;
        }

        $electricalItems = \App\Models\Product::with(['files', 'partType', 'shopView', 'fitments'])
            ->whereHas('partType', fn ($q) => $q->where('name', 'like', '%Electrical%'))
            ->latest()
            ->take(4)
            ->get();

        if ($electricalItems->isEmpty()) {
            $electricalItems = $sellingItems;
        }

        $accessories = \App\Models\Product::with(['files', 'partType', 'shopView', 'fitments'])
            ->whereHas('partType', fn ($q) => $q->where('name', 'like', '%Access%'))
            ->latest()
            ->take(4)
            ->get();

        if ($accessories->isEmpty()) {
            $accessories = $sellingItems;
        }

        $clearanceItems = \App\Models\Product::with(['files', 'partType', 'shopView', 'fitments'])
            ->where('is_clearance', true)
            ->latest()
            ->take(4)
            ->get();

        $mapProducts = function ($products) use ($user) {
            return $products->map(function ($product) use ($user) {
                if ($user) {
                    $specificDiscount = $product->userProductDiscounts()->where('user_id', $user->id)->first();
                    if ($specificDiscount && $specificDiscount->discount_rate > 0) {
                        $product->applied_discount = $specificDiscount->discount_rate;
                        $product->discount_type = 'specific';
                    } elseif ($user->discount_rate > 0) {
                        $product->applied_discount = $user->discount_rate;
                        $product->discount_type = 'global';
                    } else {
                        $product->applied_discount = 0;
                        $product->discount_type = null;
                    }
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

        $gridConfig = [
            'Aftermarket' => [
                'names' => ['Aftermarket', 'After'],
                'img' => '/img/Dashboard/ee41bae3bee280556f5a00ec4188244fc4f406ed.png',
                'color' => 'bg-black',
            ],
            'Used Parts' => [
                'names' => ['Used Parts', 'Used'],
                'img' => '/img/Dashboard/56b144518c1fddbb5095d6b2844d7c5de67f040d.png',
                'color' => 'bg-[#F5B52E]',
            ],
            'Interior' => [
                'names' => ['Interior'],
                'img' => '/img/Dashboard/17d63dafa7370e189f5dffe98674e135091d04b8.png',
                'color' => 'bg-[#B90000]',
            ],
        ];

        $categories = collect($gridConfig)->map(function ($cfg, $displayName) {
            $cat = \App\Models\Category::where(function ($q) use ($cfg) {
                foreach ($cfg['names'] as $name) {
                    $q->orWhere('name', 'like', "%{$name}%");
                }
            })->first();

            return [
                'id' => $cat ? $cat->id : null,
                'title' => $displayName,
                'img' => ($cat && $cat->image) ? '/'.$cat->image : $cfg['img'],
                'color' => $cfg['color'],
            ];
        })->values();

        $activeOrdersCount = $user ? \App\Models\Order::where('user_id', $user->id)->whereIn('status', ['pending', 'processing', 'shipped'])->count() : 0;
        $savedQuotesCount = $user ? \App\Models\Quote::where('user_id', $user->id)->count() : 0;

        $onlineOrders = $user ? \App\Models\Order::where('user_id', $user->id)
            ->whereHas('payment', fn ($q) => $q->where('status', 'succeeded'))
            ->with(['items'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'type' => $order->order_type ?? 'Delivery',
                    'items' => $order->items->count(),
                    'date' => $order->created_at->format('m/d/Y'),
                    'status' => ucfirst($order->status),
                ];
            }) : [];

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'activeOrdersCount' => $activeOrdersCount,
                'savedQuotesCount' => $savedQuotesCount,
            ],
            'categories' => $categories,
            'onlineOrders' => $onlineOrders,
            'announcement' => \App\Models\Announcement::where('is_active', true)->latest()->first(),
            'sections' => [
                'clearanceItems' => $mapProducts($clearanceItems),
                'sellingItems' => $mapProducts($sellingItems),
                'mechanicalItems' => $mapProducts($mechanicalItems),
                'electricalItems' => $mapProducts($electricalItems),
                'accessories' => $mapProducts($accessories),
            ],
        ]);
    }

    public function parts()
    {
        return Inertia::render('User/Parts/Index');
    }
}
