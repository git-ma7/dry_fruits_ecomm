import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // Load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) setCartItems(JSON.parse(savedCart));
    }, []);

    // Save cart to localStorage whenever updated
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        const newSubtotal = cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setSubtotal(newSubtotal);
        setTotal(newSubtotal); // example: ₹50 delivery
    }, [cartItems]);

    // Add item to cart
    const addItemToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find((i) => i.id === product.id);
            if (existing) {
                return prevItems.map((i) =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    // Update quantity
    const updateQuantity = (id, newQty) => {
        if (newQty <= 0) {
            removeItem(id);
        } else {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id ? { ...item, quantity: newQty } : item
                )
            );
        }
    };

    // Remove item
    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Clear cart (optional)
    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItemToCart,
                updateQuantity,
                removeItem,
                clearCart,
                subtotal,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
