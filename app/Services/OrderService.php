<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    /**
     * Create a new order from the user's cart.
     */
    public function createOrderFromCart(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $cartItems = Cart::where('user_id', $user->id)
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Your cart is empty.');
            }

            $subtotal = $cartItems->sum(function ($item) {
                return ($item->product->buy_price ?? $item->product->list_price) * $item->quantity;
            });

            // For now, tax and shipping are 0 or calculated later
            $tax = 0;
            $totalAmount = $subtotal + $tax;

            $order = Order::create([
                'user_id' => $user->id,
                'po_number' => $data['po_number'] ?? null,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total_amount' => $totalAmount,
                'status' => 'Processing',
                'order_type' => $data['order_type'] ?? 'Pick up',
                'shipping_address' => $data['shipping_address'] ?? ($user->address ?? 'N/A'),
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->buy_price ?? $item->product->list_price,
                ]);
            }

            // Create initial payment record
            Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'transaction_id' => 'TRX-'.strtoupper(Str::random(12)),
                'amount' => $totalAmount,
                'currency' => 'USD',
                'status' => 'pending',
            ]);

            // Clear the cart
            Cart::where('user_id', $user->id)->delete();

            return $order;
        });
    }
}
