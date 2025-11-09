import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { addItemToCart } = useContext(CartContext);

    const products = [
        {
            id: 1,
            name: "Premium Almonds",
            category: "Almonds",
            price: 650,
            rating: 4.8,
            image:
                "https://images.unsplash.com/photo-1606755962773-d324d5c13d21?auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 2,
            name: "Organic Cashews",
            category: "Cashews",
            price: 720,
            rating: 4.7,
            image:
                "https://images.unsplash.com/photo-1622192707490-dffb8e47f63f?auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 3,
            name: "California Pistachios",
            category: "Pistachios",
            price: 850,
            image:
                "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 4,
            name: "Natural Walnuts",
            category: "Walnuts",
            price: 780,
            image:
                "https://images.unsplash.com/photo-1621996346565-45b2a23780b3?auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 5,
            name: "Raisins (Golden)",
            category: "Raisins",
            price: 450,
            image:
                "https://images.unsplash.com/photo-1571687949920-3e4e7e0f59f2?auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 6,
            name: "Dry Fruit Mix",
            category: "Mix",
            price: 900,
            image:
                "https://images.unsplash.com/photo-1618418450473-3ba35b04e36f?auto=format&fit=crop&w=800&q=80",
        },
    ];

    const categories = ["All", "Almonds", "Cashews", "Pistachios", "Walnuts", "Raisins", "Mix"];

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter((item) => item.category === selectedCategory);

    return (
        <div className="bg-[#FFF9F4] min-h-screen py-16 px-6 md:px-16">
            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-[#5C2C06] text-center mb-10"
            >
                Explore Our Premium Dry Fruits
            </motion.h1>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat) => (
                    <motion.button
                        key={cat}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                            ? "bg-[#C68B59] text-white border-[#C68B59]"
                            : "bg-white text-[#5C2C06] border-[#E6D5C3] hover:bg-[#FFF2E2]"
                            }`}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            {/* Product Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            >
                {filteredProducts.map((item) => (
                    <motion.div
                        key={item.id}
                        to={`/product/${item.id}`}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/90 backdrop-blur-md border border-[#E6D5C3] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
                    >
                        <Link
                            to={`/product/${item.id}`}
                            state={{ product: item }}
                        >
                            <div className="overflow-hidden rounded-t-2xl">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-60 object-cover rounded-t-2xl"
                                />
                            </div>
                        </Link>

                        <div className="p-5">
                            <h3 className="text-xl font-semibold text-[#5C2C06]">
                                {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm">{item.category}</p>

                            <div className="flex items-center justify-between mt-3">
                                <p className="text-[#C68B59] font-semibold text-lg">
                                    ₹{item.price} / kg
                                </p>
                            </div>

                            {/* Add to Cart & View Button */}
                            <div className="flex gap-3 mt-5">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addItemToCart(item)}
                                    className="flex-1 bg-[#5C2C06] text-white cursor-pointer py-2 rounded-md font-medium hover:bg-[#C68B59] transition"
                                >
                                    Add to Cart
                                </motion.button>

                                <Link
                                    to={`/product/${item.id}`}
                                    state={{ product: item }}
                                    className="flex-1 text-center bg-white border border-[#5C2C06] text-[#5C2C06] py-2 rounded-md font-medium hover:bg-[#5C2C06] hover:text-white transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
