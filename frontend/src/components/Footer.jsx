// src/components/Footer.jsx
import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#5C2C06] text-white py-10 px-6 md:px-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-3 text-[#C68B59]">NutriCart</h3>
                    <p className="text-gray-300 leading-relaxed">
                        Bringing you the finest, handpicked dry fruits with natural richness and quality assurance.
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-[#C68B59]">Quick Links</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li>Home</li>
                        <li>Shop</li>
                        <li>About</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-[#C68B59]">Customer Service</h3>
                    <ul className="space-y-1 text-gray-300">
                        <li>FAQs</li>
                        <li>Shipping Policy</li>
                        <li>Return Policy</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-[#C68B59]">Follow Us</h3>
                    <div className="flex space-x-4 text-[#C68B59]">
                        <FaInstagram size={22} />
                        <FaFacebook size={22} />
                        <FaTwitter size={22} />
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} NutriCart. All rights reserved.
            </div>
        </footer>
    );
}
