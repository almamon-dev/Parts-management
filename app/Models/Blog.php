<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'content', 'image', 'author', 'category'];

    protected static function booted()
    {
        static::deleting(function ($blog) {
            if ($blog->image) {
                \App\Helpers\Helper::deleteFile($blog->image);
            }
        });
    }
}
