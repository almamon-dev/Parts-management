<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $fillable = [
        'user_id',
        'quote_number',
        'title',
        'status',
        'valid_until',
        'total_amount',
        'items_count',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quote) {
            if (! $quote->quote_number) {
                $lastQuote = static::orderBy('id', 'desc')->first();
                $nextNumber = $lastQuote ? intval(substr($lastQuote->quote_number, 2)) + 1 : 2001;
                $quote->quote_number = 'QT'.$nextNumber;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }
}
