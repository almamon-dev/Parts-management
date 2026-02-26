<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'description' => 'required|string|min:10',
            'pp_id' => 'nullable|string|max:100|unique:products,pp_id,'.$productId,
            'list_price' => 'required|numeric|min:0',
            'sku' => 'required|string|max:100|unique:products,sku,'.$productId,
            'part_type_id' => 'required|exists:categories,id',
            'shop_view_id' => 'required|exists:categories,id',
            'sorting_id' => 'required|exists:categories,id',
            'stock_oakville' => 'nullable|integer|min:0',
            'stock_mississauga' => 'nullable|integer|min:0',
            'stock_saskatoon' => 'nullable|integer|min:0',
            'location_id' => 'nullable|string|max:100',
            'visibility' => 'required|in:public,private,draft',
            'position' => 'nullable|string|in:Front,Driver Side,Passenger Side,Rear,Inside',
            'is_clearance' => 'nullable|boolean',

            // Arrays
            'part_numbers' => 'nullable|array',
            'fitments' => 'nullable|array',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ];
    }
}
