<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public string $otp,
        public User $user,
        public string $purpose
    ) {}

    /**
     * Build the message.
     */
    public function build(): self
    {
        return $this->subject($this->getSubject())
            ->markdown('emails.otp')
            ->with([
                'otp' => $this->otp,
                'user' => $this->user,
                'purpose' => $this->purpose,
                'expiryMinutes' => config('auth.otp.expiry', 5),
            ]);
    }

    /**
     * Get the subject based on the purpose.
     */
    private function getSubject(): string
    {
        // AuthController এর PURPOSES ভ্যালুর সাথে হুবহু মিল থাকতে হবে
        return match ($this->purpose) {
            'Verify Your Email Address' => 'Verify Your Email Address',
            'Reset Your Password' => 'Reset Your Password',
            default => 'Your Verification Code'
        };
    }
}
