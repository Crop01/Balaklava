<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderShipped;

class AdminController extends Controller
{
    /**
     * Mostra la Dashboard con la lista di tutti gli ordini.
     */
    public function dashboard()
    {
        // Recupera gli ordini, dal più recente, con i dettagli degli articoli
        $orders = Order::with('items')->latest()->get();

        return Inertia::render('Admin/Dashboard', [
            'orders' => $orders
        ]);
    }

    /**
     * Mostra i dettagli di un singolo ordine per la spedizione.
     */
    public function show($id)
    {
        // Carichiamo l'ordine con i prodotti (items) e l'utente associato (user)
        $order = Order::with(['items', 'user'])->findOrFail($id);
        
        return Inertia::render('Admin/OrderShow', [
            'order' => $order
        ]);
    }

    /**
     * Segna l'ordine come spedito e invia la mail di notifica.
     */
    public function ship(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        // Validiamo il messaggio opzionale
        $request->validate([
            'message' => 'nullable|string'
        ]);

        // Aggiorna lo stato dell'ordine
        $order->update([
            'status' => 'shipped'
        ]);

        // Tenta di inviare la mail (usiamo try-catch per non bloccare l'admin se la mail fallisce in locale)
        try {
            Mail::to($order->customer_email)->send(
                new OrderShipped($order, $request->message)
            );
        } catch (\Exception $e) {
            // In produzione qui loggheremmo l'errore
        }

        return redirect()->route('admin.dashboard');
    }
}