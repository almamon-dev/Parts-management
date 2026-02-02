<?php

namespace App\Http\Controllers\User\Cart;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function Index(Request $request)
    {

        if (! $request->has('token')) {
            return redirect()->route('parts.index')->with('error', 'Invalid access attempt.');
        }

        $cartItems = Cart::where('user_id', auth()->id())
            ->with(['product' => function ($q) {
                $q->with(['files', 'fitments', 'partsNumbers', 'category'])
                    ->withExists(['quoteItems as is_quoted' => function ($q) {
                        $q->whereHas('quote', function ($q) {
                            $q->where('user_id', auth()->id())->where('status', 'active');
                        });
                    }]);
            }])
            ->get()
            ->map(function ($item) {
                $firstFile = $item->product->files->first();
                $price = $item->product->getPriceForUser(auth()->user());

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'sku' => $item->product->sku,
                    'name' => $item->product->name,
                    'description' => $item->product->description,
                    'list_price' => $item->product->list_price,
                    'buy_price' => $price,
                    'quantity' => $item->quantity,
                    'image' => Helper::generateURL($firstFile?->file_path),
                    'product' => $item->product, // Pass full object with is_quoted
                ];
            });

        $subtotal = $cartItems->sum(function ($item) {
            return $item['buy_price'] * $item['quantity'];
        });

        return Inertia::render('User/Cart/AddToCart', [
            'cartItems' => $cartItems,
            'subtotal' => number_format($subtotal, 2, '.', ''),
            'total' => number_format($subtotal, 2, '.', ''),
            'accessToken' => $request->token,
        ]);
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
