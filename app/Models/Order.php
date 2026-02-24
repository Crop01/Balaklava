<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'address',
        'city',
        'zip_code',
        'province',
        'subtotal',
        'shipping_cost',
        'total',
        'status',
        'payment_method'
    ];

    // Relazione: Un ordine ha molti articoli
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relazione: Un ordine appartiene a un utente (opzionale)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}