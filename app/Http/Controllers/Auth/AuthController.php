<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Traits\SendOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    use SendOtp;

    private const PURPOSES = [
        'verify' => 'email_verify',
        'reset' => 'password_reset',
    ];

    // --- 1. Authentication ---

    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();

            // Strict verification check
            if (! $user->is_verified) {
                Auth::logout();
                $this->sendOtp($user, self::PURPOSES['verify']);

                return redirect()->route('otp.verify.show', ['email' => $user->email])
                    ->with('error', 'Please verify your email. A new code has been sent.');
            }

            $request->session()->regenerate();

            return redirect()->intended('/dashboard')->with('success', 'Welcome back!');
        }

        return back()->withErrors(['email' => 'Invalid credentials.']);
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

                // Prevent re-registering verified accounts
                if (User::where('email', $data['email'])->where('is_verified', true)->exists()) {
                    return redirect()->route('login')->with('error', 'Email already verified. Please login.');
                }

                // Handle Profile Photo storage
                $photo = $request->hasFile('profile_photo')
                    ? $request->file('profile_photo')->store('profile-photos', 'public')
                    : null;

                $user = User::updateOrCreate(
                    ['email' => $data['email']],
                    array_merge($data, [
                        'password' => Hash::make($data['password']),
                        'profile_photo' => $photo,
                        'is_verified' => false,
                        'store_hours' => [
                            'start_day' => $request->store_start_day,
                            'end_day' => $request->store_end_day,
                            'open_time' => $request->store_open_time,
                            'close_time' => $request->store_close_time,
                        ],
                    ])
                );

                $this->sendOtp($user, self::PURPOSES['verify']);

                return redirect()->route('otp.verify.show', ['email' => $user->email])
                    ->with('success', 'Check your email for the verification code.');
            });
        } catch (\Exception $e) {
            Log::error("Registration Failed: {$e->getMessage()}");

            return back()->withErrors(['message' => 'Registration failed. Try again.'])->withInput();
        }
    }

    // --- 3. OTP Logic ---

    public function showVerifyOtp(Request $request)
    {
        return Inertia::render('Auth/VerifyOTP', [
            'email' => $request->email,
            'is_password_reset' => $request->boolean('reset'),
            'otp_length' => (int) config('otp.length', 6),
            'resend_interval' => 120,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        // Handle array OTP input from frontend
        if (is_array($request->otp)) {
            $request->merge(['otp' => implode('', $request->otp)]);
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:'.config('otp.length', 6),
        ]);

        $user = User::where('email', $request->email)->firstOrFail();
        $purpose = $request->boolean('is_password_reset') ? self::PURPOSES['reset'] : self::PURPOSES['verify'];

        $result = $this->verifyOtpCode($user, $request->otp, $purpose);

        if (! $result['success']) {
            return back()->withErrors(['otp' => $result['message']]);
        }

        return DB::transaction(function () use ($user, $purpose) {
            if ($purpose === self::PURPOSES['reset']) {
                $token = Str::random(60);
                $user->update([
                    'reset_password_token' => hash('sha256', $token),
                    'reset_password_token_expire_at' => now()->addMinutes(15),
                ]);

                return redirect()->route('password.reset', ['token' => $token, 'email' => $user->email]);
            }

            $user->update(['email_verified_at' => now(), 'is_verified' => true]);
            Auth::login($user);

            return redirect()->route('dashboard');
        });
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

    // --- 4. Password Reset ---

    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $user = User::where('email', $request->email)->first();

        $result = $this->sendOtp($user, self::PURPOSES['reset']);

        return $result['success']
            ? redirect()->route('otp.verify.show', ['email' => $user->email, 'reset' => 1])
            : back()->withErrors(['email' => $result['message']]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)
            ->where('reset_password_token', hash('sha256', $request->token)) // Secure token check
            ->where('reset_password_token_expire_at', '>', now())
            ->first();

        if (! $user) {
            return back()->withErrors(['email' => 'Invalid or expired token.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'reset_password_token' => null,
            'reset_password_token_expire_at' => null,
        ]);

        return redirect()->route('login')->with('success', 'Password updated successfully.');
    }

    // --- 5. Logout ---

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
