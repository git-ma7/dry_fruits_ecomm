import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

export default function ProductDetails() {
  const { id } = useParams(); // get product ID from URL
  const navigate = useNavigate();
  const { addItemToCart } = useContext(CartContext);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(data);
        setSelectedImage(data.images[0] || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, API_BASE_URL]);

  const handleAddToCart = () => {
    if (!product) return;
    addItemToCart(product, quantity);
    toast.success(`${product.name} (x${quantity}) added to cart!`, { position: "top-center", duration: 2000 });
  };

  if (loading) return <p className="text-center mt-20">Loading product...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="pt-24 pb-10 px-4 md:px-10 bg-[#FFF9F4] min-h-screen">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Left: Image */}
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

        {/* Right: Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h1 className="text-3xl font-bold text-[#5C2C06]">{product.name}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            {product.description || "A premium product for your daily needs."}
          </p>
          <h2 className="text-2xl font-semibold text-[#C68B59]">
            ₹{product.price?.toLocaleString() || "0"}{" "}
            <span className="text-base text-gray-600 font-normal">/ unit</span>
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

          {/* Add to Cart */}
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
      <Toaster />
    </div>
  );
}
