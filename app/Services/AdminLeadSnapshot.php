<?php

namespace App\Services;

use App\Models\Lead;
use Illuminate\Support\Facades\Cache;

class AdminLeadSnapshot
{
    /**
     * Get paginated leads with searching.
     */
    public static function getPaginatedLeads($filters = [], $perPage = 15)
    {
        $query = Lead::with(['parts'])->withCount('parts');

        // Status Filter
        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        // Search Filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('shop_name', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%")
                    ->orWhere('lead_number', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%")
                    ->orWhere('street_address', 'like', "%{$search}%")
                    ->orWhere('postcode', 'like', "%{$search}%")
                    ->orWhere('vehicle_info', 'like', "%{$search}%")
                    ->orWhere('vin', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('parts', function ($pq) use ($search) {
                        $pq->where('part_name', 'like', "%{$search}%")
                            ->orWhere('vendor', 'like', "%{$search}%");
                    });
            });
        }

        $paginated = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Add calculated totals to each lead
        $paginated->getCollection()->transform(function ($lead) {
            $lead->total_buy = $lead->parts->sum('buy_price');
            $lead->total_sell = $lead->parts->sum('sell_price');
            // Join vendors if multiple
            $lead->vendors = $lead->parts->pluck('vendor')->unique()->filter()->implode(', ');

            return $lead;
        });

        return $paginated;
    }

    /**
     * Clear leads cache.
     */
    public static function clearCache()
    {
        Cache::flush();
    }
}
