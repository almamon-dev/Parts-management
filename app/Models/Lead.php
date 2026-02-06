<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'user_id',
        'lead_number',
        'po_number',
        'shop_name',
        'name',
        'contact_number',
        'email',
        'street_address',
        'unit_number',
        'city',
        'province',
        'postcode',
        'country',
        'notes',
        'vehicle_info',
        'vin',
        'color_code',
        'engine_size',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lead) {
            if (!$lead->lead_number) {
                $last = static::orderBy('id', 'desc')->first();
                $nextNumber = $last ? intval(substr($last->lead_number, 3)) + 1 : 10001;
                $lead->lead_number = 'LD-' . $nextNumber;
            }
        });
    }

    public function parts()
    {
        return $this->hasMany(LeadPart::class);
    }
}
