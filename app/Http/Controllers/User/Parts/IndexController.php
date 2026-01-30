<?php

namespace App\Http\Controllers\User\Parts;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

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

        // Category & Location
        $query->when($request->category, fn ($q, $cat) => $q->whereHas('category', fn ($c) => $c->where('name', $cat)));
        $query->when($request->location, fn ($q, $loc) => $q->where('location_id', $loc));

        $user = auth()->user();
        $products = $query->with(['category:id,name', 'subCategory:id,name', 'partsNumbers', 'files', 'fitments'])
            ->withExists(['favourites as is_favorite' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->withExists(['carts as in_cart' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->latest()
            ->get()
            ->map(function ($product) use ($user) {
                $specificDiscount = $product->userProductDiscounts()
                    ->where('user_id', $user->id)
                    ->first();

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

                $product->your_price = number_format($product->getPriceForUser($user), 2, '.', '');
                return $product;
            });

        // Optimized Filter Options - Independent of Category for better UX
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
        ];

        return Inertia::render('User/Parts/Index', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'filterOptions' => $filterOptions,
            'filters' => [
                'search' => $request->search ?? null,
                'category' => $request->category ?? null,
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
        $cartItem = Cart::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->first();
        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Product added to cart!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $cartItem = Cart::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return back()->with('success', 'Cart updated successfully');
    }

    public function destroy($id)
    {
        $cartItem = Cart::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return back()->with('success', 'Product removed from cart');
    }
}
