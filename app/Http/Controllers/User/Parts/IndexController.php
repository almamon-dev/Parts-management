<?php

namespace App\Http\Controllers\User\Parts;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $products = Product::query()
            ->where('visibility', 'public')
            ->search($request->search)
            ->filterFitment($request->only(['year_from', 'make', 'model']))
            ->filterCategories($request->only(['category', 'shop_view', 'sorting']))
            ->sortByPositionCategory()
            ->withUserContext($user?->id)
            ->get()
            ->map(function ($product) use ($user) {
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
