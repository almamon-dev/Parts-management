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

        $products = $query->with(['category:id,name', 'subCategory:id,name', 'partsNumbers', 'files', 'fitments'])
            ->withExists(['favourites as is_favorite' => function ($q) {
                $q->where('user_id', auth()->id());
            }])
            ->latest()
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        // Optimized Filter Options
        $filterOptions = [
            'makes' => DB::table('fitments')->distinct()->orderBy('make')->pluck('make'),
            // Optionally filter models by the selected make
            'models' => DB::table('fitments')
                ->when($request->make, fn ($q, $make) => $q->where('make', $make))
                ->distinct()
                ->orderBy('model')
                ->pluck('model'),
            'years' => DB::table('fitments')->distinct()->orderByDesc('year_from')->pluck('year_from'),
            'locations' => Product::whereNotNull('location_id')->distinct()->orderBy('location_id')->pluck('location_id'),
        ];

        return Inertia::render('User/Parts/Index', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'filterOptions' => $filterOptions,
            'filters' => $request->only(['search', 'category', 'year_from', 'make', 'model', 'location']),
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
}
