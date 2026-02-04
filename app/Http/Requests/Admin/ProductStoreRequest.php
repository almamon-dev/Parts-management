<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Basic Information
            'description' => ['required', 'string', 'min:10'],
            'part_type_id' => ['required', 'exists:categories,id'],
            'shop_view_id' => ['required', 'exists:categories,id'],
            'sorting_id' => ['required', 'exists:categories,id'],

            // Pricing
            'list_price' => ['required', 'numeric', 'min:0'],

            // Inventory
            'sku' => ['required', 'string', 'unique:products,sku'],
            'location_id' => ['nullable', 'string'],
            'stock_oakville' => ['nullable', 'integer', 'min:0'],
            'stock_mississauga' => ['nullable', 'integer', 'min:0'],
            'stock_saskatoon' => ['nullable', 'integer', 'min:0'],
            'visibility' => ['required', 'in:public,private,draft'],
            'position' => ['nullable', 'string', 'in:Front,Driver Side,Passenger Side,Rear,Inside'],
            'is_clearance' => ['nullable', 'boolean'],

            // Fitments & Part Numbers (handled in controller but validated here if needed)
            'part_numbers' => ['nullable', 'array'],
            'part_numbers.*' => ['nullable', 'string'],
            'fitments' => ['nullable', 'array'],
            'fitments.*.year_from' => ['nullable', 'string'],
            'fitments.*.year_to' => ['nullable', 'string'],
            'fitments.*.make' => ['nullable', 'string'],
            'fitments.*.model' => ['nullable', 'string'],

            // Media
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
        ];
    }
}
