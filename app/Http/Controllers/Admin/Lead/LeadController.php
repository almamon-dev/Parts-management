<?php

namespace App\Http\Controllers\Admin\Lead;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Lead\StoreLeadRequest;
use App\Models\Lead;
use App\Services\AdminLeadSnapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'user_id', 'city', 'sort', 'direction', 'per_page']);
        $perPage = $request->input('per_page', 15);
        $leads = AdminLeadSnapshot::getPaginatedLeads($filters, $perPage);

        // Get users for filter
        $users = \App\Models\User::select('id', 'first_name', 'last_name')
            ->whereIn('user_type', ['admin', 'staff'])
            ->orderBy('first_name')
            ->get()
            ->map(fn ($u) => ['id' => $u->id, 'name' => "{$u->first_name} {$u->last_name}"]);

        // Get unique cities for filter
        $cities = Lead::whereNotNull('city')->where('city', '!=', '')->distinct()->orderBy('city')->pluck('city');

        return Inertia::render('Admin/Lead/Index', [
            'leads' => $leads,
            'filters' => $filters,
            'users' => $users,
            'cities' => $cities,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Lead/Create');
    }

    public function store(StoreLeadRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $leadData = collect($validated)->except('parts')->toArray();
            $leadData['user_id'] = auth()->id();

            $lead = Lead::create($leadData);

            foreach ($validated['parts'] as $part) {
                $lead->parts()->create($part);
            }

            DB::commit();

            // Clear cache
            AdminLeadSnapshot::clearCache();

            return redirect()->route('admin.leads.index')
                ->with('success', 'Lead created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to create lead: '.$e->getMessage());
        }
    }

    public function show(Lead $lead)
    {
        $lead->load(['parts', 'user']);

        return Inertia::render('Admin/Lead/Show', [
            'lead' => $lead,
        ]);
    }

    public function edit(Lead $lead)
    {
        $lead->load('parts');

        return Inertia::render('Admin/Lead/Edit', [
            'lead' => $lead,
        ]);
    }

    public function invoice(Lead $lead)
    {
        $lead->load(['parts', 'user']); // user needed for created by

        return Inertia::render('Admin/Lead/Invoice', [
            'lead' => $lead,
        ]);
    }

    public function update(StoreLeadRequest $request, Lead $lead)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $leadData = collect($validated)->except('parts')->toArray();
            $lead->update($leadData);

            // Sync parts: Delete old and create new is simplest for this scale
            $lead->parts()->delete();
            foreach ($validated['parts'] as $part) {
                unset($part['id']); // Ensure we create new ones
                $lead->parts()->create($part);
            }

            DB::commit();

            AdminLeadSnapshot::clearCache();

            return redirect()->route('admin.leads.index')
                ->with('success', 'Lead updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to update lead: '.$e->getMessage());
        }
    }

    public function destroy(Lead $lead)
    {
        try {
            $lead->delete();
            AdminLeadSnapshot::clearCache();

            return redirect()->route('admin.leads.index')->with('success', 'Lead deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete lead: '.$e->getMessage()]);
        }
    }

    public function bulkDestroy(Request $request)
    {
        try {
            $ids = $request->input('ids', []);

            if ($request->boolean('all')) {
                $query = Lead::query();
                // Apply same filters as Index for "Delete All"
                if ($request->search) {
                    $search = $request->search;
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('shop_name', 'like', "%{$search}%")
                            ->orWhere('contact_number', 'like', "%{$search}%");
                    });
                }
                if ($request->status && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
                $query->delete();
                $message = 'All filtered leads deleted successfully.';
            } elseif (! empty($ids)) {
                Lead::whereIn('id', $ids)->delete();
                $message = count($ids).' leads deleted successfully.';
            } else {
                return back()->withErrors(['error' => 'No leads selected for deletion.']);
            }

            AdminLeadSnapshot::clearCache();

            return redirect()->route('admin.leads.index')->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Bulk delete failed: '.$e->getMessage()]);
        }
    }

    public function searchByPhone(Request $request)
    {
        $phone = $request->input('phone');
        if (! $phone) {
            return response()->json(['found' => false]);
        }

        $lead = Lead::where('contact_number', 'like', "%{$phone}%")
            ->latest()
            ->first();

        if ($lead) {
            return response()->json(['found' => true, 'lead' => $lead]);
        }

        return response()->json(['found' => false]);
    }
}
