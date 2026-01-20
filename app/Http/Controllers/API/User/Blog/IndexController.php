<?php

namespace App\Http\Controllers\API\User\Blog;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {

        $blogs = Blog::latest()->get();

        // ২. রিঅ্যাক্ট কম্পোনেন্টে ডাটা পাঠানো
        return Inertia::render('User/Blog/IndexBlog', [
            'blogs' => $blogs,
        ]);
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id);

        return Inertia::render('User/Blog/ShowBlog', [
            'blog' => $blog,
        ]);
    }
}
