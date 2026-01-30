<?php

use App\Http\Controllers\Admin\Announcement\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\Blog\IndexController as AdminBlogController;
use App\Http\Controllers\Admin\Category\IndexController as AdminCategoryController;
use App\Http\Controllers\Admin\Customer\CustomerController;
use App\Http\Controllers\Admin\Lead\LeadController;
use App\Http\Controllers\Admin\Order\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\Product\IndexController as AdminProductController;
use App\Http\Controllers\Admin\ReturnRequest\ReturnRequestController as AdminReturnRequestController;
use App\Http\Controllers\Admin\Setting\SettingController;
use App\Http\Controllers\Admin\Settings\EmailSettingController;
use App\Http\Controllers\Admin\Settings\PaymentSettingController;
use App\Http\Controllers\Admin\Settings\ProfileSettingController;
use App\Http\Controllers\Admin\Support\SupportController as AdminSupportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\User\Blog\IndexController as UserBlogController;
use App\Http\Controllers\User\Booking\PaymentController;
use App\Http\Controllers\User\Cart\IndexController as UserCartController;
use App\Http\Controllers\User\Favourite\IndexController as UserFavouriteController;
use App\Http\Controllers\User\Order\ActiveOrderController;
use App\Http\Controllers\User\Order\HistoryController;
use App\Http\Controllers\User\Order\ReturnOrderController;
use App\Http\Controllers\User\Parts\IndexController as UserPartController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\User\Quote\QuoteController;
use App\Http\Controllers\User\Support\SupportController as UserSupportController;
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
| 1. Public Routes: Login and Stripe Webhook.
| 2. Authenticated Routes: User Dashboard, Parts, Cart, and Profile.
| 3. Admin Routes: Content and System Management with 'admin' prefix.
| 4. Fallback: Custom 404 page.
|
*/

// --- Public Routes ---
Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Stripe Webhook (Exempt from CSRF via bootstrap/app.php)
Route::post('/stripe/webhook', [PaymentController::class, 'webhook'])->name('stripe.webhook');

// --- Authenticated User Routes ---
Route::middleware(['auth'])->group(function () {

    // User Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User Profile & Settings
    Route::group(['prefix' => 'settings', 'as' => 'settings.'], function () {
        Route::get('/', [UserProfileController::class, 'index'])->name('index');
        Route::post('/account', [UserProfileController::class, 'updateAccount'])->name('account.update');
        Route::post('/company', [UserProfileController::class, 'updateCompany'])->name('company.update');
        Route::post('/password', [UserProfileController::class, 'updatePassword'])->name('password.update');
        Route::post('/preferences', [UserProfileController::class, 'updatePreferences'])->name('preferences.update');
        Route::post('/photo', [UserProfileController::class, 'updatePhoto'])->name('photo.update');
    });

    // Parts Catalog
    Route::post('parts/cart', [UserPartController::class, 'addToCart'])->name('parts.to-cart');
    Route::resource('parts', UserPartController::class);

    // Favourites
    Route::post('favourite/parts', [UserFavouriteController::class, 'toggle'])->name('parts.favourite');
    Route::resource('favourites', UserFavouriteController::class);

    // Quotes
    Route::group(['prefix' => 'quotes', 'as' => 'quotes.'], function () {
        Route::post('/toggle', [QuoteController::class, 'toggle'])->name('toggle');
        Route::post('/from-cart', [QuoteController::class, 'storeFromCart'])->name('store-from-cart');
        Route::post('/{quote}/convert', [QuoteController::class, 'convertToOrder'])->name('convert');
    });
    Route::resource('quotes', QuoteController::class)->except(['create', 'store']);

    // Shopping Cart
    Route::resource('carts', UserCartController::class);

    // Checkout & Payments
    Route::post('/checkout', [PaymentController::class, 'checkout'])->name('checkout.process');
    Route::get('/payment/success/{order_number}', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

    // User Orders & Returns
    Route::group(['prefix' => 'orders', 'as' => 'orders.'], function () {
        Route::get('/active', [ActiveOrderController::class, 'index'])->name('active');
        Route::get('/history', [HistoryController::class, 'index'])->name('history');
        Route::get('/{order}', [ActiveOrderController::class, 'show'])->name('show');
        Route::post('/{order}/reorder', [HistoryController::class, 'reOrder'])->name('reorder');

        // Return Management for User
        Route::get('/my-returns/list', [ReturnOrderController::class, 'returnOrder'])->name('returns.index');
        Route::post('/my-returns/store', [ReturnOrderController::class, 'returnRequest'])->name('returns.store');
    });

    // User Support & Legal
    Route::get('/contact', [UserSupportController::class, 'index'])->name('contact.index');
    Route::post('/contact', [UserSupportController::class, 'store'])->name('contact.store');
    Route::get('/terms', [UserSupportController::class, 'terms'])->name('terms.index');
    Route::get('/privacy', [UserSupportController::class, 'privacy'])->name('privacy.index');
    Route::get('/return-policy', [UserSupportController::class, 'returnPolicy'])->name('return-policy.index');

    // User Blogs
    Route::get('/blogs', [UserBlogController::class, 'index'])->name('blogs.index');
    Route::get('/blogs/{id}', [UserBlogController::class, 'show'])->name('blogs.show');
});

// --- Admin Backend Routes ---
Route::middleware(['auth'])->prefix('admin')->as('admin.')->group(function () {

    // Categories Management
    Route::delete('categories/bulk-destroy', [AdminCategoryController::class, 'bulkDestroy'])->name('categories.bulk-destroy');
    Route::resource('categories', AdminCategoryController::class);

    // Products Management
    Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
        Route::delete('/bulk-destroy', [AdminProductController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::get('/export', [AdminProductController::class, 'export'])->name('export');
        Route::delete('/file/{file}', [AdminProductController::class, 'destroyFile'])->name('file-destroy');
    });
    Route::resource('products', AdminProductController::class);

    // Admin Blogs
    Route::delete('blogs/bulk-destroy', [AdminBlogController::class, 'bulkDestroy'])->name('blogs.bulk-destroy');
    Route::resource('blogs', AdminBlogController::class);

    // Admin Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

    // Admin Returns
    Route::get('/returns', [AdminReturnRequestController::class, 'index'])->name('returns.index');
    Route::get('/returns/{returnRequest}', [AdminReturnRequestController::class, 'show'])->name('returns.show');
    Route::patch('/returns/{returnRequest}/status', [AdminReturnRequestController::class, 'updateStatus'])->name('returns.update-status');

    // Admin Lead Management
    Route::delete('leads/bulk-destroy', [LeadController::class, 'bulkDestroy'])->name('leads.bulk-destroy');
    Route::resource('leads', LeadController::class);
    Route::get('leads/{lead}/invoice', [LeadController::class, 'invoice'])->name('leads.invoice');

    // Customer Management (B2B)
    Route::group(['prefix' => 'customers', 'as' => 'customers.'], function () {
        Route::get('/', [CustomerController::class, 'index'])->name('index');
        Route::post('/global-discount', [CustomerController::class, 'applyGlobalDiscount'])->name('global-discount');
        Route::get('/search-products', [CustomerController::class, 'searchProducts'])->name('search-products');
        Route::delete('/bulk-destroy', [CustomerController::class, 'bulkDestroy'])->name('bulk-destroy');
        
        Route::get('/{customer}', [CustomerController::class, 'show'])->name('show');
        Route::patch('/{customer}/discount', [CustomerController::class, 'updateDiscount'])->name('update-discount');
        Route::delete('/{customer}/product-discount/{product_id}', [CustomerController::class, 'removeProductDiscount'])->name('remove-product-discount');
        Route::patch('/{customer}/reset-discount', [CustomerController::class, 'resetDiscount'])->name('reset-discount');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('destroy');
    });

    // Support Management
    Route::group(['prefix' => 'support', 'as' => 'support.'], function () {
        Route::get('/', [AdminSupportController::class, 'index'])->name('index');
        Route::patch('/{ticket}/status', [AdminSupportController::class, 'updateStatus'])->name('status.update');
        Route::delete('/bulk-destroy', [AdminSupportController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::delete('/{ticket}', [AdminSupportController::class, 'destroy'])->name('destroy');
    });

    // Announcements
    Route::resource('announcements', AdminAnnouncementController::class)->except(['show', 'edit', 'update']);
    Route::patch('announcements/{announcement}/status', [AdminAnnouncementController::class, 'updateStatus'])->name('announcements.update-status');

    // Admin Settings
    Route::group(['prefix' => 'settings', 'as' => 'settings.'], function () {
        Route::get('/', [SettingController::class, 'index'])->name('index');
        Route::post('/', [SettingController::class, 'update'])->name('update');
    });

    // System Settings
    Route::group(['prefix' => 'settings', 'as' => 'settings.'], function () {
        Route::get('/email', [EmailSettingController::class, 'index'])->name('email');
        Route::post('/email', [EmailSettingController::class, 'update'])->name('email.update');

        Route::get('/payment', [PaymentSettingController::class, 'index'])->name('payment');
        Route::post('/payment', [PaymentSettingController::class, 'update'])->name('payment.update');

        Route::get('/profile', [ProfileSettingController::class, 'index'])->name('profile');
        Route::post('/profile', [ProfileSettingController::class, 'update'])->name('profile.update');
        Route::post('/profile/password', [ProfileSettingController::class, 'updatePassword'])->name('profile.password');
    });
});

// --- Fallback Route ---
Route::fallback(function () {
    return Inertia::render('Errors/404');
});

require __DIR__.'/auth.php';
