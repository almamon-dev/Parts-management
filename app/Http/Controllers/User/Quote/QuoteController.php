<?php

namespace App\Http\Controllers\User\Quote;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuoteController extends Controller
{
    public function index()
    {
        $quotes = Quote::where('user_id', Auth::id())
            ->with(['items.product.files', 'items.product.partType', 'items.product.fitments'])
            ->latest()
            ->get();

        return Inertia::render('User/Quotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    public function show($id)
    {
        $quote = Quote::where('user_id', Auth::id())
            ->where('id', $id)
            ->with(['items.product.files', 'items.product.partType', 'items.product.fitments'])
            ->firstOrFail();

        return Inertia::render('User/Quotes/Show', [
            'quote' => $quote,
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();

        // Find or create an active quote for the day/session or just a default "Saved Items" quote
        $quote = Quote::where('user_id', $user->id)
            ->where('status', 'active')
            ->where('title', 'My Saved Quote')
            ->first();

        if (! $quote) {
            $quote = Quote::create([
                'user_id' => $user->id,
                'status' => 'active',
                'title' => 'Quote ID',
                'quote_number' => $this->generateQuoteNumber(),
                'valid_until' => now()->addDays(30),
            ]);
        }

        $item = QuoteItem::where('quote_id', $quote->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($item) {
            $item->delete();
            $message = 'Removed from Saved Quotes';
        } else {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'product_id' => $request->product_id,
                'quantity' => 1,
                'price_at_quote' => Product::find($request->product_id)->buy_price,
            ]);
            $message = 'Saved to Quotes';
        }

        // Update quote counts
        $quote->update([
            'items_count' => $quote->items()->count(),
            'total_amount' => $quote->items()->join('products', 'quote_items.product_id', '=', 'products.id')->sum(DB::raw('quote_items.quantity * products.buy_price')),
        ]);

        // If quote is empty, maybe keep it or delete it? Let's keep it for now.

        return back()->with('success', $message);
    }

    public function destroy($id)
    {
        $quote = Quote::where('user_id', Auth::id())->where('id', $id)->firstOrFail();
        $quote->delete();

        return back()->with('success', 'Quote deleted');
    }

    public function convertToOrder($id)
    {
        $quote = Quote::where('user_id', Auth::id())
            ->where('id', $id)
            ->with('items')
            ->firstOrFail();

        foreach ($quote->items as $item) {
            Cart::updateOrCreate(
                ['user_id' => Auth::id(), 'product_id' => $item->product_id],
                ['quantity' => $item->quantity]
            );
        }

        $quote->delete();

        return redirect()->route('carts.index', ['token' => Str::random(32)])->with('success', 'Quote converted to cart items');
    }

    private function generateQuoteNumber()
    {
        $lastQuote = Quote::where('quote_number', 'like', 'QT%')
            ->orderByRaw('CAST(SUBSTRING(quote_number, 3) AS UNSIGNED) DESC')
            ->first();

        if ($lastQuote) {
            $lastNumber = intval(substr($lastQuote->quote_number, 2));
            $nextNumber = max(2001, $lastNumber + 1);
        } else {
            $nextNumber = 2001;
        }

        return 'QT'.$nextNumber;
    }

    public function storeFromCart(Request $request)
    {
        $user = Auth::user();
        $cartItems = Cart::where('user_id', $user->id)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty');
        }

        $totalAmount = $cartItems->sum(function ($item) {
            $price = $item->product->buy_price ?? $item->product->list_price;

            return $item->quantity * $price;
        });

        // Check if an identical quote was created today
        $existingQuote = Quote::where('user_id', $user->id)
            ->where('items_count', $cartItems->count())
            ->whereBetween('total_amount', [$totalAmount - 0.01, $totalAmount + 0.01])
            ->whereDate('created_at', now())
            ->first();

        if ($existingQuote) {
            return back()->with('warning', 'A quote with these identical items was already created today. Check your Saved Quotes.');
        }

        $quote = Quote::create([
            'user_id' => $user->id,
            'quote_number' => $this->generateQuoteNumber(),
            'title' => 'Quote ID',
            'status' => 'active',
            'valid_until' => now()->addDays(30),
            'items_count' => $cartItems->count(),
            'total_amount' => $totalAmount,
        ]);

        foreach ($cartItems as $item) {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price_at_quote' => $item->product->buy_price ?? $item->product->list_price,
            ]);
        }

        Cart::where('user_id', $user->id)->delete();

        return redirect()->route('quotes.index')->with('success', 'Cart saved as a new quote');
    }
}
