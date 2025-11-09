// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-[#FFF9F4] shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
                {/* LOGO */}
                <Link to="/" className="text-2xl font-extrabold text-[#5C2C06]">
                    Nutri<span className="text-[#C68B59]">Cart</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {["Home", "Shop", "About", "Contact"].map((page, i) => (
                        <Link
                            key={i}
                            to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                            className="text-gray-700 hover:text-[#C68B59] font-medium transition-colors"
                        >
                            {page}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="hidden md:flex items-center gap-5">
                    <Link to="/cart" className="relative">
                        <FaShoppingCart size={22} className="text-[#5C2C06]" />
                    </Link>
                    <Link to="/login">
                        <FaUser size={22} className="text-[#5C2C06]" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#5C2C06] focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden bg-[#FFF9F4] shadow-lg border-t border-[#E6D5C3] flex flex-col items-center py-4 space-y-4"
                >
                    {["Home", "Shop", "About", "Contact"].map((page, i) => (
                        <Link
                            key={i}
                            to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 font-medium hover:text-[#C68B59] transition"
                        >
                            {page}
                        </Link>
                    ))}
                    <div className="flex gap-6 pt-4">
                        <Link to="/cart" className="text-[#5C2C06]">
                            <FaShoppingCart size={22} />
                        </Link>
                        <Link to="/login" className="text-[#5C2C06]">
                            <FaUser size={22} />
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
