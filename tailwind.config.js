import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                // Qui potremo aggiungere font più "street" in futuro
            },
            colors: {
                // I colori del tuo brand
                'brand-black': '#050505', // Nero quasi assoluto
                'brand-dark': '#121212',  // Grigio antracite scuro
                'brand-gray': '#2A2A2A',  // Grigio per i bordi
                'brand-text': '#EAEAEA',  // Bianco non sparato
            }
        },
    },

    plugins: [forms],
};
