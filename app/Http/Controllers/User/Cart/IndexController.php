<?php

namespace App\Http\Controllers\User\Cart;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function Index()
    {
        $cartItems = Cart::where('user_id', auth()->id())
            ->with('product.files')
            ->get()
            ->map(function ($item) {
                $firstFile = $item->product->files->first();

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'sku' => $item->product->sku,
                    'name' => $item->product->name,
                    'description' => $item->product->description,
                    'list_price' => $item->product->list_price,
                    'buy_price' => $item->product->buy_price ?? $item->product->list_price,
                    'quantity' => $item->quantity,
                    // Use your Helper class here
                    'image' => Helper::generateURL($firstFile?->file_path),
                ];
            });

        // Calculate totals
        $subtotal = $cartItems->sum(function ($item) {
            return $item['buy_price'] * $item['quantity'];
        });

        $total = $subtotal; // Add shipping/tax if needed

        return Inertia::render('User/Cart/AddToCart', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'total' => $total,
        ]);
    }
}
