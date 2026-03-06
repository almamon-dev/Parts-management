<?php

namespace App\Http\Controllers\User;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('User/Profile/Settings', [
            'user' => $user,
        ]);
    }

    public function updateAccount(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return back()->with('success', 'Account information updated successfully.');
    }

    public function updateCompany(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'street_address' => 'nullable|string|max:255',
            'unit_number' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postcode' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'account_type' => ['nullable', 'string'],
        ]);

        // Automatically sync the legacy 'address' field for backward compatibility
        $parts = array_filter([
            $validated['street_address'] ?? null,
            $validated['unit_number'] ?? null,
            $validated['city'] ?? null,
            $validated['province'] ?? null,
            $validated['postcode'] ?? null,
            $validated['country'] ?? null
        ]);
        
        $validated['address'] = implode(', ', $parts);

        $user->update($validated);

        return back()->with('success', 'Company information updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    public function updatePreferences(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'store_hours' => 'nullable|array',
            'marketing_emails' => 'boolean',
            'order_confirmation' => 'boolean',
            'order_cancellation' => 'boolean',
            'monthly_statement' => 'boolean',
        ]);

        $user->update($validated);

        return back()->with('success', 'Preferences updated successfully.');
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        $user = Auth::user();

        // Delete old photo
        if ($user->profile_photo) {
            Helper::deleteFile($user->profile_photo);
        }

        // Upload new photo
        $upload = Helper::uploadFile('profile-photos', $request->file('photo'));

        if ($upload) {
            $user->update(['profile_photo' => $upload['original']]);

            return back()->with('success', 'Profile photo updated successfully.');
        }

        return back()->with('error', 'Failed to upload photo.');
    }
}
