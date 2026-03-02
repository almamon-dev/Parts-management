<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\Helper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Traits\SendOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    use SendOtp;

    // Define purposes to prevent reusing a "verify email" OTP for "reset password"
    private const PURPOSES = [
        'verify' => 'email_verify',
        'reset' => 'password_reset',
    ];

    // --- 1. Authentication ---
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showAdminLogin()
    {
        return Inertia::render('Auth/Login', [
            'isAdmin' => true,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required',
        ]);

        $throttleKey = Str::lower($request->input('email')).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return back()->withErrors([
                'email' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        $loginType = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [$loginType => $request->email, 'password' => $request->password];

        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();

            if ($user->isAdmin()) {
                Auth::logout();

                return back()->withErrors([
                    'email' => 'Admins must login through the admin login page.',
                ]);
            }

            RateLimiter::clear($throttleKey);

            if (! $user->is_verified) {
                Auth::logout();
                $this->sendOtp($user, self::PURPOSES['verify']);

                return redirect()->route('otp.verify.show', ['email' => $user->email])
                    ->with('error', 'Please verify your email. A new code has been sent.');
            }

            $request->session()->regenerate();

            return redirect()->intended('/dashboard')->with('success', 'Logged in successfully!');
        }

        RateLimiter::hit($throttleKey);

        return back()->withErrors([
            'email' => 'These credentials do not match our records.',
        ]);
    }

    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required',
        ]);

        $throttleKey = 'admin|'.Str::lower($request->input('email')).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return back()->withErrors([
                'email' => "Too many login attempts. Please try again in {$seconds} seconds.",
            ]);
        }

        $loginType = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [$loginType => $request->email, 'password' => $request->password];

        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();

            if (! $user->isAdmin()) {
                Auth::logout();

                return back()->withErrors([
                    'email' => 'Only admins can login through this page.',
                ]);
            }

            RateLimiter::clear($throttleKey);

            $request->session()->regenerate();

            return redirect()->intended('/admin/products')->with('success', 'Logged in successfully!');
        }

        RateLimiter::hit($throttleKey);

        return back()->withErrors([
            'email' => 'These credentials do not match our records.',
        ]);
    }

    // --- 2. Registration ---

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(RegisterRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $data = $request->validated();

                // Check for verified email to prevent duplicate accounts
                if (User::where('email', $data['email'])->where('is_verified', true)->exists()) {
                    return redirect()->route('login')->with('info', 'Account already exists. Please login.');
                }

                // Handle Profile Photo Upload using Helper
                $profilePhotoPath = null;
                if ($request->hasFile('profile_photo')) {
                    $uploadResult = Helper::uploadFile('users/profile', $request->file('profile_photo'), false);
                    $profilePhotoPath = $uploadResult['original'] ?? null;
                }

                // Create or update unverified user
                $user = User::updateOrCreate(
                    ['email' => $data['email']],
                    array_merge($data, [
                        'password' => Hash::make($data['password']),
                        'profile_photo' => $profilePhotoPath,
                        'is_verified' => false,
                        'store_hours' => [
                            'start_day' => $data['store_start_day'] ?? null,
                            'end_day' => $data['store_end_day'] ?? null,
                            'open_time' => $data['store_open_time'] ?? null,
                            'close_time' => $data['store_close_time'] ?? null,
                        ],
                    ])
                );

                $this->sendOtp($user, self::PURPOSES['verify']);

                return redirect()->route('otp.verify.show', ['email' => $user->email])
                    ->with('success', 'Verification code sent to your email.');
            });
        } catch (\Exception $e) {
            Log::error('Registration Error: '.$e->getMessage(), ['exception' => $e]);

            return back()->withErrors(['email' => 'Unable to complete registration. Please try again.'])->withInput();
        }
    }

    // ---  OTP Logic ---

    public function showVerifyOtp(Request $request)
    {
        return Inertia::render('Auth/VerifyOTP', [
            'email' => $request->email,
            'is_password_reset' => $request->boolean('reset'),
            'otp_length' => (int) config('otp.length', 6),
            'resend_interval' => 120,
        ]);
    }

    // --- OTP verification --
    public function verifyOtp(Request $request)
    {
        // Convert OTP array from frontend (if applicable) into a single string
        if (is_array($request->otp)) {
            $request->merge(['otp' => implode('', $request->otp)]);
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->firstOrFail();

        /** * FIX: Ensure we detect the correct purpose.
         * If the URL has 'reset=1' or 'is_password_reset' is true, it's for a password reset.
         */
        $isReset = $request->boolean('is_password_reset') || $request->has('reset');
        $purpose = $isReset ? self::PURPOSES['reset'] : self::PURPOSES['verify'];

        // Verify code via Trait
        $result = $this->verifyOtpCode($user, $request->otp, $purpose);

        if (! $result['success']) {
            return back()->withErrors(['otp' => $result['message']]);
        }

        return DB::transaction(function () use ($user, $purpose, $request) {
            if ($purpose === self::PURPOSES['reset']) {
                // Generate a temporary secure token for the reset form
                $plainToken = Str::random(60);

                $user->update([
                    'reset_password_token' => hash('sha256', $plainToken),
                    'reset_password_token_expire_at' => now()->addMinutes(15),
                ]);

                return redirect()->route('password.reset', [
                    'token' => $plainToken,
                    'email' => $user->email,
                ]);
            }

            // Mark email as verified for registration flow
            $user->update(['email_verified_at' => now(), 'is_verified' => true]);
            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->route('dashboard');
        });
    }

    // --- Password reset page ---
    public function showResetPassword(Request $request, $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    // --- Password reset form submission ---
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $hashedToken = hash('sha256', $request->token);

        $user = User::where('email', $request->email)
            ->where('reset_password_token', $hashedToken)
            ->where('reset_password_token_expire_at', '>', now())
            ->first();

        if (! $user) {
            return back()->withErrors(['email' => 'Invalid or expired reset link.']);
        }
        // Update the user's password
        $user->update([
            'password' => Hash::make($request->password),
            'reset_password_token' => null,
            'reset_password_token_expire_at' => null,
        ]);

        return redirect()->route('password.confirm')->with('success', 'Password reset successfully. Please login.');
    }

    public function resendOtp(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (! $user) {
            return back()->withErrors(['message' => 'User not found.']);
        }

        $purpose = $request->boolean('is_password_reset') ? self::PURPOSES['reset'] : self::PURPOSES['verify'];
        $result = $this->sendOtp($user, $purpose);

        return $result['success']
            ? back()->with('success', 'New OTP sent.')
            : back()->withErrors(['message' => $result['message']]);
    }
    // --- 4. Password Reset Flow ---

    public function showForgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $user = User::where('email', $request->email)->first();

        $result = $this->sendOtp($user, self::PURPOSES['reset']);

        return $result['success']
            ? redirect()->route('otp.verify.show', ['email' => $user->email, 'reset' => 1])
            : back()->withErrors(['email' => $result['message']]);
    }

    // -- confirm page when complete  password --
    public function showConfirmPassword()
    {
        return Inertia::render('Auth/PasswordSuccess');
    }

    // --- 5. Logout ---
    public function logout(Request $request)
    {
        $isAdmin = Auth::check() && Auth::user()->isAdmin();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $isAdmin ? redirect()->route('admin.login') : redirect('/login');
    }
}
