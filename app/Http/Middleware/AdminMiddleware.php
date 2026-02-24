<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Se l'utente non è loggato O non è admin, lo mandiamo via
        if (!auth()->check() || !auth()->user()->is_admin) {
            return redirect('/');
        }

        return $next($request);
    }
}