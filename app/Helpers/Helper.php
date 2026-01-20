<?php

namespace App\Helpers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class Helper
{
    /**
     * Delete a file from public/uploads
     */
    public static function uploadFile($folder, $file, $withThumb = true): ?array
    {
        try {
            if (! $file || ! $file->isValid()) {
                throw new \Exception('Invalid file');
            }

            $basePath = "uploads/$folder";
            $fullPath = public_path($basePath);
            File::ensureDirectoryExists($fullPath);

            // file save
            $filename = time().'_'.Str::random(8).'.webp';

            $manager = new ImageManager(new Driver);
            $image = $manager->read($file);

            $image->scale(width: 1200)
                ->toWebp(80)
                ->save($fullPath.'/'.$filename);

            $result = [
                'original' => "$basePath/$filename",
                'thumbnail' => null,
            ];

            // thumbnail save
            if ($withThumb) {
                $thumbPath = public_path("$basePath/thumbs");
                File::ensureDirectoryExists($thumbPath);

                $image->cover(80, 80)
                    ->toWebp(50)
                    ->save($thumbPath.'/'.$filename);

                $result['thumbnail'] = "$basePath/thumbs/$filename";
            }

            return $result;

        } catch (\Exception $e) {
            Log::error('File upload error: '.$e->getMessage());

            return null;
        }
    }

    public static function deleteFile(?string $filePath): bool
    {
        if (! $filePath) {
            return false; // nothing to delete
        }

        $fullPath = public_path($filePath);

        // Only unlink if it's a file
        if (file_exists($fullPath) && is_file($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }

    /**
     * Generate a public URL for the uploaded file
     */
    public static function generateURL(?string $filePath): ?string
    {
        // Check if the path is empty or only whitespace
        if (empty($filePath) || trim($filePath) === '') {
            return null;
        }
        $fullPath = public_path($filePath);

        // Only return URL if file actually exists
        if (file_exists($fullPath)) {
            return asset($filePath);
        }

        return null;
    }
}
