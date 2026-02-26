<?php

namespace App\Http\Controllers\User\Booking;

use App\Http\Controllers\Controller;
use App\Http\Controllers\User\Cart\IndexController as UserCartController;
use App\Models\Order;
use App\Models\Setting;
use App\Services\AdminOrderSnapshot;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\StripeClient;
use Stripe\Webhook;

class PaymentController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    private function getStripeClient()
    {
        $secretKey = config('services.stripe.secret');

        // If config key is empty or a placeholder, try getting from database settings
        if (! $secretKey || str_contains($secretKey, 'placeholder')) {
            $dbKey = Setting::where('key', 'stripe_secret_key')->value('value');
            if ($dbKey && ! str_contains($dbKey, 'placeholder')) {
                $secretKey = $dbKey;
            }
        }

        if (! $secretKey || str_contains($secretKey, 'placeholder')) {
            throw new \Exception('Stripe secret key not configured. Please set STRIPE_SECRET in .env or update settings in admin panel.');
        }

        return new StripeClient($secretKey);
    }

    public function checkoutPage(Request $request)
    {
        $user = $request->user();
        $cart = UserCartController::getCartData($user->id);

        if (empty($cart['items'])) {
            return redirect()->route('carts.index')->with('warning', 'Your cart is empty.');
        }

        $userAddresses = $user->userAddresses()->latest()->get();

        return Inertia::render('User/Cart/Checkout', [
            'cart' => $cart,
            'userAddresses' => $userAddresses,
            'user' => $user,
        ]);
    }

    public function checkout(Request $request)
    {
        // Validate request
        $request->validate([
            'payment_method' => 'required|in:credit_card,debit_card',
            'delivery_type' => 'required|in:store_pickup,deliver_it,ship_it',
            'order_type' => 'required|in:Pick up,Delivery,Ship',
            'shipping_address' => 'required|string',
            'notes' => 'nullable|string|max:100',
            'po_number' => 'nullable|string|max:15',
            'address_option' => 'nullable|string',
            'shop_name' => 'nullable|required_if:address_option,different_address|string|max:255',
            'manager_name' => 'nullable|required_if:address_option,different_address|string|max:255',
            'contact_number' => 'nullable|required_if:address_option,different_address|string|max:20',
            'street_address' => 'nullable|required_if:address_option,different_address|string|max:500',
            'city' => 'nullable|required_if:address_option,different_address|string|max:100',
            'province' => 'nullable|required_if:address_option,different_address|string|max:50',
            'post_code' => 'nullable|required_if:address_option,different_address|string|max:10',
            'address_type' => 'nullable|in:Business,Residential',
            'save_to_address_book' => 'nullable|boolean',
        ], [
            'payment_method.required' => 'Please select a payment method',
            'payment_method.in' => 'Invalid payment method selected',
            'delivery_type.required' => 'Please select a delivery method',
            'delivery_type.in' => 'Invalid delivery method selected',
            'shipping_address.required' => 'Shipping address is required',
            'shop_name.required_if' => 'Company name is required for delivery/shipping',
            'manager_name.required_if' => 'Contact person is required for delivery/shipping',
            'contact_number.required_if' => 'Phone number is required for delivery/shipping',
            'street_address.required_if' => 'Street address is required for delivery/shipping',
            'city.required_if' => 'City is required for delivery/shipping',
            'province.required_if' => 'Province is required for delivery/shipping',
            'post_code.required_if' => 'Postal code is required for delivery/shipping',
            'po_number.max' => 'PO number cannot exceed 15 characters',
            'notes.max' => 'Comments cannot exceed 100 characters',
        ]);

        try {
            // Optional: Save address to address book if requested
            if ($request->boolean('save_to_address_book')) {
                $request->user()->userAddresses()->create($request->only([
                    'shop_name', 'manager_name', 'contact_number', 'street_address', 'city', 'province', 'post_code',
                ]));
            }

            // Create order first
            $order = $this->orderService->createOrderFromCart($request->user(), $request->all());

            if (! $order) {
                return back()->withErrors(['error' => 'Failed to create order. Please try again.']);
            }

            // Load items and products for Stripe
            $order->load('items.product');

            if ($order->items->isEmpty()) {
                return back()->withErrors(['error' => 'Your cart is empty. Please add items before checkout.']);
            }

            $stripe = $this->getStripeClient();

            $lineItems = [];
            foreach ($order->items as $item) {
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $item->product->name ?? 'Part #'.($item->product->sku ?? $item->product->id),
                        ],
                        'unit_amount' => (int) ($item->price * 100), // Stripe expects amounts in cents
                    ],
                    'quantity' => $item->quantity,
                ];
            }

            // Add tax if exists
            if ($order->tax > 0) {
                $taxLabel = \App\Models\Setting::where('key', 'tax_label')->value('value') ?? 'Tax';
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $taxLabel,
                        ],
                        'unit_amount' => (int) ($order->tax * 100),
                    ],
                    'quantity' => 1,
                ];
            }

            $session = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('payment.success', ['order_number' => $order->order_number]).'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payment.cancel'),
                'customer_email' => Auth::user()->email,
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ]);
            $order->payment()->update([
                'transaction_id' => $session->id,
            ]);

            return Inertia::location($session->url);

        } catch (\Exception $e) {
            Log::error('Checkout Error: '.$e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['error' => 'Payment processing failed: '.$e->getMessage()]);
        }
    }

    public function success(Request $request)
    {
        $order = Order::where('order_number', $request->order_number)
            ->with(['items.product', 'payment'])
            ->firstOrFail();
        if ($order->status === 'pending' && $request->has('session_id')) {
            try {
                $stripe = $this->getStripeClient();
                $session = $stripe->checkout->sessions->retrieve($request->session_id);
                if ($session->payment_status === 'paid') {
                    $order->update(['status' => 'processing']);
                    $order->payment()->update([
                        'status' => 'succeeded',
                        'payment_details' => $session->toArray(),
                    ]);
                    AdminOrderSnapshot::flush();
                }
            } catch (\Exception $e) {

            }
        }

        return Inertia::render('User/Payment/Success', [
            'order' => $order,
        ]);
    }

    public function cancel()
    {
        return Inertia::render('User/Payment/Cancle');
    }

    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret') ?? Setting::where('key', 'stripe_webhook_secret')->value('value');

        if (! $webhookSecret) {
            return response()->json(['error' => 'Webhook secret not configured in settings or .env'], 500);
        }

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderId = $session->metadata->order_id;

            $order = Order::with('payment')->find($orderId);
            if ($order && $order->status === 'pending') {
                $order->update(['status' => 'processing']);
                $order->payment()->update([
                    'status' => 'succeeded',
                    'payment_details' => $session->toArray(),
                ]);
                AdminOrderSnapshot::flush();
            }
        }

        return response()->json(['status' => 'success']);
    }
}
