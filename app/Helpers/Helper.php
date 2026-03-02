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

    public static function getTaxInfo(?string $country, ?string $province): array
    {
        $taxRates = [
            'Canada' => [
                'Alberta' => ['name' => 'GST 5%', 'rate' => 0.05],
                'British Columbia' => ['name' => 'GST+PST 12%', 'rate' => 0.12],
                'Manitoba' => ['name' => 'GST+PST 12%', 'rate' => 0.12],
                'New Brunswick' => ['name' => 'HST 15%', 'rate' => 0.15],
                'Newfoundland and Labrador' => ['name' => 'HST 15%', 'rate' => 0.15],
                'Nova Scotia' => ['name' => 'HST 15%', 'rate' => 0.15],
                'Northwest Territories' => ['name' => 'GST 5%', 'rate' => 0.05],
                'Nunavut' => ['name' => 'GST 5%', 'rate' => 0.05],
                'Ontario' => ['name' => 'HST 13%', 'rate' => 0.13],
                'Prince Edward Island' => ['name' => 'HST 15%', 'rate' => 0.15],
                'Quebec' => ['name' => 'GST+QST 14.975%', 'rate' => 0.14975],
                'Saskatchewan' => ['name' => 'GST+PST 11%', 'rate' => 0.11],
                'Yukon' => ['name' => 'GST 5%', 'rate' => 0.05],
            ],
            'United States' => [
                'Alabama' => ['name' => 'Sales Tax 4%', 'rate' => 0.04],
                'Alaska' => ['name' => 'Sales Tax 0%', 'rate' => 0.00],
                'Arizona' => ['name' => 'Sales Tax 5.6%', 'rate' => 0.056],
                'Arkansas' => ['name' => 'Sales Tax 6.5%', 'rate' => 0.065],
                'California' => ['name' => 'Sales Tax 7.25%', 'rate' => 0.0725],
                'Colorado' => ['name' => 'Sales Tax 2.9%', 'rate' => 0.029],
                'Connecticut' => ['name' => 'Sales Tax 6.35%', 'rate' => 0.0635],
                'Delaware' => ['name' => 'Sales Tax 0%', 'rate' => 0.00],
                'Florida' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Georgia' => ['name' => 'Sales Tax 4%', 'rate' => 0.04],
                'Hawaii' => ['name' => 'Sales Tax 4%', 'rate' => 0.04],
                'Idaho' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Illinois' => ['name' => 'Sales Tax 6.25%', 'rate' => 0.0625],
                'Indiana' => ['name' => 'Sales Tax 7%', 'rate' => 0.07],
                'Iowa' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Kansas' => ['name' => 'Sales Tax 6.5%', 'rate' => 0.065],
                'Kentucky' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Louisiana' => ['name' => 'Sales Tax 4.45%', 'rate' => 0.0445],
                'Maine' => ['name' => 'Sales Tax 5.5%', 'rate' => 0.055],
                'Maryland' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Massachusetts' => ['name' => 'Sales Tax 6.25%', 'rate' => 0.0625],
                'Michigan' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Minnesota' => ['name' => 'Sales Tax 6.875%', 'rate' => 0.06875],
                'Mississippi' => ['name' => 'Sales Tax 7%', 'rate' => 0.07],
                'Missouri' => ['name' => 'Sales Tax 4.225%', 'rate' => 0.04225],
                'Montana' => ['name' => 'Sales Tax 0%', 'rate' => 0.00],
                'Nebraska' => ['name' => 'Sales Tax 5.5%', 'rate' => 0.055],
                'Nevada' => ['name' => 'Sales Tax 6.85%', 'rate' => 0.0685],
                'New Hampshire' => ['name' => 'Sales Tax 0%', 'rate' => 0.00],
                'New Jersey' => ['name' => 'Sales Tax 6.625%', 'rate' => 0.06625],
                'New Mexico' => ['name' => 'Sales Tax 5.125%', 'rate' => 0.05125],
                'New York' => ['name' => 'Sales Tax 4%', 'rate' => 0.04],
                'North Carolina' => ['name' => 'Sales Tax 4.75%', 'rate' => 0.0475],
                'North Dakota' => ['name' => 'Sales Tax 5%', 'rate' => 0.05],
                'Ohio' => ['name' => 'Sales Tax 5.75%', 'rate' => 0.0575],
                'Oklahoma' => ['name' => 'Sales Tax 4.5%', 'rate' => 0.045],
                'Oregon' => ['name' => 'Sales Tax 0%', 'rate' => 0.00],
                'Pennsylvania' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Rhode Island' => ['name' => 'Sales Tax 7%', 'rate' => 0.07],
                'South Carolina' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'South Dakota' => ['name' => 'Sales Tax 4.5%', 'rate' => 0.045],
                'Tennessee' => ['name' => 'Sales Tax 7%', 'rate' => 0.07],
                'Texas' => ['name' => 'Sales Tax 6.25%', 'rate' => 0.0625],
                'Utah' => ['name' => 'Sales Tax 4.85%', 'rate' => 0.0485],
                'Vermont' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Virginia' => ['name' => 'Sales Tax 5.3%', 'rate' => 0.053],
                'Washington' => ['name' => 'Sales Tax 6.5%', 'rate' => 0.065],
                'West Virginia' => ['name' => 'Sales Tax 6%', 'rate' => 0.06],
                'Wisconsin' => ['name' => 'Sales Tax 5%', 'rate' => 0.05],
                'Wyoming' => ['name' => 'Sales Tax 4%', 'rate' => 0.04],
            ],
        ];

        if ($country && isset($taxRates[$country]) && $province && isset($taxRates[$country][$province])) {
            return $taxRates[$country][$province];
        }

        return ['name' => 'Tax 0%', 'rate' => 0.00];
    }
}
