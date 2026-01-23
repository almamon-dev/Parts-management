<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'lead_number',
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lead) {
            $latest = static::latest('id')->first();
            $number = $latest ? $latest->id + 1 : 1;
            $lead->lead_number = 'LD-' . str_pad($number, 5, '0', STR_PAD_LEFT);
        });
    }

    public function parts()
    {
        return $this->hasMany(LeadPart::class);
    }
}
