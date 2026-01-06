<?php

namespace App\Traits;

use App\Jobs\SendOtpEmailJob;
use App\Mail\OtpMail;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

trait SendOtp
{
    /**
     * Generate and send OTP to the user.
     * Handles rate limiting and database transactions.
     */
    public function sendOtp(User $user, string $purpose = 'email_verify'): array
    {
        $rateLimitKey = "otp:{$user->id}:{$purpose}";
        $intervalKey = "otp_interval:{$user->id}:{$purpose}";

        // 1. Check if user is exceeding request limits or the resend interval
        if ($err = $this->checkRateLimits($rateLimitKey, $intervalKey, $user, $purpose)) {
            return $err;
        }

        $cfg = $this->getOtpConfig();
        $plainOtp = $this->generateOtp($cfg['length']);

        try {
            return DB::transaction(function () use ($user, $plainOtp, $purpose, $cfg, $rateLimitKey, $intervalKey) {
                // 2. Save hashed OTP record to the database
                $this->createOtpRecord($user, $plainOtp, $purpose, $cfg['expiry']);

                // 3. Apply rate limit markers
                $this->applyRateLimits($rateLimitKey, $intervalKey);

                // 4. Dispatch the OTP via Mail or Queue Job
                $this->dispatchOtp($user, $plainOtp, $purpose);

                return [
                    'success' => true,
                    'message' => 'OTP has been sent to your email address.',
                    'expires_in' => $cfg['expiry'] * 60,
                ];
            });
        } catch (Exception $e) {
            Log::error("OTP delivery failed for {$user->email}: {$e->getMessage()}");

            return [
                'success' => false,
                'message' => 'Failed to send OTP. Please try again later.',
            ];
        }
    }

    /**
     * Verify the provided OTP against the stored hash.
     */
    public function verifyOtpCode(User $user, string $inputOtp, string $purpose = 'email_verify'): array
    {
        $verifyLimitKey = "otp_verify:{$user->id}:{$purpose}";

        // Check if the user is blocked due to too many failed attempts
        if ($err = $this->checkVerificationRateLimit($verifyLimitKey, $user, $purpose)) {
            return $err;
        }

        $this->cleanupExpiredOtps($user);
        $otpRecord = $this->findValidOtp($user, $purpose);

        // Validate OTP existence and check hash
        if (! $otpRecord || ! Hash::check($inputOtp, $otpRecord->otp)) {
            return $this->handleInvalidOtp($verifyLimitKey, $user, $purpose);
        }

        // Successfully verified
        $this->markOtpVerified($otpRecord);
        $this->clearRateLimits($user, $purpose);

        return [
            'success' => true,
            'message' => 'OTP verified successfully.',
        ];
    }

    /* ---------- Helper Methods ---------- */

    private function checkRateLimits($rateLimitKey, $intervalKey, $user, $purpose): ?array
    {
        if (RateLimiter::tooManyAttempts($rateLimitKey, config('otp.max_attempts', 5))) {
            $seconds = RateLimiter::availableIn($rateLimitKey);

            return $this->rateLimitError($seconds, 'Too many requests. Please try again later.');
        }

        if (RateLimiter::tooManyAttempts($intervalKey, 1)) {
            $seconds = RateLimiter::availableIn($intervalKey);

            return $this->rateLimitError($seconds, "Please wait {$seconds} seconds before requesting a new code.");
        }

        return null;
    }

    private function checkVerificationRateLimit($verifyLimitKey, $user, $purpose): ?array
    {
        if (RateLimiter::tooManyAttempts($verifyLimitKey, config('otp.verify_max_attempts', 3))) {
            $seconds = RateLimiter::availableIn($verifyLimitKey);

            return $this->rateLimitError($seconds, 'Too many failed attempts. Access restricted temporarily.');
        }

        return null;
    }

    private function createOtpRecord(User $user, string $plainOtp, string $purpose, int $expiryMinutes): void
    {
        // Expire any existing unverified OTPs for this purpose
        $user->otps()->where('purpose', $purpose)->where('is_verified', false)->update(['expires_at' => now()]);

        $user->otps()->create([
            'otp' => Hash::make($plainOtp),
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes($expiryMinutes),
            'is_verified' => false,
        ]);
    }

    private function applyRateLimits($rateLimitKey, $intervalKey): void
    {
        RateLimiter::hit($rateLimitKey, config('otp.decay_minutes', 15) * 60);
        RateLimiter::hit($intervalKey, config('otp.min_interval', 120));
    }

    private function dispatchOtp(User $user, string $otp, string $purpose): void
    {
        if (config('otp.queue', false)) {
            SendOtpEmailJob::dispatch($user, $otp, $purpose);
        } else {
            Mail::to($user->email)->send(new OtpMail($otp, $user, $purpose));
        }
    }

    private function findValidOtp(User $user, string $purpose)
    {
        return $user->otps()
            ->where('purpose', $purpose)
            ->where('is_verified', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();
    }

    private function handleInvalidOtp($verifyLimitKey, $user, $purpose): array
    {
        RateLimiter::hit($verifyLimitKey, config('otp.verify_decay_minutes', 5) * 60);
        $remaining = config('otp.verify_max_attempts', 3) - RateLimiter::attempts($verifyLimitKey);

        return [
            'success' => false,
            'message' => 'The provided OTP is invalid or has expired.',
            'attempts_remaining' => max(0, $remaining),
        ];
    }

    private function markOtpVerified($otpRecord): void
    {
        $otpRecord->update([
            'is_verified' => true,
            'verified_at' => now(),
            'otp' => null, // Clear the OTP after successful verification
        ]);
    }

    private function clearRateLimits(User $user, string $purpose): void
    {
        RateLimiter::clear("otp:{$user->id}:{$purpose}");
        RateLimiter::clear("otp_verify:{$user->id}:{$purpose}");
    }

    private function generateOtp(int $length): string
    {
        $min = pow(10, $length - 1);
        $max = pow(10, $length) - 1;

        return (string) random_int($min, $max);
    }

    private function getOtpConfig(): array
    {
        return [
            'length' => (int) config('otp.length', 4),
            'expiry' => (int) config('otp.expiry', 5),
        ];
    }

    private function rateLimitError(int $seconds, string $message): array
    {
        return [
            'success' => false,
            'message' => $message,
            'retry_after' => $seconds,
        ];
    }

    private function cleanupExpiredOtps(User $user): void
    {
        // Periodic cleanup of old OTP records
        $user->otps()->where('expires_at', '<', now()->subDay())->delete();
    }
}
