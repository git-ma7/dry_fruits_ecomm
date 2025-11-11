// src/components/Footer.jsx
import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#5C2C06] text-white py-10 px-6 md:px-20">
            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                <div className="md:w-1/3 flex">
                <div>
                    <h3 className="text-xl font-bold mb-3 text-[#C68B59]">Diamond Enterprises</h3>
                    <p className="text-gray-300 leading-relaxed">
                        Bringing you the finest, handpicked dry fruits with natural richness and quality assurance.
                    </p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-[#C68B59]">Quick Links</h3>
                    <ul className="space-y-1 text-gray-300 flex flex-col">
                        <Link to={'/'}>Home</Link>
                        <Link to={'/shop'}>Shop</Link>
                        <Link to={'/about'}>About</Link>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-3 text-[#C68B59]">Contact Us</h3>
                    <div className="flex items-center gap-4">
                            <FaEnvelope className="text-[#C68B59] text-md" />
                            <p className="text-gray-300">diamondenterprises.1260@gmail.com</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPhoneAlt className="text-[#C68B59] text-md" />
                            <p className="text-gray-300">+91 73592 54550</p>
                        </div>
                </div>
                
            </div>
            <div className="mt-8 text-center text-gray-400 text-sm">
                © {new Date().getFullYear()} Diamond Enterprises. All rights reserved.
            </div>
        </footer>
    );
}
