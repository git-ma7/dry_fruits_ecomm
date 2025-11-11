// src/pages/Shop.jsx
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addItemToCart } = useContext(CartContext);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category || "Uncategorized")),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-[#5C2C06]">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        {error}
      </div>
    );

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
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-[#C68B59] text-white border-[#C68B59]"
                : "bg-white text-[#5C2C06] border-[#E6D5C3] hover:bg-[#FFF2E2]"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {filteredProducts.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md border border-[#E6D5C3] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              <Link to={`/product/${item._id}`} state={{ product: item }}>
                <div className="overflow-hidden rounded-t-2xl">
                  <img
                    src={
                      item.images?.[0] ||
                      item.image ||
                      "https://via.placeholder.com/300x200"
                    }
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
                    ₹{item.price}
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  {/* Add to Cart */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addItemToCart(item, 1)}
                    className="flex-1 bg-[#5C2C06] text-white cursor-pointer py-2 rounded-md font-medium hover:bg-[#C68B59] transition"
                  >
                    Add to Cart
                  </motion.button>

                  {/* View Details */}
                  <Link
                    to={`/product/${item._id}`}
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
      )}
    </div>
  );
}
