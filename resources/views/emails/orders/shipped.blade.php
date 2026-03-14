<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #111; color: #eee; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 1px solid #333; }
        .header { background-color: #000; padding: 30px; text-align: center; border-bottom: 2px solid #cc0000; }
        .logo { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #fff; text-decoration: none; }
        .content { padding: 40px 30px; }
        .status-badge { display: inline-block; background-color: #cc0000; color: #fff; padding: 5px 15px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 20px; }
        .message-box { background-color: #222; border-left: 4px solid #cc0000; padding: 20px; margin: 20px 0; color: #ddd; line-height: 1.6; }
        .btn { display: inline-block; background-color: #cc0000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px; margin-top: 30px; }
        .footer { background-color: #000; color: #666; text-align: center; padding: 20px; font-size: 12px; border-top: 1px solid #333; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="{{ config('app.url') }}" class="logo">Balaklava</a>
        </div>
        <div class="content">
            <span class="status-badge">Ordine Spedito</span>
            
            <h2 style="margin-top: 0; text-transform: uppercase;">Ottime notizie!</h2>
            <p>Ciao {{ $order->customer_name }}, il tuo ordine <strong>#{{ $order->id }}</strong> è partito.</p>

            @if($customMessage)
                <div class="message-box">
                    <strong>Messaggio dallo Staff:</strong><br>
                    {!! nl2br(e($customMessage)) !!}
                </div>
            @else
                <p>Il pacco è stato affidato al corriere e arriverà presto a destinazione.</p>
            @endif

            <p style="margin-top: 30px; font-size: 14px; color: #999;">
                Indirizzo di spedizione:<br>
                {{ $order->address }}<br>
                {{ $order->city }}, {{ $order->zip_code }}
            </p>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}" class="btn">Vai allo Shop</a>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Balaklava.
        </div>
    </div>
</body>
</html>