<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'subtotal',
        'tax',
        'total_amount',
        'status',
        'order_type',
        'shipping_address',
        'notes',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (! $order->order_number) {
                $lastOrder = static::orderBy('id', 'desc')->first();
                if (! $lastOrder) {
                    $order->order_number = 'OR21000';
                } else {
                    // Extract numeric part from last order number (e.g., OR21000 -> 21000)
                    $lastNumber = intval(substr($lastOrder->order_number, 2));
                    $order->order_number = 'OR'.($lastNumber + 1);
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function returnRequests()
    {

        return $this->hasMany(ReturnRequest::class);
    }
}
