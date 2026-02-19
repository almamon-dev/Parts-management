<?php

use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;

uses(WithFaker::class);

beforeEach(function () {
    // Prevent actual mails/queues during tests
    Mail::fake();
    Queue::fake();
});

it('renders verify OTP page with correct props', function () {
    $email = 'user@example.com';

    $response = $this->get(route('otp.verify.show', ['email' => $email, 'reset' => 1]));

    $response->assertStatus(200);
});

it('redirects unverified users on login and sends verify OTP', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
        'is_verified' => false,
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('otp.verify.show', ['email' => $user->email], false));
    $this->assertGuest();
});

it('rejects OTP verification with wrong code', function () {
    $user = User::factory()->create([
        'is_verified' => false,
    ]);

    // Attempt verify with wrong OTP string
    $response = $this->from(route('otp.verify.show', ['email' => $user->email]))
        ->post(route('otp.verify'), [
            'email' => $user->email,
            'otp' => '000000',
        ]);

    $response->assertRedirect(route('otp.verify.show', ['email' => $user->email], false));
    $response->assertSessionHasErrors('otp');
});

it('verifies email OTP and logs the user in', function () {
    $user = User::factory()->create([
        'is_verified' => false,
        'email_verified_at' => null,
    ]);

    if (DB::getSchemaBuilder()->hasTable('o_t_p_s')) {
        DB::table('o_t_p_s')->insert([
            'user_id' => $user->id,
            'otp' => Hash::make('123456'), // Hashed as per Model/Trait logic
            'purpose' => 'email_verify',
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    $response = $this->post(route('otp.verify'), [
        'email' => $user->email,
        'otp' => '123456',
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));
    $this->assertAuthenticatedAs($user->fresh());
    expect($user->fresh()->is_verified)->toBeTrue();
});

it('initiates password reset by sending reset OTP and redirects to verify', function () {
    $user = User::factory()->create();

    $response = $this->post(route('password.email'), [
        'email' => $user->email,
    ]);

    $response->assertRedirect(route('otp.verify.show', ['email' => $user->email, 'reset' => 1], false));
});

it('accepts reset OTP and redirects to reset form with token', function () {
    $user = User::factory()->create();

    // Seed a valid reset OTP
    if (DB::getSchemaBuilder()->hasTable('o_t_p_s')) {
        DB::table('o_t_p_s')->insert([
            'user_id' => $user->id,
            'otp' => Hash::make('654321'),
            'purpose' => 'password_reset',
            'expires_at' => now()->addMinutes(5),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    $response = $this->post(route('otp.verify'), [
        'email' => $user->email,
        'otp' => '654321',
        'is_password_reset' => true,
    ]);

    // Should redirect to password.reset with a token in query string
    $response->assertRedirect();
    $location = $response->headers->get('Location');
    expect($location)->toContain('/reset-password/');
    expect($location)->toContain('email='.urlencode($user->email));

    // After verify, user should not be logged in automatically for reset flow
    $this->assertGuest();
});

it('resets password successfully with valid token', function () {
    $user = User::factory()->create();

    // Simulate having gone through OTP reset flow which sets hashed token and expiry
    $plain = Str::random(60);
    $user->forceFill([
        'reset_password_token' => hash('sha256', $plain),
        'reset_password_token_expire_at' => now()->addMinutes(15),
    ])->save();

    $response = $this->post(route('password.store'), [
        'token' => $plain,
        'email' => $user->email,
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ]);

    $response->assertRedirect(route('password.confirm', absolute: false));

    $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    expect($user->fresh()->reset_password_token)->toBeNull();
});
