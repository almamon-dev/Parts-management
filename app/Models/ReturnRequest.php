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
        'reason',
        'description',
        'image_path',
        'status',
        'rejection_reason',
    ];

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
