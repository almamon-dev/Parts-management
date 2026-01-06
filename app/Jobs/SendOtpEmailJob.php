<?php

namespace App\Jobs;

use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;

class SendOtpEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;
    public $backoff = [10, 30, 60];

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user,
        public string $otp,
        public string $purpose = 'email_verify'
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("Sending OTP email to {$this->user->email} [{$this->purpose}]");

            Mail::to($this->user->email)
                ->send(new OtpMail($this->otp, $this->user, $this->purpose));

            Log::info("OTP email sent successfully to {$this->user->email} [{$this->purpose}]");

        } catch (Exception $e) {
            Log::error("Failed to send OTP email to {$this->user->email}: {$e->getMessage()}");

            // Retry logic is handled automatically by Laravel due to implements ShouldQueue
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        Log::error("SendOtpEmailJob failed after {$this->tries} attempts for {$this->user->email}: {$exception->getMessage()}");
    }
}
