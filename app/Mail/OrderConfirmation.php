<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    // Il costruttore riceve l'ordine appena creato
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Conferma Ricezione Ordine #' . $this->order->id . ' - Balaklava',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.confirmation', // Cercherà il file in resources/views/emails/orders/confirmation.blade.php
        );
    }

    public function attachments(): array
    {
        return [];
    }
}