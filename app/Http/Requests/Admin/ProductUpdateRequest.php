<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): bool|array
    {

        $productId = $this->route('product')->id;

        return [
            'description' => 'required|string',
            'list_price' => 'required|numeric|min:0',
            'sku' => 'required|string|max:100|unique:products,sku,'.$productId,
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'stock_oakville' => 'nullable|integer|min:0',
            'stock_mississauga' => 'nullable|integer|min:0',
            'stock_saskatoon' => 'nullable|integer|min:0',
            'location_id' => 'nullable|string',
            'visibility' => 'required|in:public,private,draft',

            // --- Fitments
            'fitments' => 'nullable|array',
            'part_numbers' => 'nullable|array',

            // --- Images
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:20048',
        ];
    }

    public function messages(): array
    {
        return [
            'sku.unique' => 'The provided SKU is already in use, please enter a unique one.',
        ];
    }
}
