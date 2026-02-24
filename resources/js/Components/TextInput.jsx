import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                // STILE AGGIORNATO:
                // - bg-gray-900: Sfondo scuro ma non nero
                // - text-white: Testo ben visibile
                // - border-gray-700: Bordo sottile per definire l'area
                // - text-base: Font più grande (evita zoom su mobile)
                // - py-3 px-4: Più spazio interno per comodità
                'w-full border-gray-700 bg-gray-900 text-white text-base placeholder-gray-500 focus:border-red-600 focus:ring-red-600 rounded-sm shadow-sm py-3 px-4 ' +
                className
            }
            ref={input}
        />
    );
});