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

                $category = Category::create([
                    'name' => $categoryData['name'],
                    'slug' => Str::slug($categoryData['name']),
                    'image' => $imagePath,
                    'status' => $categoryData['status'] ?? 'active',
                    'featured' => $categoryData['featured'] ?? false,
                ]);

                if (! empty($categoryData['sub_categories'])) {
                    $this->syncSubCategories($category, $categoryData['sub_categories']);
                }
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

            if (isset($data['sub_categories'])) {
                $this->syncSubCategories($category, $data['sub_categories']);
            }

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
            $category->subCategories()->delete();
            $category->delete();
            $this->clearCache();
        });
    }

    /**
     * Sync SubCategories (Create, Update, Delete)
     */
    protected function syncSubCategories(Category $category, array $subCategories)
    {
        $submittedIds = collect($subCategories)->pluck('id')->filter()->toArray();
        $category->subCategories()->whereNotIn('id', $submittedIds)->delete();

        foreach ($subCategories as $subData) {
            if (! empty($subData['name'])) {
                $category->subCategories()->updateOrCreate(
                    ['id' => $subData['id'] ?? null],
                    [
                        'name' => $subData['name'],
                        'status' => $subData['status'] ?? 'active',
                    ]
                );
            }
        }
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
        cache()->forget('admin_sub_categories');
    }
}
