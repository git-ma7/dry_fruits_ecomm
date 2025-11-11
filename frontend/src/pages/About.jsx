import React from "react";
import { motion } from "framer-motion";
import { FaLeaf, FaHeart, FaGlobe } from "react-icons/fa";

export default function About() {
    return (
        <div className="bg-[#FFF9F4] min-h-screen py-16 px-6 md:px-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-[#5C2C06] text-center mb-10 uppercase"
            >
                About <span className="text-[#C68B59]">Us</span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto bg-white border border-[#E6D5C3] rounded-2xl shadow-xl p-10 md:p-14"
            >
                <p className="text-gray-700 text-justify leading-relaxed mb-8">
                    Welcome to <span className="font-semibold text-[#5C2C06]">Diamond Enterprises</span>, your one-stop destination
                    for premium quality dry fruits sourced from the best farms.
                    Our passion lies in delivering health, taste, and purity to your doorstep.
                    With a perfect blend of traditional goodness and modern packaging,
                    we ensure that every bite is wholesome, delicious, and filled with nutrients.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Vision */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#FFF2E2] border border-[#E6D5C3] rounded-xl shadow-md p-6"
                    >
                        <FaGlobe className="text-[#C68B59] text-3xl mb-3" />
                        <h2 className="text-xl font-semibold text-[#5C2C06] mb-2">Our Vision</h2>
                        <p className="text-gray-700 text-justify text-sm">
                            To become the most trusted brand for healthy dry fruit consumption by promoting
                            a natural and nutritious lifestyle worldwide.
                        </p>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#FFF2E2] border border-[#E6D5C3] rounded-xl shadow-md p-6"
                    >
                        <FaLeaf className="text-[#C68B59] text-3xl mb-3" />
                        <h2 className="text-xl font-semibold text-[#5C2C06] mb-2">Our Mission</h2>
                        <p className="text-gray-700 text-justify text-sm">
                            To deliver handpicked, high-quality dry fruits through sustainable sourcing,
                            ensuring freshness, purity, and superior taste in every pack.
                        </p>
                    </motion.div>

                    {/* Values */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-[#FFF2E2] border border-[#E6D5C3] rounded-xl shadow-md p-6"
                    >
                        <FaHeart className="text-[#C68B59] text-3xl mb-3" />
                        <h2 className="text-xl font-semibold text-[#5C2C06] mb-2">Our Values</h2>
                        <p className="text-gray-700 text-justify text-sm">
                            We believe in integrity, customer satisfaction, and a commitment to
                            delivering premium products with love and care — straight from nature to you.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
