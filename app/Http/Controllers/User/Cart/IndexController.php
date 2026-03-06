<?php

namespace App\Http\Controllers\User\Cart;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function Index(Request $request)
    {
        if (! $request->has('token')) {
            return redirect()->route('parts.index')->with('error', 'Invalid access attempt.');
        }

        $cartData = self::getCartData(Auth::id());

        return Inertia::render('User/Cart/AddToCart', [
            'cartItems' => $cartData['items'],
            'subtotal' => $cartData['subtotal'],
            'total' => $cartData['total'],
            'accessToken' => $request->token,
        ]);
    }

    public static function getCartData($userId, $province = null, $country = null)
    {
        $user = \App\Models\User::find($userId);

        $taxPercentage = 0;
        if ($province) {
            $taxInfo = \App\Helpers\Helper::getTaxInfo($country, $province);
            $taxPercentage = $taxInfo['rate'] * 100;
            $taxLabel = "Tax {$taxPercentage}%";
        } else {
            $taxLabel = '';
        }

        $cartItems = Cart::where('user_id', $userId)
            ->with(['product' => function ($q) use ($userId) {
                $q->with(['files', 'fitments', 'partsNumbers', 'partType'])
                    ->withExists(['quoteItems as is_quoted' => function ($q) use ($userId) {
                        $q->whereHas('quote', function ($q) use ($userId) {
                            $q->where('user_id', $userId)->where('status', 'active');
                        });
                    }]);
            }])
            ->get()
            ->map(function ($item) use ($user) {
                $firstFile = $item->product->files->first();
                $price = $item->product->getPriceForUser($user);

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
                    'product' => $item->product,
                ];
            });

        $totalListPrice = $cartItems->sum(function ($item) {
            return $item['list_price'] * $item['quantity'];
        });

        $subtotal = $cartItems->sum(function ($item) {
            return $item['buy_price'] * $item['quantity'];
        });

        $discountAmount = $totalListPrice - $subtotal;
        $discountPercentage = $totalListPrice > 0 ? round(($discountAmount / $totalListPrice) * 100, 2) : 0;

        $tax = round($subtotal * ($taxPercentage / 100), 2);
        $total = $subtotal + $tax;

        return [
            'items' => $cartItems,
            'list_subtotal' => number_format($totalListPrice, 2, '.', ''),
            'discount_amount' => number_format($discountAmount, 2, '.', ''),
            'discount_percentage' => $discountPercentage,
            'subtotal' => number_format($subtotal, 2, '.', ''),
            'tax' => number_format($tax, 2, '.', ''),
            'tax_label' => $taxLabel,
            'total' => number_format($total, 2, '.', ''),
        ];
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return back()->with('success', 'Cart updated successfully');
    }

    public function destroy($id)
    {
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return back()->with('success', 'Product removed from cart');
    }
}
