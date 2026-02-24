<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'shipping_cost',
        'sizes',
        'colors',
        'collection',
        'images', // Abbiamo cambiato nome qui
        'is_active'
    ];

    protected $casts = [
        'sizes' => 'array',
        'colors' => 'array',
        'images' => 'array', // E aggiunto il cast qui
        'is_active' => 'boolean',
    ];
}