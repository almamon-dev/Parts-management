<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OTP Configuration Settings
    |--------------------------------------------------------------------------
    |
    | length: Number of digits in the OTP.
    | expiry: Valid duration of the OTP in minutes.
    | min_interval: Minimum wait time (seconds) between two OTP requests.
    |
    */

    'length' => 6,      // The OTP will consist of 6 digits
    'expiry' => 5,      // Valid for 5 minutes
    'max_attempts' => 5,      // Max requests allowed within the decay window
    'decay_minutes' => 15,     // Reset rate limit window after 15 minutes
    'min_interval' => 120,    // User must wait 120 seconds before resending
    'verify_max_attempts' => 3,      // Max failed verification attempts allowed
    'verify_decay_minutes' => 5,      // Block verification for 5 minutes if limit reached
    'queue' => false,  // Set to true to send emails via background jobs
];
