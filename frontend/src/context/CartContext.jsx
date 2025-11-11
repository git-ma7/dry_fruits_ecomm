import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage (persist session)
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Save cart to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    const newSubtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal); // optional: + delivery charge later
  }, [cartItems]);

  // Add item to cart
  const addItemToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === product._id);
      if (existing) {
        return prevItems.map((i) =>
          i._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // Update quantity
  const updateQuantity = (id, newQty) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === id ? { ...item, quantity: newQty } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Clear cart (e.g., after checkout)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

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
