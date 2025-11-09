import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductDetails() {
    const { state } = useLocation(); // ✅ Get product data from Link state
    const navigate = useNavigate();
    const { addItemToCart } = useContext(CartContext);

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(state?.product?.image || "");

    // Redirect if no product data found (e.g., user directly visits /product/:id)
    useEffect(() => {
        if (!state?.product) {
            navigate("/shop");
        }
    }, [state, navigate]);

    const handleAddToCart = () => {
        addItemToCart(state.product, quantity);
    };

    const product = state?.product;

    return (
        <div className="pt-24 pb-10 px-4 md:px-10 bg-[#FFF9F4] min-h-screen">
            {product && (
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    {/* Left Section */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm border border-[#E6D5C3]"
                        >
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-[400px] object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Right Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-3xl font-bold text-[#5C2C06]">
                            {product.name}
                        </h1>

                        <p className="text-lg text-gray-700 leading-relaxed">
                            {product.description ||
                                "A premium dry fruit product, perfect for daily health and gifting."}
                        </p>

                        <h2 className="text-2xl font-semibold text-[#C68B59]">
                            ₹{product.price.toLocaleString()}{" "}
                            <span className="text-base text-gray-600 font-normal">
                                / 500g
                            </span>
                        </h2>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 bg-[#5C2C06] text-white rounded-full cursor-pointer"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 bg-[#5C2C06] text-white rounded-full cursor-pointer" 
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 bg-[#5C2C06] cursor-pointer text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-[#C68B59] transition-colors"
                        >
                            <ShoppingCart /> Add to Cart
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
