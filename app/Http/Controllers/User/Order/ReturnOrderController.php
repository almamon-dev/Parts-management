<?php

namespace App\Http\Controllers\User\Order;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReturnOrderController extends Controller
{
    /**
     * Display the list of orders eligible for return.
     */
    // In ReturnOrderController.php
    public function returnOrder()
    {
        $returns = ReturnRequest::with(['order.items.product.files'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('User/Order/Return', [
            'returns' => $returns,
        ]);
    }

    /**
     * Handle the submission of a new return request.
     */
    public function returnRequest(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,order_number',
            'reason' => 'required|string',
            'description' => 'required|string|min:10',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // 2. Handle File Upload
        $imagePath = null;
        if ($request->hasFile('image')) {

            $imagePath = Helper::uploadFile('returns', $request->file('image'));
        }

        // 3. Create the Return Request record
        ReturnRequest::create([
            'user_id' => Auth::id(),
            'order_id' => $validated['order_id'],
            'reason' => $validated['reason'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'status' => 'pending',
        ]);

        // 4. Redirect with success message
        return redirect()->back()->with('success', 'Your return request has been submitted successfully.');
    }
}
