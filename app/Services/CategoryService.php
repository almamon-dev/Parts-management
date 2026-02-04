<?php

namespace App\Services;

use App\Helpers\Helper;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoryService
{
    /**
     * Store multiple categories
     */
    public function storeCategories(array $data)
    {
        return DB::transaction(function () use ($data) {
            foreach ($data['categories'] as $categoryData) {
                $imagePath = $this->handleImageUpload($categoryData['image'] ?? null);

                Category::create([
                    'name' => $categoryData['name'],
                    'slug' => Str::slug($categoryData['name']),
                    'image' => $imagePath,
                    'category_type' => $categoryData['category_type'] ?? 1,
                    'status' => $categoryData['status'] ?? 'active',
                ]);
            }
            $this->clearCache();
        });
    }

    /**
     * Update a single category
     */
    public function updateCategory(Category $category, array $data, $imageFile = null)
    {
        return DB::transaction(function () use ($category, $data, $imageFile) {
            if ($imageFile) {
                Helper::deleteFile($category->image);
                $data['image'] = $this->handleImageUpload($imageFile);
            }

            $data['slug'] = Str::slug($data['name']);
            $category->update($data);

            $this->clearCache();
        });
    }

    /**
     * Delete a category and its files
     */
    public function deleteCategory(Category $category)
    {
        return DB::transaction(function () use ($category) {
            Helper::deleteFile($category->image);
            $category->delete();
            $this->clearCache();
        });
    }

    protected function handleImageUpload($file)
    {
        if (! $file) {
            return null;
        }
        $path = Helper::uploadFile('categories', $file, false);

        return is_array($path) ? $path['original'] : $path;
    }

    public function clearCache()
    {
        cache()->forget('category_counts');
        cache()->forget('admin_categories');
        cache()->forget('admin_categories_1');
        cache()->forget('admin_categories_2');
        cache()->forget('admin_categories_3');
    }
}
