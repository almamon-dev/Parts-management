@php
    $displayPurpose = match ($purpose) {
        'email_verify' => 'Verify Email',
        'password_reset' => 'Password Reset',
        default => ucwords(str_replace(['_', '-'], ' ', $purpose)),
    };
@endphp

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $displayPurpose }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #202124;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            width: 100%;
            background-color: #ffffff;
            padding: 48px 20px;
        }

        .container {
            max-width: 560px;
            margin: 0 auto;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
        }

        .header {
            margin-bottom: 32px;
        }

        .logo {
            font-size: 22px;
            font-weight: 600;
            color: #AD0100;
            letter-spacing: -0.5px;
        }
        .content {
            text-align: left;
        }

        .title {
            font-size: 24px;
            font-weight: 400;
            color: #202124;
            margin: 0 0 24px;
            text-align: center;
        }

        .greeting {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 16px;
            color: #202124;
        }

        .message {
            font-size: 14px;
            color: #5f6368;
            margin-bottom: 32px;
            line-height: 1.6;
        }

        .otp-box {
            background-color: #f8f9fa;
            border-radius: 4px;
            padding: 24px;
            text-align: center;
            margin-bottom: 32px;
        }

        .otp-code {
            font-size: 32px;
            font-weight: 500;
            color: #202124;
            letter-spacing: 6px;
            margin: 0;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
        }

        .expiry {
            font-size: 12px;
            color: #70757a;
            margin-top: 12px;
        }

        .security-note {
            font-size: 13px;
            color: #5f6368;
            border-top: 1px solid #f1f3f4;
            padding-top: 24px;
            margin-top: 32px;
        }

        .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 12px;
            color: #70757a;
        }

        .footer p {
            margin: 4px 0;
        }

        @media screen and (max-width: 480px) {
            .container {
                padding: 24px;
                border: none;
            }
            .wrapper {
                padding: 24px 0;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">{{ config('app.name') }}</div>
            </div>

            <div class="content">
                <h1 class="title">{{ $displayPurpose }}</h1>
                
                <p class="greeting">Hello {{ $user->first_name }},</p>

                <p class="message">
                    To help keep your account secure, <strong>{{ config('app.name') }}</strong> needs to verify your identity. Use this code to complete your <strong>{{ $displayPurpose }}</strong>:
                </p>

                <div class="otp-box">
                    <h2 class="otp-code">{{ $otp }}</h2>
                    <div class="expiry">Expires in {{ $expiryMinutes }} minutes</div>
                </div>

                <div class="security-note">
                    If you didn't request this code, someone may be trying to access your account. 
                    <strong>Do not share this code with anyone.</strong>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}</p>
            <p>This email was sent to you as part of a security process.</p>
        </div>
    </div>
</body>

</html>
