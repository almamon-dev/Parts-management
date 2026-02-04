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
        $query = Lead::with(['parts', 'user'])
            ->withCount('parts')
            ->withSum('parts as total_buy_sum', 'buy_price')
            ->withSum('parts as total_sell_sum', 'sell_price');

        // Status Filter
        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', 'LIKE', $filters['status'] . '%');
        }

        // User (Employee) Filter
        if (! empty($filters['user_id']) && $filters['user_id'] !== 'all') {
            $query->where('user_id', $filters['user_id']);
        }

        // City Filter
        if (! empty($filters['city']) && $filters['city'] !== 'all') {
            $query->where('city', $filters['city']);
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
                    })
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('first_name', 'like', "%{$search}%")
                           ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        // Sorting
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        if ($sort === 'created_by') {
            $query->join('users', 'leads.user_id', '=', 'users.id')
                  ->select('leads.*') // Avoid column collision
                  ->orderBy('users.first_name', $direction);
        } elseif ($sort === 'buy') {
            $query->orderBy('total_buy_sum', $direction);
        } elseif ($sort === 'sell') {
            $query->orderBy('total_sell_sum', $direction);
        } elseif ($sort === 'date') {
            $query->orderBy('created_at', $direction);
        } else {
            // Default or column sort
            $query->orderBy($sort, $direction);
        }

        $paginated = $query->paginate($perPage)->withQueryString();

        // Add calculated totals to each lead (keep for legacy compatibility if needed, though withSum covers the values)
        $paginated->getCollection()->transform(function ($lead) {
            $lead->total_buy = $lead->total_buy_sum ?? $lead->parts->sum('buy_price');
            $lead->total_sell = $lead->total_sell_sum ?? $lead->parts->sum('sell_price');
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
