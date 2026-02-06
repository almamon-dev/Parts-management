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
        'invoice_number',
        'po_number',
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
            // Generate Order Number
            if (!$order->order_number) {
                $lastOrder = static::orderBy('id', 'desc')->first();
                $nextOrderNumber = $lastOrder ? intval(substr($lastOrder->order_number, 2)) + 1 : 21001;
                $order->order_number = 'OR' . $nextOrderNumber;
            }

            // Generate Invoice Number
            if (!$order->invoice_number) {
                $lastInvoice = static::whereNotNull('invoice_number')->orderBy('id', 'desc')->first();
                $nextInvoiceNumber = $lastInvoice ? intval(substr($lastInvoice->invoice_number, 3)) + 1 : 100001;
                $order->invoice_number = 'INV' . $nextInvoiceNumber;
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
