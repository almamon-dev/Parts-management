<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->user_type === 'admin') {
            return Inertia::render('Admin/Dashboard');
        }

        // Default user dashboard
        return Inertia::render('User/Dashboard');
    }

    public function parts()
    {
        return Inertia::render('User/Parts/Index');
    }
}
