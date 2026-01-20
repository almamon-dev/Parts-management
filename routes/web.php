<?php

use App\Http\Controllers\Admin\Blog\IndexController as BlogController;
use App\Http\Controllers\Admin\Category\IndexController as CategoryController;
use App\Http\Controllers\Admin\Product\IndexController as ProductController;
use App\Http\Controllers\API\User\Blog\IndexController as UserBlogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\User\Booking\PaymentController;
use App\Http\Controllers\User\Cart\IndexController as CartController;
use App\Http\Controllers\User\Favourite\IndexController as FavouriteController;
use App\Http\Controllers\User\Order\ActiveOrderController;
use App\Http\Controllers\User\Order\HistoryController;
use App\Http\Controllers\User\Order\ReturnOrderController;
use App\Http\Controllers\User\Parts\IndexController as PartController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file contains all the routes for the application.
|
| 1. Public routes: Login page and welcome pages accessible without authentication.
| 2. Authenticated user routes: Dashboard, profile management.
| 3. Parts routes: List, add to cart.
| 4. Favourite routes: Toggle and list favourite parts.
| 5. Cart routes: User cart management.
| 6. Checkout & payment routes: Checkout, success, and cancel URLs.
| 7. Admin backend routes: Categories, products, blogs with bulk actions.
| 8. Fallback route: 404 page for unmatched URLs.
| 9. Auth routes: login, register, password reset, etc.
|
|--------------------------------------------------------------------------
*/

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

    Route::post('parts/cart', [PartController::class, 'addToCart'])->name('parts.to-cart');
    Route::resource('parts', PartController::class);

    Route::post('favourite/parts', [FavouriteController::class, 'toggle'])->name('parts.favourite');
    Route::resource('favourites', FavouriteController::class);

    Route::resource('carts', CartController::class);

    Route::post('/checkout', [PaymentController::class, 'checkout'])->name('checkout.process');
    Route::get('/payment/success/{order_number}', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

    Route::delete('categories/bulk-destroy', [CategoryController::class, 'bulkDestroy'])->name('categories.bulk-destroy');
    Route::resource('categories', CategoryController::class);

    Route::delete('products/bulk-destroy', [ProductController::class, 'bulkDestroy'])->name('products.bulk-destroy');
    Route::get('products/export', [ProductController::class, 'export'])->name('products.export');
    Route::delete('products/file/{file}', [ProductController::class, 'destroyFile'])->name('products.file-destroy');
    Route::resource('products', ProductController::class);

    Route::resource('admin/blogs', BlogController::class);

    // history
    Route::get('/orders/active', [ActiveOrderController::class, 'index'])->name('orders.active');
    // Order History
    Route::get('/orders/history', [HistoryController::class, 'index'])->name('orders.history');
    // reorder details
    Route::post('/orders/{order}/reorder', [HistoryController::class, 'reOrder'])
        ->name('orders.reorder');

    // --return order
    Route::get('/orders/return', [ReturnOrderController::class, 'returnOrder'])->name('orders.return');
    // -- add return request
    Route::post('/orders/return/request', [ReturnOrderController::class, 'returnRequest'])->name('orders.return.request');
    // blog
    Route::get('/blogs', [UserBlogController::class, 'index'])->name('blogs.index');
    Route::get('/blogs/{id}', [UserBlogController::class, 'show'])->name('blogs.show');

});

Route::fallback(function () {
    return Inertia::render('Errors/404');
});

require __DIR__.'/auth.php';
