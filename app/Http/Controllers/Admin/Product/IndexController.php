<?php

namespace App\Http\Controllers\Admin\Product;

use App\Exports\ProductsExport;
use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Models\Category;
use App\Models\PartsNumber;
use App\Models\Product;
use App\Models\ProductFile;
use App\Models\SubCategory;
use App\Services\AdminProductSnapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        // Optimized File Cache - Fast Count Queries (No Redis Required)
        $counts = Cache::remember('product_counts', 3600, function () {
            // Single query to get all counts - much faster than multiple queries
            $data = Product::selectRaw("
                COUNT(*) as all_count,
                SUM(CASE WHEN visibility = 'public' THEN 1 ELSE 0 END) as published,
                SUM(CASE WHEN visibility = 'draft' THEN 1 ELSE 0 END) as draft,
                SUM(CASE WHEN visibility = 'private' THEN 1 ELSE 0 END) as private
            ")->first();

            // Separate optimized query for no_image count
            $noImageCount = Cache::remember('product_no_image_count', 3600, function () {
                return Product::whereDoesntHave('files')->count();
            });

            return [
                'all' => $data->all_count,
                'published' => (int) $data->published,
                'draft' => (int) $data->draft,
                'private' => (int) $data->private,
                'no_image' => $noImageCount,
            ];
        });

        $products = AdminProductSnapshot::get($request);

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
            'counts' => $counts,
            'categories' => cache()->rememberForever('admin_categories', fn () => Category::select('id', 'name')->get()),
            'subCategories' => cache()->rememberForever('admin_sub_categories', fn () => SubCategory::select('id', 'name', 'category_id')->get()),
            'filters' => $request->only(['search', 'status', 'category', 'sub_category', 'per_page']),
        ]);
    }

    public function export()
    {
        return Excel::download(new ProductsExport, 'products_list.xlsx');
    }

    public function create()
    {
        return Inertia::render('Admin/Product/Create', [
            'categories' => Category::all(),
            'subCategories' => SubCategory::all(),
        ]);
    }

    // store product
    public function store(ProductStoreRequest $request)
    {
        DB::beginTransaction();

        try {
            // 1. Create the Main Product
            $product = Product::create([
                'category_id' => $request->category_id,
                'sub_category_id' => $request->sub_category_id,
                'description' => $request->description,
                'list_price' => $request->list_price,
                'stock_oakville' => $request->stock_oakville ?? 0,
                'stock_mississauga' => $request->stock_mississauga ?? 0,
                'stock_saskatoon' => $request->stock_saskatoon ?? 0,
                'sku' => $request->sku,
                'location_id' => $request->location_id,
                'visibility' => $request->visibility ?? 'public',
            ]);

            // 2. Save Fitments
            if ($request->has('fitments')) {
                foreach ($request->fitments as $fitment) {
                    // Only save if year_from or make is provided to avoid empty rows
                    if (! empty($fitment['year_from']) || ! empty($fitment['make'])) {
                        $product->fitments()->create([
                            'year_from' => $fitment['year_from'],
                            'year_to' => $fitment['year_to'],
                            'make' => $fitment['make'],
                            'model' => $fitment['model'],
                        ]);
                    }
                }
            }

            // 3. Save Part Numbers
            if ($request->has('part_numbers')) {
                foreach ($request->part_numbers as $number) {
                    if (! empty($number)) {
                        PartsNumber::create([
                            'product_id' => $product->id,
                            'part_number' => $number,
                        ]);
                    }
                }
            }

            // 4. Handle Image Uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $fileName = $image->getClientOriginalName();
                    $fileSize = $image->getSize();
                    $fileType = $image->getClientMimeType();
                    $path = Helper::uploadFile('products', $image, true);
                    ProductFile::create([
                        'product_id' => $product->id,
                        'file_name' => $fileName,
                        'file_path' => $path['original'],
                        'thumbnail_path' => $path['thumbnail'],
                        'file_size' => $fileSize,
                        'file_type' => $fileType,
                    ]);
                }
            }

            DB::commit();
            AdminProductSnapshot::flush();
            Cache::forget('product_counts');
            Cache::forget('product_no_image_count');

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to create product. Please try again.'])
                ->withInput();
        }
    }

    // end
    public function edit(Product $product)
    {
        $product->load(['partsNumbers', 'fitments', 'files']);

        return Inertia::render('Admin/Product/Edit', [
            'product' => [
                'id' => $product->id,
                'description' => $product->description,
                'list_price' => $product->list_price,
                'sku' => $product->sku,
                'location_id' => $product->location_id,
                'visibility' => $product->visibility,
                'category_id' => $product->category_id,
                'sub_category_id' => $product->sub_category_id,
                'stock_oakville' => $product->stock_oakville,
                'stock_mississauga' => $product->stock_mississauga,
                'stock_saskatoon' => $product->stock_saskatoon,
                'part_numbers' => $product->partsNumbers->pluck('part_number')->toArray(),
                'fitments' => $product->fitments,
                'files' => $product->files,
            ],
            'categories' => Category::all(['id', 'name']),
            'subCategories' => SubCategory::all(['id', 'name', 'category_id']),
        ]);
    }

    public function update(ProductUpdateRequest $request, Product $product)
    {
        DB::beginTransaction();
        try {
            // -- product update
            $product->update($request->validated());

            // -- delete old fitments
            $product->fitments()->delete();
            if ($request->fitments) {
                foreach ($request->fitments as $fit) {
                    if (! empty($fit['year_from'])) {
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

            // -- delete old files
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    if ($image->isValid()) {
                        // after validation
                        $fileName = $image->getClientOriginalName();
                        $fileSize = $image->getSize();
                        $fileType = $image->getClientMimeType();

                        // -- file upload
                        $path = Helper::uploadFile('products', $image, true);

                        // -- database save
                        $product->files()->create([
                            'file_name' => $fileName,
                            'file_size' => $fileSize,
                            'file_path' => $path['original'],
                            'thumbnail_path' => $path['thumbnail'],
                            'file_type' => $fileType,
                        ]);
                    }
                }
            }

            DB::commit();
            AdminProductSnapshot::flush();
            Cache::forget('product_counts');
            Cache::forget('product_no_image_count');

            return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Update failed: '.$e->getMessage()]);
        }
    }

    // delete image
    public function destroyFile(ProductFile $file)
    {
        try {
            Helper::deleteFile($file->file_path);
            $file->delete();

            return back()->with('success', 'Image deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'File deletion failed: '.$e->getMessage()]);
        }
    }

    /**
     * Delete a product and its associated files
     */
    public function destroy(Product $product)
    {
        DB::beginTransaction();
        try {
            // Delete associated files from storage
            foreach ($product->files as $file) {
                Helper::deleteFile($file->file_path);
            }

            // Delete the product (cascading deletes should handle fitments/part numbers if set up)
            $product->delete();

            DB::commit();
            AdminProductSnapshot::flush();
            Cache::forget('product_counts');
            Cache::forget('product_no_image_count');

            return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Delete Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Deletion failed: '.$e->getMessage()]);
        }
    }

    /**
     * Delete multiple products at once
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);

        DB::beginTransaction();
        try {
            $products = Product::whereIn('id', $request->ids)->with('files')->get();

            foreach ($products as $product) {
                foreach ($product->files as $file) {
                    Helper::deleteFile($file->file_path);
                }
                $product->delete();
            }

            DB::commit();
            AdminProductSnapshot::flush();
            Cache::forget('product_counts');
            Cache::forget('product_no_image_count');

            return redirect()->route('admin.products.index')->with('success', 'Selected products deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk Delete Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Bulk deletion failed: '.$e->getMessage()]);
        }
    }
}
