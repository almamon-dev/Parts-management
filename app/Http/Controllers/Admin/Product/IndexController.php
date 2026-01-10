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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        // Calculate Counts for Tabs
        $counts = [
            'all' => Product::count(),
            'published' => Product::where('visibility', 'public')->count(),
            'draft' => Product::where('visibility', 'draft')->count(),
            'private' => Product::where('visibility', 'private')->count(),
            'no_image' => Product::whereDoesntHave('files')->count(),
        ];

        $products = $query->with(['category:id,name', 'subCategory:id,name', 'partsNumbers', 'files', 'fitments'])
            // Status Tabs Filter
            ->when($request->status, function ($q, $status) {
                if ($status === 'published') {
                    $q->where('visibility', 'public');
                }
                if ($status === 'draft') {
                    $q->where('visibility', 'draft');
                }
                if ($status === 'private') {
                    $q->where('visibility', 'private');
                }
                if ($status === 'no_image') {
                    $q->whereDoesntHave('files');
                }
            })
            // Advanced Search
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhereHas('partsNumbers', fn ($pq) => $pq->where('part_number', 'like', "%{$search}%"));
                });
            })
            // Category/Sub-category filters
            ->when($request->category, fn ($q, $cat) => $q->whereHas('category', fn ($c) => $c->where('name', $cat)))
            ->when($request->sub_category, fn ($q, $sub) => $q->whereHas('subCategory', fn ($s) => $s->where('name', $sub)))
            ->latest()
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
            'counts' => $counts,
            'categories' => Category::all(['id', 'name']),
            'subCategories' => SubCategory::all(['id', 'name', 'category_id']),
            'filters' => $request->all(),
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
                'buy_price' => $request->buy_price,
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
                    $path = Helper::uploadFile('products', $image);
                    ProductFile::create([
                        'product_id' => $product->id,
                        'file_name' => $fileName,
                        'file_path' => $path,
                        'file_size' => $fileSize,
                        'file_type' => $fileType,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error for debugging
            Log::error('Product Store Error: '.$e->getMessage());

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
                'buy_price' => $product->buy_price,
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
                        $path = Helper::uploadFile('products', $image);

                        // -- database save
                        $product->files()->create([
                            'file_name' => $fileName,
                            'file_path' => $path,
                            'file_size' => $fileSize,
                            'file_type' => $fileType,
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('products.index')->with('success', 'Product updated successfully.');

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
}
