<?php

namespace App\Models;

use App\Helpers\Helper;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = ['title', 'image_path', 'is_active'];

    protected static function booted()
    {
        static::deleting(function ($announcement) {
            if ($announcement->getRawOriginal('image_path')) {
                \App\Helpers\Helper::deleteFile($announcement->getRawOriginal('image_path'));
            }
        });
    }

    public function getImagePathAttribute($value)
    {
        return Helper::generateURL($value);
    }
}
