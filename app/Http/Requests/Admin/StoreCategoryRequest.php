<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'categories' => 'required|array|max:20',
            'categories.*.name' => 'required|string|max:255',
            'categories.*.status' => 'required|in:active,inactive',
            'categories.*.category_type' => 'required|integer|between:1,3',
            'categories.*.featured' => 'sometimes|boolean',
            'categories.*.image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20048',
        ];
    }

    public function messages(): array
    {
        return [
            'categories.required' => 'Please add at least one category.',
            'categories.*.name.required' => 'Category name is required.',
            'categories.*.image.image' => 'File must be an image.',
            'categories.*.image.max' => 'Image must not exceed 20MB.',
        ];
    }
}
