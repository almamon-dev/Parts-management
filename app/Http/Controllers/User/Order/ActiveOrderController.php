<?php

namespace App\Http\Controllers\User\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActiveOrderController extends Controller
{
    public function index()
    {
        $activeOrders = Order::with(['items.product.files', 'items.product.fitments'])
            ->where('user_id', Auth::id())
            ->whereIn('status', ['pending', 'processing', 'Processing', 'picked_up'])
            ->latest()
            ->get();

        return Inertia::render('User/Order/Active', [
            'orders' => $activeOrders,
        ]);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['items.product.files', 'payment']);

        return Inertia::render('User/Order/Show', [
            'order' => $order,
        ]);
    }
}
