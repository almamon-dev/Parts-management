<?php

use App\Http\Controllers\Admin\Blog\IndexController as BlogController;
use App\Http\Controllers\Admin\Category\IndexController as CategoryController;
use App\Http\Controllers\Admin\Product\IndexController as ProductController;
// user dashboard
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\Cart\IndexController as CartController;
use App\Http\Controllers\User\Favourite\IndexController as FavouriteController;
use App\Http\Controllers\User\Parts\IndexController as PartController;
// category and sub category
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // add to cart
    Route::post('parts/cart', [PartController::class, 'addToCart'])->name('parts.to-cart');
    Route::resource('parts', PartController::class);

    // favourite part
    Route::post('favourite/parts', [FavouriteController::class, 'toggle'])->name('parts.favourite');
    Route::resource('favourites', FavouriteController::class);

    // at to cart
    Route::resource('carts', CartController::class);

    // admin backend routes
    // category
    Route::delete('categories/bulk-destroy', [CategoryController::class, 'bulkDestroy'])
        ->name('categories.bulk-destroy');
    Route::resource('categories', CategoryController::class);

    // products
    Route::get('products/export', [ProductController::class, 'export'])->name('products.export');
    Route::delete('products/file/{file}', [ProductController::class, 'destroyFile'])->name('products.file-destroy');
    Route::resource('products', ProductController::class);
    // blog
    Route::resource('blogs', BlogController::class);

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::fallback(function () {
    return Inertia::render('Errors/404');
});

require __DIR__.'/auth.php';
