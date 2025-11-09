import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Checkout() {
    const { cartItems, subtotal, total, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        paymentMethod: "COD",
    });

    // Handle form changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Simulate checkout
    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            navigate("/shop");
            return;
        }

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.address ||
            !formData.city ||
            !formData.pincode
        ) {
            alert("Please fill in all the details before proceeding.");
            return;
        }

        alert("Order placed successfully! 🎉");
        clearCart();
        navigate("/shop");
    };

    return (
        <div className="min-h-screen bg-[#FFF9F4] text-[#5C2C06] flex flex-col relative pb-10">
            {/* Header */}
            <div className="max-w-6xl mx-auto w-full mt-8 px-6 md:px-10">
                <h1 className="text-4xl font-bold mb-8 text-center uppercase">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Section – Customer Details */}
                    <form
                        onSubmit={handlePlaceOrder}
                        className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 border-b border-[#C68B59]/40 pb-3">
                            Shipping Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                            />

                            <textarea
                                name="address"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                            ></textarea>

                            <div className="grid grid-cols-2 gap-5">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                                />
                            </div>

                            
                        </div>
                    </form>

                    {/* Right Section – Order Summary */}
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-6 border-b border-[#C68B59]/40 pb-3">
                            Order Summary
                        </h2>

                        {cartItems.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-lg text-[#5C2C06]/70 mb-5">
                                    Your cart is empty.
                                </p>
                                <Link
                                    to="/shop"
                                    className="bg-[#C68B59] text-white px-6 py-2 rounded-full hover:bg-[#5C2C06] transition"
                                >
                                    Go to Shop
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-[#C68B59]/20">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between py-3"
                                        >
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-[#5C2C06]/60">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#C68B59]/30 mt-4 pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <p>Subtotal</p>
                                        <p>₹{subtotal}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Delivery</p>
                                        <p>₹50</p>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg border-t border-[#C68B59]/30 pt-3">
                                        <p>Total</p>
                                        <p>₹{total + 50}</p>
                                    </div>
                                </div>

                                    <div className="mt-3">
                                        <label className="block text-sm font-medium mb-2">
                                            Payment Method
                                        </label>
                                        <select
                                            name="paymentMethod"
                                            value={formData.paymentMethod}
                                            onChange={handleChange}
                                            className="w-full p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                                        >
                                            <option value="COD">Cash on Delivery (COD)</option>
                                            <option value="Online">Online Payment</option>
                                            <option value="UPI">UPI</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-6 bg-[#C68B59] text-white cursor-pointer py-3 rounded-full font-semibold hover:bg-[#5C2C06] transition-all"
                                    >
                                        Place Order
                                    </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
