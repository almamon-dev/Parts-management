<?php

namespace App\Http\Controllers\User\Parts;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->where('visibility', 'public');

        // Search Logic
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($inner) use ($search) {
                $inner->where('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('partsNumbers', fn ($pq) => $pq->where('part_number', 'like', "%{$search}%"));
            });
        });

        // Fitment Filters
        $query->when($request->year_from, function ($q, $year) {
            $q->whereHas('fitments', function ($f) use ($year) {
                $f->where('year_from', '<=', $year)
                    ->where('year_to', '>=', $year);
            });
        });

        $query->when($request->make, fn ($q, $make) => $q->whereHas('fitments', fn ($f) => $f->where('make', $make)));
        $query->when($request->model, fn ($q, $model) => $q->whereHas('fitments', fn ($f) => $f->where('model', $model)));

        // Tiered Category Filters
        $query->when($request->category, fn ($q, $cat) => $q->whereHas('partType', fn ($c) => $c->where('name', $cat)));
        $query->when($request->shop_view, fn ($q, $sv) => $q->whereHas('shopView', fn ($c) => $c->where('name', $sv)));
        $query->when($request->sorting, fn ($q, $s) => $q->whereHas('sorting', fn ($c) => $c->where('name', $s)));

        $user = auth()->user();
        $products = $query->with(['partType:id,name', 'shopView:id,name', 'sorting:id,name', 'partsNumbers', 'files', 'fitments'])
            ->withExists(['favourites as is_favorite' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->withExists(['carts as in_cart' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->orderByRaw("CASE 
                WHEN position = 'Front' THEN 1 
                WHEN position = 'Driver Side' THEN 2 
                WHEN position = 'Passenger Side' THEN 3 
                WHEN position = 'Rear' THEN 4 
                WHEN position = 'Inside' THEN 5 
                ELSE 6 END ASC")
            ->latest()
            ->get()
            ->map(function ($product) use ($user) {
                $product->applied_discount = 0;
                $product->discount_type = null;

                if ($user) {
                    $specificDiscount = $product->userProductDiscounts()
                        ->where('user_id', $user->id)
                        ->first();

                    if ($specificDiscount && $specificDiscount->discount_rate > 0) {
                        $product->applied_discount = $specificDiscount->discount_rate;
                        $product->discount_type = 'specific';
                    } elseif ($user->discount_rate > 0) {
                        $product->applied_discount = $user->discount_rate;
                        $product->discount_type = 'global';
                    }
                }

                $product->your_price = number_format($product->getPriceForUser($user), 2, '.', '');

                return $product;
            });

        $filterOptions = [
            'years' => DB::table('fitments')
                ->distinct()
                ->orderByDesc('year_from')
                ->pluck('year_from')
                ->toArray(),

            'makes' => $request->year_from ? DB::table('fitments')
                ->where('year_from', '<=', $request->year_from)
                ->where('year_to', '>=', $request->year_from)
                ->distinct()
                ->orderBy('make')
                ->pluck('make')
                ->toArray() : [],

            'models' => ($request->year_from && $request->make) ? DB::table('fitments')
                ->where('year_from', '<=', $request->year_from)
                ->where('year_to', '>=', $request->year_from)
                ->where('make', $request->make)
                ->distinct()
                ->orderBy('model')
                ->pluck('model')
                ->toArray() : [],

            'part_types' => Category::where('category_type', 1)->pluck('name')->toArray(),
            'shop_views' => Category::where('category_type', 2)->pluck('name')->toArray(),
            'sortings' => Category::where('category_type', 3)->pluck('name')->toArray(),
        ];

        return Inertia::render('User/Parts/Index', [
            'products' => $products,
            'filterOptions' => $filterOptions,
            'filters' => [
                'search' => $request->search ?? null,
                'category' => $request->category ?? null,
                'shop_view' => $request->shop_view ?? null,
                'sorting' => $request->sorting ?? null,
                'year_from' => $request->year_from ?? null,
                'make' => $request->make ?? null,
                'model' => $request->model ?? null,
            ],
        ]);
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            $cart->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Product added to cart successfully!');
    }
}
