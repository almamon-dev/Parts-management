<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReturnRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'order_id',
        'user_id',
        'return_number',
        'reason',
        'description',
        'image_path',
        'status',
        'rejection_reason',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($request) {
            if (! $request->return_number) {
                $last = static::orderBy('id', 'desc')->first();
                $nextNumber = $last ? intval(substr($last->return_number, 2)) + 1 : 1001;
                $request->return_number = 'RT'.$nextNumber;
            }
        });
    }

    /**
     * Get the order associated with the return request.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the user who made the return request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
