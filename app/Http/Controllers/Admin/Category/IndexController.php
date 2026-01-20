<?php

namespace App\Http\Controllers\Admin\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class IndexController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $counts = cache()->remember('category_counts', 300, function () {
            return [
                'all' => Category::count(),
                'active' => Category::where('status', 'active')->count(),
                'inactive' => Category::where('status', 'inactive')->count(),
            ];
        });

        $categories = Category::query()
            ->withCount('subCategories')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%$s%"))
            ->latest()
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Admin/Category/Index', [
            'category' => $categories,
            'counts' => $counts,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Category/Create');
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $this->categoryService->storeCategories($request->validated());

            return redirect()->route('categories.index')->with('success', 'Created successfully!');
        } catch (\Exception $e) {
            Log::error('Category Store Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Store failed.']);
        }
    }

    public function edit(Category $category)
    {

        $category->load('subCategories');

        return Inertia::render('Admin/Category/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        try {
            $this->categoryService->updateCategory($category, $request->all(), $request->file('image'));

            return redirect()->route('categories.index')->with('success', 'Updated successfully!');
        } catch (\Exception $e) {
            Log::error('Category Update Error: '.$e->getMessage());

            return back()->withErrors(['error' => 'Update failed: '.$e->getMessage()]);
        }
    }

    public function destroy(Category $category)
    {
        try {
            $this->categoryService->deleteCategory($category);

            return back()->with('success', 'Deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Delete failed.']);
        }
    }
}
