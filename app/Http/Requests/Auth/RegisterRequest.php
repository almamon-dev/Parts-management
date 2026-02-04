<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
        $email = $this->input('email');

        return [
            // Personal Information
            'username' => ['nullable', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    $user = User::where('email', $value)->first();
                    if ($user && $user->is_verified) {
                        $fail('The email has already been taken and verified.');
                    }
                },
            ],

            'password' => ['required', 'confirmed', Password::defaults()],

            // User Profile Setup
            'position' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:20048'],

            // Company Information
            'company_name' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'account_type' => ['nullable', 'in:Bodyshop,Towing / Fleet Services,Auto Part Store,Dealership,Mechanic'],
            'company_phone' => ['nullable', 'string', 'max:20'],

            // Store Hours
            'store_start_day' => ['nullable', 'string'],
            'store_end_day' => ['nullable', 'string'],
            'store_open_time' => ['nullable', 'string'],
            'store_close_time' => ['nullable', 'string'],

            // Preferences
            'marketing_emails' => ['nullable', 'boolean'],
            'order_confirmation' => ['nullable', 'boolean'],
            'order_cancellation' => ['nullable', 'boolean'],
            'monthly_statement' => ['nullable', 'boolean'],
        ];
    }
}
