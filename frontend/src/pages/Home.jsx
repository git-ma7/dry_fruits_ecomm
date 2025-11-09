// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaTruck, FaGift} from "react-icons/fa";

export default function Home() {
    return (
        <div className="text-gray-800 overflow-x-hidden">
            {/* ================= HERO SECTION ================= */}
            <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-lg"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#5C2C06]">
                        Fresh, Premium <span className="text-[#C68B59]">Dry Fruits</span> <br /> Delivered to You 🍂
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Discover the finest selection of handpicked nuts and dry fruits sourced from trusted farms.
                    </p>
                    <button className="mt-6 px-8 py-3 bg-[#C68B59] text-white font-semibold rounded-full shadow-md hover:bg-[#A66D3C] transition-all">
                        Shop Now
                    </button>
                </motion.div>

                <motion.img
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80"
                    alt="Dry fruits bowl"
                    className="w-full md:w-[700px] h-[600px] rounded-3xl shadow-xl mt-10 md:mt-0"
                />
            </section>

            {/* ================= FEATURES SECTION ================= */}
            <section className="bg-white py-12 md:py-20 px-6 md:px-20 text-center">
                <h2 className="text-3xl font-bold text-[#5C2C06] mb-8">Why Choose NutriCart?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {[
                        { icon: <FaLeaf size={36} />, title: "100% Natural", desc: "Pure, chemical-free, and naturally sun-dried." },
                        { icon: <FaTruck size={36} />, title: "Fast Delivery", desc: "Quick doorstep delivery across the country." },
                        { icon: <FaGift size={36} />, title: "Perfect for Gifting", desc: "Beautifully packed for festivals & occasions." },
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="p-6 bg-[#FFF9F4] rounded-2xl shadow-md flex flex-col items-center"
                        >
                            <div className="text-[#C68B59] mb-3">{f.icon}</div>
                            <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
                            <p className="text-gray-600">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= FEATURED PRODUCTS ================= */}
            <section className="py-16 bg-[#FFF3E0] px-6 md:px-20 text-center">
                <h2 className="text-3xl font-bold text-[#5C2C06] mb-8">Our Best Sellers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[
                        { img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?auto=format&fit=crop&w=800&q=80", name: "Almonds" },
                        { img: "https://images.unsplash.com/photo-1615485296599-845df86b6d88?auto=format&fit=crop&w=800&q=80", name: "Cashews" },
                        { img: "https://images.unsplash.com/photo-1621686023725-c42f228b4f7b?auto=format&fit=crop&w=800&q=80", name: "Pistachios" },
                        { img: "https://images.unsplash.com/photo-1626078295822-3bdf4020efb2?auto=format&fit=crop&w=800&q=80", name: "Raisins" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <img src={item.img} alt={item.name} className="w-full h-52 object-cover" />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-[#5C2C06]">{item.name}</h3>
                                <p className="text-[#C68B59] font-medium mt-1">₹499 / 500g</p>
                                <button className="mt-3 w-full bg-[#C68B59] text-white rounded-full py-2 font-semibold hover:bg-[#A66D3C] transition">
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ================= ABOUT SECTION ================= */}
            <section className="py-20 bg-white flex flex-col md:flex-row items-center px-6 md:px-20 gap-12">
                <motion.img
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    src="https://images.unsplash.com/photo-1615486364446-b9b6e1b43a36?auto=format&fit=crop&w=800&q=80"
                    alt="About NutriCart"
                    className="w-full md:w-1/2 rounded-3xl shadow-lg"
                />
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-lg"
                >
                    <h2 className="text-3xl font-bold text-[#5C2C06] mb-4">About NutriCart</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We’re passionate about providing high-quality, fresh, and organic dry fruits
                        directly from farms to your home. Our mission is to make healthy snacking simple,
                        affordable, and delicious for everyone.
                    </p>
                    <button className="mt-6 px-8 py-3 bg-[#C68B59] text-white font-semibold rounded-full shadow-md hover:bg-[#A66D3C] transition-all">
                        Learn More
                    </button>
                </motion.div>
            </section>
        </div>
    );
}
