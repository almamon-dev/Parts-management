<?php

namespace App\Http\Controllers\Admin\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\AdminOrderSnapshot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = AdminOrderSnapshot::get($request);

        $paidQuery = Order::whereHas('payment', function ($q) {
            $q->where('status', 'succeeded');
        });

        $counts = [
            'all' => (clone $paidQuery)->count(),
            'Processing' => (clone $paidQuery)->where('status', 'Processing')->count(),
            'Fulfilled' => (clone $paidQuery)->where('status', 'Fulfilled')->count(),
            'Canceled' => (clone $paidQuery)->where('status', 'Canceled')->count(),
        ];

        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'counts' => $counts,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product.files', 'items.product.partType', 'items.product.shopView', 'items.product.sorting', 'payment']);

        return Inertia::render('Admin/Order/Show', [
            'order' => $order,
        ]);
    }

    public function invoice(Order $order)
    {
        $order->load(['user', 'items.product', 'payment']);

        return Inertia::render('Admin/Order/Invoice', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:Processing,Fulfilled,Canceled,Delivered,Collected',
        ]);

        $order->update($validated);

        // Flush cache to reflect status change
        AdminOrderSnapshot::flush();

        return back()->with('success', "Order #{$order->order_number} status updated to ".ucfirst($validated['status']));
    }

    public function destroy(Order $order)
    {
        try {
            $order->delete();
            AdminOrderSnapshot::flush();

            return redirect()->route('admin.orders.index')->with('success', 'Order deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete order: '.$e->getMessage()]);
        }
    }

    public function bulkDestroy(Request $request)
    {
        try {
            $ids = $request->input('ids', []);

            if ($request->boolean('all')) {
                $query = Order::query();
                // We only allow deleting paid orders in this view
                $query->whereHas('payment', function ($q) {
                    $q->where('status', 'succeeded');
                });

                if ($request->search) {
                    $search = $request->search;
                    $query->where(function ($q) use ($search) {
                        $q->where('order_number', 'like', "%{$search}%")
                            ->orWhereHas('user', function ($uq) use ($search) {
                                $uq->where('first_name', 'like', "%{$search}%")
                                    ->orWhere('last_name', 'like', "%{$search}%")
                                    ->orWhere('email', 'like', "%{$search}%");
                            });
                    });
                }
                if ($request->status && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
                
                $query->get()->each->delete();
                $message = 'All filtered orders deleted successfully.';
            } elseif (! empty($ids)) {
                Order::whereIn('id', $ids)->get()->each->delete();
                $message = count($ids).' orders deleted successfully.';
            } else {
                return back()->withErrors(['error' => 'No orders selected for deletion.']);
            }

            AdminOrderSnapshot::flush();

            return redirect()->route('admin.orders.index')->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Bulk delete failed: '.$e->getMessage()]);
        }
    }
}
