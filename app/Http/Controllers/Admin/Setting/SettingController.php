<?php

namespace App\Http\Controllers\Admin\Setting;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Helpers\Helper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        
        return Inertia::render('Admin/Setting/Index', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'site_name' => 'nullable|string',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'site_favicon' => 'nullable|image|mimes:ico,png,jpg,webp|max:512',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            if ($request->hasFile($key)) {
                // Delete old file if exists
                $oldSetting = Setting::where('key', $key)->first();
                if ($oldSetting && $oldSetting->value) {
                    Helper::deleteFile($oldSetting->value);
                }

                // Use Helper to upload - passing false to withThumb as settings don't need thumbs usually
                $upload = Helper::uploadFile('settings', $request->file($key), false);
                
                if ($upload && isset($upload['original'])) {
                    Setting::updateOrCreate(['key' => $key], ['value' => $upload['original']]);
                }
            } else {
                if ($key !== 'site_logo' && $key !== 'site_favicon') {
                    Setting::updateOrCreate(['key' => $key], ['value' => $value]);
                }
            }
        }

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }
}
