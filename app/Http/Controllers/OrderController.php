<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail; // <--- Importante
use App\Mail\OrderConfirmation;      // <--- Importante

class OrderController extends Controller
{
    public function create()
    {
        return Inertia::render('Checkout/Index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string',
            'zip_code' => 'required|string',
            'province' => 'nullable|string|max:2',
            'cart_items' => 'required|array|min:1',
        ]);

        $subtotal = 0;
        $orderItemsData = [];

        foreach ($request->cart_items as $item) {
            $product = Product::find($item['id']);
            if ($product) {
                $price = $product->sale_price ?? $product->price;
                $quantity = $item['quantity'];
                $subtotal += $price * $quantity;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'size' => $item['selectedSize'] ?? null,
                    'color' => $item['selectedColor'] ?? null,
                    'quantity' => $quantity,
                    'price' => $price,
                ];
            }
        }

        $shippingCost = $subtotal > 100 ? 0 : 5.00;
        $total = $subtotal + $shippingCost;

        return DB::transaction(function () use ($request, $subtotal, $shippingCost, $total, $orderItemsData) {
            
            $order = Order::create([
                'user_id' => auth()->id(),
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone,
                'address' => $request->address,
                'city' => $request->city,
                'zip_code' => $request->zip_code,
                'province' => $request->province,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => 'manual', // Cambiato da 'cod' a 'manual' visto che aspettano mail
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // --- INVIO EMAIL (Log) ---
            // Invia la mail all'indirizzo del cliente
            try {

            $adminEmail = config('mail.from.address');
            
            Mail::to($order->customer_email)
                    ->bcc($adminEmail) // Invia la copia nascosta all'indirizzo configurato nel .env
                    ->send(new OrderConfirmation($order));
                    } catch (\Exception $e) {
                // Se la mail fallisce, non blocchiamo l'ordine ma lo scriviamo nei log di errore
                // Log::error('Errore invio mail: ' . $e->getMessage());
            }

            return redirect()->route('checkout.success', $order->id);
        });
    }

    public function success($id)
    {
        $order = Order::with('items')->findOrFail($id);
        return Inertia::render('Checkout/Success', ['order' => $order]);
    }
}