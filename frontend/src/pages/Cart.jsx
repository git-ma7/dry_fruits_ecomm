// src/pages/Cart.jsx
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Trash2 } from "lucide-react";

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, subtotal, total } =
    useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#5C2C06] flex flex-col relative">
      <div className="max-w-4xl mx-auto w-full mt-20 p-6">
        <h1 className="text-4xl font-semibold mb-6 text-center uppercase">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 bg-white/60 backdrop-blur-md rounded-2xl shadow-md p-10">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty 🛍️</h2>
            <p className="text-[#5C2C06]/70 mb-6 text-center">
              It looks like you haven’t added anything to your cart yet.
              Explore our collection and find something you love!
            </p>
            <Link
              to="/shop"
              className="bg-[#C68B59] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5C2C06] transition-all"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6 divide-y divide-[#C68B59]/30">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center justify-between py-4 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.images?.[0] ||
                        item.image ||
                        "https://via.placeholder.com/300x200"
                      }
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-[#C68B59]/40"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-[#5C2C06]/70 flex items-center">
                        ₹{item.price} • each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#C68B59]/50 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="px-3 py-1 bg-[#FFF9F4] hover:bg-[#C68B59]/20"
                      >
                        -
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-3 py-1 bg-[#FFF9F4] hover:bg-[#C68B59]/20"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-[#C68B59] hover:text-[#5C2C06] transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6 text-right space-y-3">
              <div className="flex justify-between">
                <p className="font-medium">Subtotal</p>
                <p>₹{subtotal}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Delivery</p>
                <p>FREE SHIPPING</p>
              </div>
              <div className="flex justify-between border-t border-[#C68B59]/30 pt-3">
                <p className="text-xl font-semibold">Total</p>
                <p className="text-xl font-semibold">₹{total}</p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-[#C68B59] text-white py-3 rounded-full font-semibold hover:bg-[#5C2C06] transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
