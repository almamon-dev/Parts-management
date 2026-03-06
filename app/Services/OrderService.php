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

            $subtotal = $cartItems->sum(function ($item) use ($user) {
                return $item->product->getPriceForUser($user) * $item->quantity;
            });

            // Tax calculation based on province
            $taxPercentage = 0; 
            $effectiveProvince = null;
            $effectiveCountry = null;

            if (($data['delivery_type'] ?? '') === 'store_pickup') {
                $effectiveProvince = '';
                $effectiveCountry = '';
            } else {
                if (($data['address_option'] ?? '') === 'my_address') {
                    $effectiveProvince = $user->province ?? '';
                    $effectiveCountry = $user->country ?? '';
                } else {
                    $effectiveProvince = $data['province'] ?? '';
                    $effectiveCountry = $data['country'] ?? '';
                }
            }

            if ($effectiveProvince) {
                $taxInfo = \App\Helpers\Helper::getTaxInfo($effectiveCountry, $effectiveProvince);
                $taxPercentage = $taxInfo['rate'] * 100;
            } else {
                $taxPercentage = 0; // Default to 0 if no province selected
            }

            $tax = round($subtotal * ($taxPercentage / 100), 2);
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
                'billing_address' => $data['billing_address'] ?? ($user->address ?? 'N/A'),
                'address_type' => $data['address_type'] ?? 'Business',
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->getPriceForUser($user),
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

            // Flush admin order cache
            AdminOrderSnapshot::flush();

            return $order;
        });
    }
}
