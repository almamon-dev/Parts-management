<?php

namespace App\Http\Controllers\Admin\Product;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductFile;
use App\Services\AdminProductSnapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $counts = [
            'all' => Product::count(),
            'published' => Product::where('visibility', 'public')->count(),
            'draft' => Product::where('visibility', 'draft')->count(),
            'private' => Product::where('visibility', 'private')->count(),
            'no_image' => Product::whereDoesntHave('files')->count(),
        ];

        $products = AdminProductSnapshot::get($request);

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
            'counts' => $counts,
            'categoriesTier1' => Category::where('category_type', 1)->select('id', 'name')->get(),
            'categoriesTier2' => Category::where('category_type', 2)->select('id', 'name')->get(),
            'categoriesTier3' => Category::where('category_type', 3)->select('id', 'name')->get(),
            'filters' => $request->only(['search', 'status', 'category', 'category_2', 'category_3', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Product/Create', [
            'categoriesTier1' => Category::where('category_type', 1)->get(),
            'categoriesTier2' => Category::where('category_type', 2)->get(),
            'categoriesTier3' => Category::where('category_type', 3)->get(),
        ]);
    }

    public function store(ProductStoreRequest $request)
    {
        DB::beginTransaction();

        try {
            // Generate PP ID: PP110001, PP110002, etc.
            $latestProduct = Product::whereNotNull('pp_id')
                ->where('pp_id', 'like', 'PP%')
                ->orderBy('pp_id', 'desc')
                ->first();

            if ($latestProduct) {
                $lastNumber = (int) str_replace('PP', '', $latestProduct->pp_id);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 110001;
            }
            $ppId = 'PP'.$nextNumber;

            $product = Product::create([
                'pp_id' => $ppId,
                'part_type_id' => $request->part_type_id,
                'shop_view_id' => $request->shop_view_id,
                'sorting_id' => $request->sorting_id,
                'description' => $request->description,
                'list_price' => $request->list_price,
                'stock_oakville' => $request->stock_oakville ?? 0,
                'stock_mississauga' => $request->stock_mississauga ?? 0,
                'stock_saskatoon' => $request->stock_saskatoon ?? 0,
                'sku' => $request->sku,
                'location_id' => $request->location_id,
                'visibility' => $request->visibility ?? 'public',
                'position' => $request->position,
                'is_clearance' => $request->boolean('is_clearance'),
            ]);

            if ($request->fitments) {
                foreach ($request->fitments as $fit) {
                    if (! empty($fit['year_from']) && ! empty($fit['year_to']) && ! empty($fit['make']) && ! empty($fit['model'])) {
                        $product->fitments()->create($fit);
                    }
                }
            }

            if ($request->part_numbers) {
                foreach ($request->part_numbers as $num) {
                    if (! empty($num)) {
                        $product->partsNumbers()->create(['part_number' => $num]);
                    }
                }
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $upload = Helper::uploadFile('products', $image, true);
                    if ($upload) {
                        $product->files()->create([
                            'file_name' => $image->getClientOriginalName(),
                            'file_path' => $upload['original'],
                            'file_type' => $image->getMimeType(),
                            'thumbnail_path' => $upload['thumbnail'] ?? $upload['original'],
                            'file_size' => $image->getSize(),
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product Store Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Failed to create product. '.$e->getMessage()]);
        }
    }

    public function edit(Product $product)
    {
        $product->load(['partType', 'shopView', 'sorting', 'fitments', 'partsNumbers', 'files']);

        return Inertia::render('Admin/Product/Edit', [
            'product' => [
                ...$product->toArray(),
                'part_numbers' => $product->partsNumbers->pluck('part_number')->toArray(),
            ],
            'categoriesTier1' => Category::where('category_type', 1)->get(),
            'categoriesTier2' => Category::where('category_type', 2)->get(),
            'categoriesTier3' => Category::where('category_type', 3)->get(),
        ]);
    }

    public function update(ProductUpdateRequest $request, Product $product)
    {
        DB::beginTransaction();
        try {
            $product->update([
                'part_type_id' => $request->part_type_id,
                'shop_view_id' => $request->shop_view_id,
                'sorting_id' => $request->sorting_id,
                'description' => $request->description,
                'list_price' => $request->list_price,
                'stock_oakville' => $request->stock_oakville ?? 0,
                'stock_mississauga' => $request->stock_mississauga ?? 0,
                'stock_saskatoon' => $request->stock_saskatoon ?? 0,
                'sku' => $request->sku,
                'location_id' => $request->location_id,
                'visibility' => $request->visibility ?? 'public',
                'position' => $request->position,
                'is_clearance' => $request->boolean('is_clearance'),
            ]);

            $product->fitments()->delete();
            if ($request->fitments) {
                foreach ($request->fitments as $fit) {
                    if (! empty($fit['year_from']) && ! empty($fit['year_to']) && ! empty($fit['make']) && ! empty($fit['model'])) {
                        $product->fitments()->create($fit);
                    }
                }
            }

            $product->partsNumbers()->delete();
            if ($request->part_numbers) {
                foreach ($request->part_numbers as $num) {
                    if (! empty($num)) {
                        $product->partsNumbers()->create(['part_number' => $num]);
                    }
                }
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $upload = Helper::uploadFile('products', $image, true);
                    if ($upload) {
                        $product->files()->create([
                            'file_name' => $image->getClientOriginalName(),
                            'file_path' => $upload['original'],
                            'file_type' => $image->getMimeType(),
                            'thumbnail_path' => $upload['thumbnail'] ?? $upload['original'],
                            'file_size' => $image->getSize(),
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product Update Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Failed to update product. '.$e->getMessage()]);
        }
    }

    public function destroy(Product $product)
    {
        Log::info('Product Destroying:', ['id' => $product->id]);
        try {
            $product->delete();

            return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Product Delete Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Failed to delete product. It may be linked to orders or other records.']);
        }
    }

    public function bulkDestroy(Request $request)
    {
        Log::info('Bulk Destroy Request:', $request->all());

        try {
            if ($request->boolean('all')) {
                $query = Product::query();

                if ($request->search) {
                    $search = $request->search;
                    $query->where(function ($qq) use ($search) {
                        $qq->where('sku', 'like', "{$search}%")
                            ->orWhere('pp_id', 'like', "{$search}%")
                            ->orWhere('description', 'like', "%{$search}%")
                            ->orWhereHas('partsNumbers', function ($pq) use ($search) {
                                $pq->where('part_number', 'like', "%{$search}%");
                            });
                    });
                }

                $query->get()->each->delete();
                $message = 'All filtered products deleted successfully.';
            } else {
                $request->validate([
                    'ids' => 'required|array',
                    'ids.*' => 'exists:products,id',
                ]);

                Product::whereIn('id', $request->ids)->get()->each->delete();
                $message = count($request->ids).' products deleted successfully.';
            }

            return redirect()->route('admin.products.index')->with('success', $message);
        } catch (\Exception $e) {
            Log::error('Bulk Delete Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Bulk delete failed: '.$e->getMessage()]);
        }
    }

    public function destroyFile($id)
    {
        try {
            $file = ProductFile::findOrFail($id);

            // Delete physical files
            if ($file->file_path && file_exists(public_path($file->file_path))) {
                @unlink(public_path($file->file_path));
            }
            if ($file->thumbnail_path && file_exists(public_path($file->thumbnail_path))) {
                @unlink(public_path($file->thumbnail_path));
            }

            $file->delete();

            return back()->with('success', 'Image deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete image.']);
        }
    }

    public function export(Request $request)
    {
        $products = Product::query()
            ->select([
                'pp_id', 'sku', 'description', 'list_price',
                'stock_oakville', 'stock_mississauga', 'stock_saskatoon', 'visibility',
            ])
            ->get();

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=products_export_'.date('Y-m-d').'.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($products) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['PP ID', 'SKU', 'Description', 'List Price', 'Stock OKV', 'Stock MSA', 'Stock SKT', 'Visibility']);

            foreach ($products as $product) {
                fputcsv($file, [
                    $product->pp_id,
                    $product->sku,
                    $product->description,
                    $product->list_price,
                    $product->stock_oakville,
                    $product->stock_mississauga,
                    $product->stock_saskatoon,
                    $product->visibility,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
