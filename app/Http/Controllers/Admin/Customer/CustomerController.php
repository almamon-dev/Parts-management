<?php

namespace App\Http\Controllers\Admin\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of B2B customers.
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->where('user_type', 'user')
            ->select([
                'id',
                'customer_number',
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'company_name',
                'position',
                'account_type',
                'store_hours',
                'marketing_emails',
                'order_confirmation',
                'order_cancellation',
                'monthly_statement',
                'discount_rate',
                'total_purchases',
                'total_returns',
                'address',
                'created_at',
            ]);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('customer_number', 'like', "%{$search}%");
            });
        }

        // Filter by discount rate
        if ($request->filled('discount_filter')) {
            $filter = $request->discount_filter;
            if ($filter === 'with_discount') {
                $query->where('discount_rate', '>', 0);
            } elseif ($filter === 'no_discount') {
                $query->where('discount_rate', 0);
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $customers = $query->paginate(15)->withQueryString();

        // Add full name to each customer
        $customers->getCollection()->transform(function ($customer) {
            $customer->name = trim($customer->first_name.' '.$customer->last_name);

            return $customer;
        });

        return Inertia::render('Admin/Customer/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'discount_filter', 'sort', 'direction']),
            'stats' => [
                'total_customers' => User::where('user_type', 'user')->count(),
                'with_discount' => User::where('user_type', 'user')->where('discount_rate', '>', 0)->count(),
                'total_revenue' => User::where('user_type', 'user')->sum('total_purchases'),
            ],
        ]);
    }

    /**
     * Apply global discount to all customers.
     */
    public function applyGlobalDiscount(Request $request)
    {
        $request->validate([
            'discount_rate' => 'required|numeric|min:0|max:100',
            'apply_to' => 'required|in:all,existing_discount,no_discount',
        ]);

        $query = User::where('user_type', 'user');

        if ($request->apply_to === 'existing_discount') {
            $query->where('discount_rate', '>', 0);
        } elseif ($request->apply_to === 'no_discount') {
            $query->where('discount_rate', 0);
        }

        $affectedCount = $query->update([
            'discount_rate' => $request->discount_rate,
        ]);

        return redirect()->back()->with('success', "Global discount applied to {$affectedCount} customer(s).");
    }

    /**
     * Reset customer discount.
     */
    public function resetDiscount(User $customer)
    {
        $customer->update([
            'discount_rate' => 0,
        ]);

        return redirect()->back()->with('success', 'Customer discount reset successfully.');
    }

    /**
     * Display the specified customer details.
     */
    public function show(User $customer, Request $request)
    {
        $customer->load(['productDiscounts.product']);
        $customer->name = trim($customer->first_name.' '.$customer->last_name);

        // Fetch categories and filter options for the product selector
        $categories = \App\Models\Category::all(['id', 'name']);

        $filterOptions = [
            'years' => \Illuminate\Support\Facades\DB::table('fitments')
                ->distinct()
                ->orderByDesc('year_from')
                ->pluck('year_from')
                ->toArray(),
            'makes' => [],
            'models' => [],
        ];

        return Inertia::render('Admin/Customer/Show', [
            'customer' => $customer,
            'categories' => $categories,
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Remove a specific product discount for a user.
     */
    public function removeProductDiscount(User $customer, $productId)
    {
        \App\Models\UserProductDiscount::where('user_id', $customer->id)
            ->where('product_id', $productId)
            ->delete();

        return redirect()->back()->with('success', 'Product discount removed successfully.');
    }

    /**
     * Search products for discount selection.
     */
    public function searchProducts(Request $request)
    {
        $query = Product::query();

        // Search Logic
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($inner) use ($search) {
                $inner->where('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('partsNumbers', fn ($pq) => $pq->where('part_number', 'like', "%{$search}%"));
            });
        });

        // Fitment Filters
        $query->when($request->year_from, function ($q, $year) {
            $q->whereHas('fitments', function ($f) use ($year) {
                $f->where('year_from', '<=', $year)
                    ->where('year_to', '>=', $year);
            });
        });

        $query->when($request->make, fn ($q, $make) => $q->whereHas('fitments', fn ($f) => $f->where('make', $make)));
        $query->when($request->model, fn ($q, $model) => $q->whereHas('fitments', fn ($f) => $f->where('model', $model)));

        // Category & Location
        $query->when($request->category, fn ($q, $cat) => $q->whereHas('partType', fn ($c) => $c->where('name', $cat)));
        $query->when($request->location, fn ($q, $loc) => $q->where('location_id', $loc));

        $products = $query->with(['partType:id,name', 'shopView:id,name', 'sorting:id,name', 'partsNumbers', 'files', 'fitments'])
            ->latest()
            ->get();

        // Filter Options
        $makes = $request->year_from ? DB::table('fitments')
            ->where('year_from', '<=', $request->year_from)
            ->where('year_to', '>=', $request->year_from)
            ->distinct()
            ->orderBy('make')
            ->pluck('make')
            ->toArray() : [];

        $models = ($request->year_from && $request->make) ? DB::table('fitments')
            ->where('year_from', '<=', $request->year_from)
            ->where('year_to', '>=', $request->year_from)
            ->where('make', $request->make)
            ->distinct()
            ->orderBy('model')
            ->pluck('model')
            ->toArray() : [];

        return response()->json([
            'products' => $products,
            'filterOptions' => [
                'makes' => $makes,
                'models' => $models,
            ],
        ]);
    }

    /**
     * Update customer discount (Global or Specific Products).
     */
    public function updateDiscount(Request $request, User $customer)
    {
        $request->validate([
            'type' => 'required|in:global,specific',
            'discount_rate' => 'required_if:type,global|nullable|numeric|min:0|max:100',
            'products' => 'required_if:type,specific|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.discount_rate' => 'required|numeric|min:0|max:100',
        ]);

        if ($request->type === 'global') {
            $customer->update(['discount_rate' => $request->discount_rate ?? 0]);
        } else {
            foreach ($request->products as $p) {
                \App\Models\UserProductDiscount::updateOrCreate(
                    ['user_id' => $customer->id, 'product_id' => $p['id']],
                    ['discount_rate' => $p['discount_rate']]
                );
            }
        }

        return redirect()->back()->with('success', 'Discount updated successfully.');
    }

    /**
     * Remove the specified customer from storage.
     */
    public function destroy(User $customer)
    {
        $customer->delete();

        return redirect()->back()->with('success', 'Customer deleted successfully.');
    }

    /**
     * Bulk remove the specified customers from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id',
        ]);

        User::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', count($request->ids).' Customers deleted successfully.');
    }
}
