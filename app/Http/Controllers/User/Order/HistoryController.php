<?php

namespace App\Http\Controllers\User\Order;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HistoryController extends Controller
{
public function index()
{
    $orders = Order::with([
            'items.product.files',
            'items.product.fitments',
            'returnRequests'
        ])
        ->where('user_id', Auth::id())
        ->whereIn('status', ['delivered', 'cancelled', 'collected'])
        ->latest()
        ->get();

    return Inertia::render('User/Order/History', [
        'orders' => $orders,

        'deliveredOrders' => $orders->where('status', 'delivered')->values(),
    ]);
}

    // --re-order details
    public function reOrder(Order $order)
    {
        // 1. Authorization check
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::transaction(function () use ($order) {
                foreach ($order->items as $item) {
                    // 2. Optimized: Find existing or create new, then increment
                    $cartItem = Cart::firstOrNew([
                        'user_id' => Auth::id(),
                        'product_id' => $item->product_id,
                    ]);

                    $cartItem->quantity = ($cartItem->exists ? $cartItem->quantity : 0) + $item->quantity;
                    $cartItem->save();
                }
            });

            return redirect()->back();

        } catch (\Exception $e) {
            Log::error('Re-order failed for Order ID '.$order->id.': '.$e->getMessage());

            return back()->with('error', 'Something went wrong while re-ordering.');
        }
    }
}
