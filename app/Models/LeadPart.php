<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadPart extends Model
{
    protected $fillable = [
        'lead_id',
        'part_name',
        'vendor',
        'buy_price',
        'sell_price',
        'payment_status',
        'method',
        'status',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
