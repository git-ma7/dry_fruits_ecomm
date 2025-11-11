// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    // const [user, setUser] = useState(null);
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    // useEffect(() => {
    //     const email = localStorage.getItem("email");
    //     if (email === ADMIN_EMAIL) {
    //         setUser("Admin");
    //     } else if (email) {
    //         setUser("customer");
    //     }
    // }, []);

    return (
        <nav className="bg-[#FFF9F4] shadow-md sticky top-0 z-50">
            <div className="md:max-w-[92%] w-full px-4 mx-auto flex justify-evenly items-center h-18">
                {/* LOGO */}
                <Link to="/" className="text-2xl w-full flex gap-2 font-extrabold  text-[#5C2C06]">
                    Diamond <span className="text-[#C68B59]">Enterprises</span>
                </Link>

                <div className="w-full flex items-center justify-end gap-4">
                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {["Home", "Shop", "About"].map((page, i) => (
                            <Link
                                key={i}
                                to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                                className="text-gray-700 hover:text-[#C68B59] font-medium transition-colors"
                            >
                                {page}
                            </Link>
                        ))}
                        {/* {(
                        <Link to={'/admin-panel'} className="text-gray-700 hover:text-[#C68B59] font-medium transition-colors">
                            Admin Panel
                        </Link>)} */}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center justify-end gap-5">
                        <Link to="/cart" className="relative">
                            <FaShoppingCart size={22} className="text-[#5C2C06]" />
                        </Link>
                        <Link to="/profile">
                            <FaUser size={22} className="text-[#5C2C06]" />
                        </Link>
                    </div>
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
                    {["Home", "Shop", "About"].map((page, i) => (
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
                        <Link to="/profile" className="text-[#5C2C06]">
                            <FaUser size={22} />
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
