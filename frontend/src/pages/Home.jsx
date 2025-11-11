// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaTruck, FaGift} from "react-icons/fa";
import {Link} from "react-router-dom";

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
                        <Link to="/shop">Shop Now</Link>
                    </button>
                </motion.div>

                <motion.img
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    src="https://res.cloudinary.com/dqlw6w5nh/image/upload/v1762855773/HeroPage_y9io12.jpg"
                    alt="Dry fruits bowl"
                    className="w-full md:w-[700px] md:h-[600px] rounded-3xl shadow-xl mt-10 md:mt-0"
                />
            </section>
        </div>
    );
}
