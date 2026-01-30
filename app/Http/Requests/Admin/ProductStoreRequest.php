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
            'category_id' => ['required', 'exists:categories,id'],
            'sub_category_id' => ['required', 'exists:sub_categories,id'],

            // Pricing
            'list_price' => ['required', 'numeric', 'min:0'],

            // Identifiers
            'sku' => ['required', 'string', 'unique:products,sku'],
            'location_id' => ['required', 'string'],

            // Stock Levels
            'stock_oakville' => ['nullable', 'integer', 'min:0'],
            'stock_mississauga' => ['nullable', 'integer', 'min:0'],
            'stock_saskatoon' => ['nullable', 'integer', 'min:0'],

            // Visibility
            'visibility' => ['required', 'in:public,private,draft'],

            // Fitments Validation (Array of Objects)
            'fitments' => ['required', 'array', 'min:1'],
            'fitments.*.year_from' => ['required', 'digits:4', 'integer'],
            'fitments.*.year_to' => ['required', 'digits:4', 'integer'],
            'fitments.*.make' => ['required', 'string', 'max:100'],
            'fitments.*.model' => ['required', 'string', 'max:100'],

            // Part Numbers Validation (Array of Strings)
            'part_numbers' => ['required', 'array', 'min:1'],
            'part_numbers.*' => ['required', 'string', 'max:50'],

            // Images Validation
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:20048'],
        ];
    }

    public function messages(): array
    {
        return [
            'fitments.*.year_from.required' => 'Start year is required for each fitment.',
            'part_numbers.*.required' => 'Part number field cannot be empty.',
            'images.*.image' => 'Each file must be an image.',
            'sku.unique' => 'This SKU is already in use.',
        ];
    }
}
