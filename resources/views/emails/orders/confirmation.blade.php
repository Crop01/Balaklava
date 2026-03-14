<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #050505; color: #ffffff; padding: 20px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; text-decoration: none; }
        .content { padding: 30px; }
        .order-info { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-left: 4px solid #cc0000; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th { text-align: left; border-bottom: 1px solid #ddd; padding: 10px; font-size: 12px; text-transform: uppercase; color: #666; }
        .table td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-size: 18px; font-weight: bold; color: #cc0000; padding-top: 20px; }
        .footer { background-color: #111; color: #666; text-align: center; padding: 20px; font-size: 12px; }
        .btn { display: inline-block; background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; margin-top: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <a href="{{ config('app.url') }}" class="logo">Balaklava</a>
        </div>

        <!-- Body -->
        <div class="content">
            <h2>Grazie {{ $order->customer_name }},</h2>
            <p>Abbiamo ricevuto la tua richiesta d'ordine.</p>
            
            <div class="order-info">
                <strong>Stato Ordine:</strong> In attesa di conferma<br>
                <strong>Numero Ordine:</strong> #{{ $order->id }}<br>
                <strong>Data:</strong> {{ $order->created_at->format('d/m/Y H:i') }}
            </div>

            <p>
                Il nostro team verificherà la disponibilità e ti invierà a breve una 
                <strong>seconda email</strong> contenente il link per il pagamento e le istruzioni per la spedizione.
            </p>
            <p>Non effettuare alcun pagamento finché non ricevi la conferma dagli admin.</p>

            <h3>Riepilogo Ordine</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Prodotto</th>
                        <th>Taglia</th>
                        <th>Q.tà</th>
                        <th>Prezzo</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->product_name }}</strong>
                            @if($item->color) <br><span style="font-size:11px; color:#888">{{ $item->color }}</span> @endif
                        </td>
                        <td>{{ $item->size }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>€{{ number_format($item->price, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="total">
                Totale: €{{ number_format($order->total, 2) }}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ config('app.url') }}" class="btn">Torna al Sito</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; {{ date('Y') }} Balaklava. Tutti i diritti riservati.<br>
            Questa è una mail automatica, per info contattaci su Instagram.
        </div>
    </div>
</body>
</html>