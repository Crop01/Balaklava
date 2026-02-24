import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Carica il carrello dal LocalStorage all'avvio
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Salva nel LocalStorage ogni volta che cambia
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Aggiungi
    const addToCart = (product, size, color = null) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
            );

            if (existingItem) {
                return prevItems.map(item =>
                    (item.id === product.id && item.selectedSize === size && item.selectedColor === color)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { 
                    ...product, 
                    selectedSize: size, 
                    selectedColor: color, 
                    quantity: 1 
                }];
            }
        });
    };

    // Rimuovi
    const removeFromCart = (itemId, size, color) => {
        setCartItems(prevItems => prevItems.filter(item => 
            !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)
        ));
    };

    // Aggiorna Quantità
    const updateQuantity = (itemId, size, color, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems => prevItems.map(item => 
            (item.id === itemId && item.selectedSize === size && item.selectedColor === color)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    // --- NUOVA FUNZIONE: SVUOTA CARRELLO ---
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    // Calcoli
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            getCartTotal, 
            getCartCount,
            isCartOpen,
            setIsCartOpen,
            clearCart // <--- Esportiamo la nuova funzione
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);