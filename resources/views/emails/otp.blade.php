<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>{{ $purpose }}</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 10px;
            max-width: 600px;
        }

        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #AD0100;
            letter-spacing: 2px;
        }
    </style>
</head>

<body>
    <div class="container">
        {{-- first_name এবং last_name ব্যবহার করা হয়েছে --}}
        <p>Hello {{ $user->first_name }} {{ $user->last_name }},</p>

        <p>Your verification code for <strong>{{ strtolower($purpose) }}</strong> is:</p>

        <p class="otp-code">{{ $otp }}</p>

        <p>This code will expire in <strong>{{ $expiryMinutes }}</strong> minutes.</p>

        <p>If you did not request this code, please ignore this email.</p>

        <hr style="border:none; border-top:1px solid #eee;">
        <p>Thanks,<br>
            <strong>{{ config('app.name') }}</strong>
        </p>
    </div>
</body>

</html>
