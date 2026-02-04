<?php

namespace App\Http\Controllers\Admin\Announcement;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Helpers\Helper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Announcement/Index', [
            'announcements' => Announcement::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $upload = Helper::uploadFile('announcements', $request->file('image'), false);

        if (!$upload) {
            return redirect()->back()->with('error', 'Failed to upload banner.');
        }

        Announcement::create([
            'title' => $request->title,
            'image_path' => $upload['original'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Announcement uploaded successfully.');
    }

    public function updateStatus(Announcement $announcement)
    {
        $announcement->update([
            'is_active' => ! $announcement->is_active,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->back()->with('success', 'Announcement deleted successfully.');
    }
}
