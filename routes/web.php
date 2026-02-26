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
    Route::get('/checkout', [PaymentController::class, 'checkoutPage'])->name('checkout.index');
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

    // Categories Management (linked to products permission)
    Route::middleware(['permission:products.view'])->group(function () {
        Route::delete('categories/bulk-destroy', [AdminCategoryController::class, 'bulkDestroy'])
            ->middleware('permission:products.edit')->name('categories.bulk-destroy');
        Route::resource('categories', AdminCategoryController::class)->middleware([
            'create' => 'permission:products.edit',
            'store' => 'permission:products.edit',
            'edit' => 'permission:products.edit',
            'update' => 'permission:products.edit',
            'destroy' => 'permission:products.edit',
        ]);
    });

    // Products Management
    Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
        Route::get('/', [AdminProductController::class, 'index'])->middleware('permission:products.view')->name('index');
        Route::get('/create', [AdminProductController::class, 'create'])->middleware('permission:products.create')->name('create');
        Route::post('/', [AdminProductController::class, 'store'])->middleware('permission:products.create')->name('store');
        Route::get('/export', [AdminProductController::class, 'export'])->middleware('permission:products.view')->name('export');
        
        Route::get('/{product}', [AdminProductController::class, 'show'])->middleware('permission:products.view')->name('show');
        Route::get('/{product}/edit', [AdminProductController::class, 'edit'])->middleware('permission:products.edit')->name('edit');
        Route::post('/{product}', [AdminProductController::class, 'update'])->middleware('permission:products.edit')->name('update'); // Using POST for update often in these projects
        Route::patch('/{product}', [AdminProductController::class, 'update'])->middleware('permission:products.edit')->name('update.patch');
        Route::put('/{product}', [AdminProductController::class, 'update'])->middleware('permission:products.edit')->name('update.put');
        Route::delete('/{product}', [AdminProductController::class, 'destroy'])->middleware('permission:products.delete')->name('destroy');
        
        Route::delete('/bulk-destroy', [AdminProductController::class, 'bulkDestroy'])->middleware('permission:products.delete')->name('bulk-destroy');
        Route::delete('/file/{file}', [AdminProductController::class, 'destroyFile'])->middleware('permission:products.edit')->name('file-destroy');
    });

    // Admin Blogs
    Route::middleware(['permission:blogs.view'])->group(function () {
        Route::delete('blogs/bulk-destroy', [AdminBlogController::class, 'bulkDestroy'])
            ->middleware('permission:blogs.manage')->name('blogs.bulk-destroy');
        Route::resource('blogs', AdminBlogController::class)->middleware([
            'create' => 'permission:blogs.manage',
            'store' => 'permission:blogs.manage',
            'edit' => 'permission:blogs.manage',
            'update' => 'permission:blogs.manage',
            'destroy' => 'permission:blogs.manage',
        ]);
    });

    // Admin Orders
    Route::middleware(['permission:orders.view'])->group(function () {
        Route::delete('orders/bulk-destroy', [AdminOrderController::class, 'bulkDestroy'])
            ->middleware('permission:orders.manage')->name('orders.bulk-destroy');
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])
            ->middleware('permission:orders.manage')->name('orders.update-status');
        Route::delete('/orders/{order}', [AdminOrderController::class, 'destroy'])
            ->middleware('permission:orders.manage')->name('orders.destroy');
    });

    // Admin Returns
    Route::middleware(['permission:returns.view'])->group(function () {
        Route::get('/returns', [AdminReturnRequestController::class, 'index'])->name('returns.index');
        Route::get('/returns/{returnRequest}', [AdminReturnRequestController::class, 'show'])->name('returns.show');
        Route::patch('/returns/{returnRequest}/status', [AdminReturnRequestController::class, 'updateStatus'])
            ->middleware('permission:returns.approve_decline')->name('returns.update-status');
    });

    // Admin Lead Management
    Route::middleware(['permission:leads.view'])->group(function () {
        Route::get('leads/search-by-phone', [LeadController::class, 'searchByPhone'])->name('leads.search-by-phone');
        Route::delete('leads/bulk-destroy', [LeadController::class, 'bulkDestroy'])
            ->middleware('permission:leads.delete')->name('leads.bulk-destroy');
        Route::get('leads/{lead}/invoice', [LeadController::class, 'invoice'])->name('leads.invoice');
        
        Route::get('leads', [LeadController::class, 'index'])->name('leads.index');
        Route::get('leads/create', [LeadController::class, 'create'])
            ->middleware('permission:leads.create')->name('leads.create');
        Route::post('leads', [LeadController::class, 'store'])
            ->middleware('permission:leads.create')->name('leads.store');
        Route::get('leads/{lead}', [LeadController::class, 'show'])->name('leads.show');
        Route::get('leads/{lead}/edit', [LeadController::class, 'edit'])
            ->middleware('permission:leads.edit')->name('leads.edit');
        Route::match(['put', 'patch'], 'leads/{lead}', [LeadController::class, 'update'])
            ->middleware('permission:leads.edit')->name('leads.update');
        Route::delete('leads/{lead}', [LeadController::class, 'destroy'])
            ->middleware('permission:leads.delete')->name('leads.destroy');
    });

    // Customer Management (B2B) - Requires high level access, usually Admin/Manager
    Route::middleware(['permission:orders.manage'])->group(function () {
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
    });

    // Support Management
    Route::middleware(['permission:support_tickets.view'])->group(function () {
        Route::group(['prefix' => 'support', 'as' => 'support.'], function () {
            Route::get('/', [AdminSupportController::class, 'index'])->name('index');
            Route::patch('/{ticket}/status', [AdminSupportController::class, 'updateStatus'])
                ->middleware('permission:support_tickets.manage')->name('status.update');
            Route::delete('/bulk-destroy', [AdminSupportController::class, 'bulkDestroy'])
                ->middleware('permission:support_tickets.manage')->name('bulk-destroy');
            Route::delete('/{ticket}', [AdminSupportController::class, 'destroy'])
                ->middleware('permission:support_tickets.manage')->name('destroy');
        });
    });

    // Announcements
    Route::middleware(['permission:announcements.view'])->group(function () {
        Route::resource('announcements', AdminAnnouncementController::class)
            ->except(['show', 'edit', 'update'])
            ->middleware(['index' => 'permission:announcements.view', 'store' => 'permission:announcements.manage', 'destroy' => 'permission:announcements.manage']);
        
        Route::patch('announcements/{announcement}/status', [AdminAnnouncementController::class, 'updateStatus'])
            ->middleware('permission:announcements.manage')->name('announcements.update-status');
    });

    // Admin Settings - Only Super Admin or explicitly allowed
    Route::middleware(['permission:settings.access'])->group(function () {
        Route::group(['prefix' => 'settings', 'as' => 'settings.'], function () {
            Route::get('/', [SettingController::class, 'index'])->name('index');
            Route::post('/', [SettingController::class, 'update'])->name('update');

            // System Settings
            Route::get('/email', [EmailSettingController::class, 'index'])->name('email');
            Route::post('/email', [EmailSettingController::class, 'update'])->name('email.update');

            Route::get('/payment', [PaymentSettingController::class, 'index'])->name('payment');
            Route::post('/payment', [PaymentSettingController::class, 'update'])->name('payment.update');

            Route::get('/profile', [ProfileSettingController::class, 'index'])->name('profile');
            Route::post('/profile', [ProfileSettingController::class, 'update'])->name('profile.update');
            Route::post('/profile/password', [ProfileSettingController::class, 'updatePassword'])->name('profile.password');

            // Roles & Permissions
            Route::get('/roles', [\App\Http\Controllers\Admin\Role\RoleController::class, 'index'])->name('roles.index');
            Route::post('/roles', [\App\Http\Controllers\Admin\Role\RoleController::class, 'store'])->name('roles.store');
            Route::get('/permissions-list', [\App\Http\Controllers\Admin\Role\RoleController::class, 'permissionsIndex'])->name('permissions.index');
            Route::post('/permissions', [\App\Http\Controllers\Admin\Role\RoleController::class, 'storePermission'])->name('permissions.store');
            Route::post('/roles/{role}/permissions', [\App\Http\Controllers\Admin\Role\RoleController::class, 'updatePermissions'])->name('roles.permissions.update');
            Route::delete('/roles/{role}', [\App\Http\Controllers\Admin\Role\RoleController::class, 'destroy'])->name('roles.destroy');

            // Staff Management
            Route::get('/staff-list', [\App\Http\Controllers\Admin\Role\RoleController::class, 'staffIndex'])->name('staff.index');
            Route::get('/staff/create', [\App\Http\Controllers\Admin\Role\RoleController::class, 'createStaff'])->name('staff.create');
            Route::post('/staff', [\App\Http\Controllers\Admin\Role\RoleController::class, 'storeStaff'])->name('staff.store');
            Route::post('/staff/{user}/access', [\App\Http\Controllers\Admin\Role\RoleController::class, 'updateUserAccess'])->name('staff.access.update');
            Route::post('/users/{user}/permissions', [\App\Http\Controllers\Admin\Role\RoleController::class, 'updateUserPermissions'])->name('users.permissions.update');
            Route::delete('/staff/{user}', [\App\Http\Controllers\Admin\Role\RoleController::class, 'destroyStaff'])->name('staff.destroy');
        });
    });
});

// --- Fallback Route ---
Route::fallback(function () {
    return Inertia::render('Errors/404');
});

require __DIR__.'/auth.php';
