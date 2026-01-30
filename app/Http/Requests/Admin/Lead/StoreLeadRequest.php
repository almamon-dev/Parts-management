<?php

namespace App\Http\Requests\Admin\Lead;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'po_number' => 'nullable|string|max:255',
            'shop_name' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'street_address' => 'nullable|string|max:255',
            'unit_number' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postcode' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'vehicle_info' => 'required|string|max:255',
            'vin' => 'nullable|string|max:255',
            'color_code' => 'nullable|string|max:255',
            'engine_size' => 'nullable|string|max:255',
            'status' => 'required|string|in:Quote,Processing,Fulfilled',
            'parts' => 'required|array|min:1',
            'parts.*.part_name' => 'required|string|max:255',
            'parts.*.vendor' => 'nullable|string|max:255',
            'parts.*.buy_price' => 'nullable|numeric|min:0',
            'parts.*.sell_price' => 'nullable|numeric|min:0',
            'parts.*.payment_status' => 'nullable|string|max:255',
            'parts.*.method' => 'nullable|string|max:255',
            'parts.*.status' => 'nullable|string|max:255',
        ];
    }
}
