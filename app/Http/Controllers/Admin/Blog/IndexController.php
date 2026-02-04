<?php

namespace App\Http\Controllers\Admin\Blog;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::query()
            ->when($request->search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->per_page ?? 10)
            ->withQueryString()
            ->through(fn ($blog) => [
                'id' => $blog->id,
                'title' => $blog->title,
                'content' => $blog->content,
                'author' => $blog->author,
                'category' => $blog->category,
                'created_at' => $blog->created_at,
                'image_url' => Helper::generateURL($blog->image),
            ]);

        return Inertia::render('Admin/Blog/Index', [
            'blogs' => $blogs,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blog/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'author' => 'required',
            'category' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Use your Helper to upload
            $upload = Helper::uploadFile('blogs', $request->file('image'), false);
            $validated['image'] = $upload['original'] ?? null;
        }

        Blog::create($validated);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog created!');
    }

    public function edit(Blog $blog)
    {
        $blog->image_url = Helper::generateURL($blog->image);

        return Inertia::render('Admin/Blog/Edit', [
            'blog' => $blog,
        ]);
    }

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'author' => 'required',
            'category' => 'required',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            Helper::deleteFile($blog->image);

            $upload = Helper::uploadFile('blogs', $request->file('image'), false);
            $validated['image'] = $upload['original'] ?? null;
        } else {
            unset($validated['image']);
        }
        $blog->update($validated);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog updated successfully');
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();

        return redirect()->route('admin.blogs.index')->with('success', 'Blog deleted');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->ids;
        if ($request->all) {
            $blogs = Blog::query();
            if ($request->search) {
                $blogs->where('title', 'like', "%{$request->search}%")
                    ->orWhere('content', 'like', "%{$request->search}%");
            }
            $blogs = $blogs->get();
        } else {
            $blogs = Blog::whereIn('id', $ids)->get();
        }

        foreach ($blogs as $blog) {
            $blog->delete();
        }

        return redirect()->route('admin.blogs.index')->with('success', 'Selected blogs deleted');
    }
}
