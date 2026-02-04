<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('user_type', 'user')->get();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->error('Please run UserSeeder and ProductSeeder first!');

            return;
        }

        $statuses = ['Processing', 'Fulfilled', 'Canceled'];
        $orderTypes = ['Pick up', 'Delivery', 'Ship'];

        foreach ($users as $user) {
            // Create 2-3 orders per user
            for ($i = 0; $i < rand(2, 3); $i++) {
                $count = min($products->count(), rand(1, 3));
                $orderProducts = $products->random($count);
                $subtotal = 0;

                $order = Order::create([
                    'user_id' => $user->id,
                    'subtotal' => 0, // Will update after items
                    'tax' => 0,
                    'total_amount' => 0, // Will update after items
                    'status' => $statuses[array_rand($statuses)],
                    'order_type' => $orderTypes[array_rand($orderTypes)],
                    'shipping_address' => $user->address,
                    'notes' => 'Seeded order data',
                ]);

                foreach ($orderProducts as $product) {
                    $quantity = rand(1, 5);
                    $price = $product->list_price;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $price,
                    ]);

                    $subtotal += ($price * $quantity);
                }

                $tax = $subtotal * 0.13; // Assume 13% tax
                $totalAmount = $subtotal + $tax;

                $order->update([
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'total_amount' => $totalAmount,
                ]);

                // Create Payment
                \App\Models\Payment::create([
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'transaction_id' => 'TXN-'.strtoupper(Str::random(10)),
                    'amount' => $totalAmount,
                    'currency' => 'CAD',
                    'status' => ($order->status === 'Canceled') ? 'failed' : 'succeeded',
                    'payment_details' => [
                        'method' => 'credit_card',
                        'last4' => rand(1000, 9999),
                    ],
                ]);
            }
        }
    }
}
