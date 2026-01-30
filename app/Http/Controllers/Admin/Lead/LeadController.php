<?php

namespace App\Http\Controllers\Admin\Lead;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Lead\StoreLeadRequest;
use App\Models\Lead;
use App\Models\LeadPart;
use App\Services\AdminLeadSnapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'per_page']);
        $perPage = $request->input('per_page', 15);
        $leads = AdminLeadSnapshot::getPaginatedLeads($filters, $perPage);

        return Inertia::render('Admin/Lead/Index', [
            'leads' => $leads,
            'filters' => $filters,
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
            return back()->with('error', 'Failed to create lead: ' . $e->getMessage());
        }
    }

    public function show(Lead $lead)
    {
        $lead->load('parts');
        return Inertia::render('Admin/Lead/Show', [
            'lead' => $lead
        ]);
    }

    public function edit(Lead $lead)
    {
        $lead->load('parts');
        return Inertia::render('Admin/Lead/Edit', [
            'lead' => $lead
        ]);
    }

    public function invoice(Lead $lead)
    {
        $lead->load('parts');
        return Inertia::render('Admin/Lead/Invoice', [
            'lead' => $lead
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
            return back()->with('error', 'Failed to update lead: ' . $e->getMessage());
        }
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        
        if (!empty($ids)) {
            Lead::whereIn('id', $ids)->delete();
            AdminLeadSnapshot::clearCache();
        }

        return redirect()->back()->with('success', 'Selected leads deleted successfully.');
    }
}
