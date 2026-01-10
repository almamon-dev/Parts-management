<?php

namespace App\Http\Controllers\User\Favourite;

use App\Http\Controllers\Controller;
use App\Models\Favourite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = auth()->user();
        $productId = $request->product_id;

        // Check if the favorite already exists
        $favorite = Favourite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($favorite) {
            $favorite->delete();

            return back()->with('success', 'Product removed from favorites');
        } else {
            Favourite::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);

            return back()->with('success', 'Product added to favorites');
        }
    }

    public function index()
    {
        $favourites = Favourite::where('user_id', auth()->id())
            ->with(['product.files', 'product.subCategory', 'product.fitments'])
            ->latest()
            ->paginate(8)
            ->withQueryString();

        return Inertia::render('User/Favourite/Index', [
            'favourites' => $favourites,
        ]);
    }

    // delete favourite product
    public function destroy(Favourite $favourite)
    {
        $fav = Favourite::findorfail($favourite->id);
        $fav->delete();

        return redirect()->back()->with('success', 'Favourite Deleted Successfully');
    }
}
