<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $customMessage;

    public function __construct(Order $order, $customMessage = null)
    {
        $this->order = $order;
        $this->customMessage = $customMessage;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Il tuo ordine Resilient Druid è stato spedito!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.shipped',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}