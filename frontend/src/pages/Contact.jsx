import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
    return (
        <div className="bg-[#FFF9F4] min-h-screen py-8 px-6 md:px-16">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-[#5C2C06] text-center mb-10 uppercase"
            >
                Contact <span className="text-[#C68B59]">Us</span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto bg-white border border-[#E6D5C3] rounded-2xl shadow-xl p-10 md:p-14"
            >
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Contact Form */}
                    <form className="space-y-6">
                        <div>
                            <label className="block text-[#5C2C06] font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full bg-[#FFF9F4] border border-[#E6D5C3] rounded-md px-4 py-3 text-[#5C2C06] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[#5C2C06] font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#FFF9F4] border border-[#E6D5C3] rounded-md px-4 py-3 text-[#5C2C06] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[#5C2C06] font-medium mb-2">
                                Message
                            </label>
                            <textarea
                                rows="5"
                                placeholder="Write your message..."
                                className="w-full bg-[#FFF9F4] border border-[#E6D5C3] rounded-md px-4 py-3 text-[#5C2C06] focus:outline-none resize-none"
                            ></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-[#5C2C06] text-white py-3 rounded-md font-semibold shadow-md cursor-pointer hover:bg-[#C68B59] transition"
                        >
                            Send Message
                        </motion.button>
                    </form>

                    {/* Contact Information */}
                    <div className="flex flex-col justify-center space-y-6 text-[#5C2C06]">
                        <div className="flex items-center gap-4">
                            <FaMapMarkerAlt className="text-[#C68B59] text-2xl" />
                            <p className="text-lg">Birla Vishvakarma Mahavidyalaya, Gujarat, India</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-[#C68B59] text-2xl" />
                            <p className="text-lg">info@nutridry.com</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPhoneAlt className="text-[#C68B59] text-2xl" />
                            <p className="text-lg">+91 98765 43210</p>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
                            <p className="text-gray-700">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                            <p className="text-gray-700">Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
