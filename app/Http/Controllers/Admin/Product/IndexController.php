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
use Illuminate\Support\Facades\Cache;
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
            if ($request->filled('pp_id')) {
                $ppId = $request->pp_id;
            } else {
                // Generate PP ID: PP110001, PP110002, etc.
                $latestProduct = Product::whereNotNull('pp_id')
                    ->where('pp_id', 'like', 'PP%')
                    ->orderBy(DB::raw('LENGTH(pp_id)'), 'desc')
                    ->orderBy('pp_id', 'desc')
                    ->first();

                if ($latestProduct) {
                    $lastNumber = (int) str_replace('PP', '', $latestProduct->pp_id);
                    $nextNumber = $lastNumber > 0 ? $lastNumber + 1 : 110001;
                } else {
                    $nextNumber = 110001;
                }
                $ppId = 'PP'.$nextNumber;
            }

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

    public function show(Product $product)
    {
        $product->load(['partType', 'shopView', 'sorting', 'fitments', 'partsNumbers', 'files']);

        return Inertia::render('Admin/Product/Show', [
            'product' => [
                ...$product->toArray(),
                'part_numbers' => $product->partsNumbers->pluck('part_number')->toArray(),
            ],
            'categoriesTier1' => Category::where('category_type', 1)->get(),
            'categoriesTier2' => Category::where('category_type', 2)->get(),
            'categoriesTier3' => Category::where('category_type', 3)->get(),
        ]);
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
                'pp_id' => $request->filled('pp_id') ? $request->pp_id : $product->pp_id,
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
        $products = Product::with(['partsNumbers', 'fitments'])
            ->select([
                'id', 'pp_id', 'sku', 'description', 'list_price', 'buy_price',
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
            fputcsv($file, [
                'PP ID', 'SKU', 'Description', 'List Price', 'Buy Price',
                'Stock OKV', 'Stock MSA', 'Stock SKT', 'Visibility',
                'Interchange Numbers', 'Fitments'
            ]);

            foreach ($products as $product) {
                // Format Parts Numbers
                $partsNumbers = $product->partsNumbers->pluck('part_number')->implode(', ');

                // Format Fitments: YearFrom-YearTo|Make|Model
                $fitments = $product->fitments->map(function ($f) {
                    return "{$f->year_from}-{$f->year_to}|{$f->make}|{$f->model}";
                })->implode(', ');

                fputcsv($file, [
                    $product->pp_id,
                    $product->sku,
                    $product->description,
                    $product->list_price,
                    $product->buy_price,
                    $product->stock_oakville,
                    $product->stock_mississauga,
                    $product->stock_saskatoon,
                    $product->visibility,
                    $partsNumbers,
                    $fitments
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function downloadTemplate()
    {
        // ... same content
    }

    public function getImportProgress()
    {
        return response()->json([
            'progress' => Cache::get('product_import_progress_'.auth()->id(), 0),
            'total' => Cache::get('product_import_total_'.auth()->id(), 0),
            'status' => Cache::get('product_import_status_'.auth()->id(), 'idle'),
        ]);
    }

    public function parseImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $path = $request->file('file')->getRealPath();
        $file = fopen($path, 'r');
        $headers = fgetcsv($file);
        fclose($file);

        return response()->json([
            'headers' => $headers,
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'mapping' => 'required',
        ]);

        try {
            $path = $request->file('file')->getRealPath();
            $data = array_map('str_getcsv', file($path));

            if (count($data) < 2) {
                return back()->withErrors(['error' => 'The file is empty or has no data.']);
            }

            $csvHeader = $data[0];
            unset($data[0]);

            $mapping = $request->input('mapping');
            Log::info('Product Import Mapping received:', ['mapping' => $mapping]);

            if (is_string($mapping)) {
                $mapping = json_decode($mapping, true);
            }
            
            if (!$mapping) {
                Log::error('Product Import: Invalid mapping format.');
                return back()->withErrors(['error' => 'Invalid column mapping.']);
            }
            
            Log::info('Decoded mapping:', $mapping);
            
            $totalRows = count($data);
            Cache::put('product_import_total_'.auth()->id(), $totalRows, 600);
            Cache::put('product_import_progress_'.auth()->id(), 0, 600);
            Cache::put('product_import_status_'.auth()->id(), 'processing', 600);
            
            $successCount = 0;
            $failCount = 0;

            DB::beginTransaction();
            foreach ($data as $index => $row) {
                // Update progress every 10 rows to avoid cache overhead
                if ($index % 10 === 0) {
                    Cache::put('product_import_progress_'.auth()->id(), $index, 600);
                }
                
                if (count($row) < count($csvHeader)) {
                    Log::warning("Skipping row $index: Column count mismatch.", ['row' => $row]);
                    continue;
                }

                // Map data based on user selection
                $sku = isset($mapping['sku']) && isset($row[$mapping['sku']]) ? trim($row[$mapping['sku']]) : null;
                
                Log::info("Processing row $index SKU: $sku");

                if (!$sku) {
                    $failCount++;
                    continue;
                }

                $productData = [
                    'sku' => $sku,
                    'description' => isset($mapping['description']) && isset($row[$mapping['description']]) ? $row[$mapping['description']] : '',
                    'list_price' => isset($mapping['list_price']) && isset($row[$mapping['list_price']]) ? (float)$row[$mapping['list_price']] : 0,
                    'buy_price' => isset($mapping['buy_price']) && isset($row[$mapping['buy_price']]) ? (float)$row[$mapping['buy_price']] : 0,
                    'stock_oakville' => isset($mapping['stock_oakville']) && isset($row[$mapping['stock_oakville']]) ? (int)$row[$mapping['stock_oakville']] : 0,
                    'stock_mississauga' => isset($mapping['stock_mississauga']) && isset($row[$mapping['stock_mississauga']]) ? (int)$row[$mapping['stock_mississauga']] : 0,
                    'stock_saskatoon' => isset($mapping['stock_saskatoon']) && isset($row[$mapping['stock_saskatoon']]) ? (int)$row[$mapping['stock_saskatoon']] : 0,
                    'part_type_id' => isset($mapping['part_type_id']) && isset($row[$mapping['part_type_id']]) ? $row[$mapping['part_type_id']] : 1,
                    'shop_view_id' => isset($mapping['shop_view_id']) && isset($row[$mapping['shop_view_id']]) ? $row[$mapping['shop_view_id']] : 1,
                    'sorting_id' => isset($mapping['sorting_id']) && isset($row[$mapping['sorting_id']]) ? $row[$mapping['sorting_id']] : 1,
                    'location_id' => isset($mapping['location_id']) && isset($row[$mapping['location_id']]) ? $row[$mapping['location_id']] : '',
                    'visibility' => isset($mapping['visibility']) && isset($row[$mapping['visibility']]) ? $row[$mapping['visibility']] : 'public',
                    'is_clearance' => isset($mapping['is_clearance']) && isset($row[$mapping['is_clearance']]) ? (bool)$row[$mapping['is_clearance']] : false,
                ];

                $product = Product::updateOrCreate(['sku' => $sku], $productData);

                // Handle PP ID
                if (!$product->pp_id) {
                    $latestProduct = Product::whereNotNull('pp_id')->where('pp_id', 'like', 'PP%')->orderBy(DB::raw('LENGTH(pp_id)'), 'desc')->orderBy('pp_id', 'desc')->first();
                    $nextNumber = $latestProduct ? (int) str_replace('PP', '', $latestProduct->pp_id) + 1 : 110001;
                    $product->update(['pp_id' => 'PP'.$nextNumber]);
                }

                // Related: Interchange Numbers
                if (isset($mapping['interchange_numbers']) && isset($row[$mapping['interchange_numbers']])) {
                    $product->partsNumbers()->delete();
                    foreach (explode(',', $row[$mapping['interchange_numbers']]) as $num) {
                        if ($n = trim($num)) $product->partsNumbers()->create(['part_number' => $n]);
                    }
                }

                // Related: Fitments
                if (isset($mapping['fitments']) && isset($row[$mapping['fitments']])) {
                    $product->fitments()->delete();
                    foreach (explode(',', $row[$mapping['fitments']]) as $fitItem) {
                        $parts = explode('|', trim($fitItem));
                        if (count($parts) === 3) {
                            $years = explode('-', $parts[0]);
                            $product->fitments()->create([
                                'year_from' => trim($years[0]),
                                'year_to' => trim($years[1] ?? $years[0]),
                                'make' => trim($parts[1]),
                                'model' => trim($parts[2]),
                            ]);
                        }
                    }
                }

                // Related: Images
                if (isset($mapping['image_source']) && isset($row[$mapping['image_source']])) {
                    foreach (explode(',', $row[$mapping['image_source']]) as $src) {
                        if ($upload = Helper::uploadFile('products', trim($src))) {
                            $product->files()->create([
                                'file_name' => basename($src),
                                'file_path' => $upload['original'],
                                'file_type' => 'image',
                                'thumbnail_path' => $upload['thumbnail'] ?? $upload['original'],
                                'file_size' => 0,
                            ]);
                        }
                    }
                }

                $successCount++;
            }
            DB::commit();

            Cache::put('product_import_progress_'.auth()->id(), $totalRows, 600);
            Cache::put('product_import_status_'.auth()->id(), 'completed', 600);

            return redirect()->route('admin.products.index')->with('success', "Import completed: {$successCount} succeeded, {$failCount} failed.");
        } catch (\Exception $e) {
            DB::rollBack();
            Cache::put('product_import_status_'.auth()->id(), 'failed', 600);
            Log::error('Product Import Exception:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Import failed: '.$e->getMessage()]);
        }
    }
}
