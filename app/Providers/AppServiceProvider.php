<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Implicitly grant "Super Admin" role all permissions
        // This works in the app by using gate-related functions like auth()->user->can() and @can()
        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            return ($user->hasRole('Super Admin') || $user->user_type === 'admin') ? true : null;
        });

        // Load dynamic mail settings from database
        try {
            if (Schema::hasTable('settings')) {
                $mailSettings = \App\Models\Setting::where('group', 'email')->pluck('value', 'key');
                
                if ($mailSettings->isNotEmpty()) {
                    config([
                        'mail.mailers.smtp.transport' => $mailSettings->get('mail_mailer', config('mail.mailers.smtp.transport')),
                        'mail.mailers.smtp.host' => $mailSettings->get('mail_host', config('mail.mailers.smtp.host')),
                        'mail.mailers.smtp.port' => $mailSettings->get('mail_port', config('mail.mailers.smtp.port')),
                        'mail.mailers.smtp.encryption' => $mailSettings->get('mail_encryption', config('mail.mailers.smtp.encryption')),
                        'mail.mailers.smtp.username' => $mailSettings->get('mail_username', config('mail.mailers.smtp.username')),
                        'mail.mailers.smtp.password' => $mailSettings->get('mail_password', config('mail.mailers.smtp.password')),
                        'mail.from.address' => $mailSettings->get('mail_from_address', config('mail.from.address')),
                        'mail.from.name' => $mailSettings->get('mail_from_name', config('mail.from.name')),
                    ]);
                }

                $paymentSettings = \App\Models\Setting::where('group', 'payment')->pluck('value', 'key');
                if ($paymentSettings->isNotEmpty()) {
                    config([
                        'services.stripe.key' => $paymentSettings->get('stripe_publishable_key', config('services.stripe.key')),
                        'services.stripe.secret' => $paymentSettings->get('stripe_secret_key', config('services.stripe.secret')),
                        'services.stripe.webhook.secret' => $paymentSettings->get('stripe_webhook_secret', config('services.stripe.webhook.secret')),
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Silently fail if DB is not ready
        }
    }
}
