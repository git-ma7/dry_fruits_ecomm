import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";

// Environment-based API URL (make sure you define VITE_API_URL in your .env)
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Register/Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        // ---- LOGIN ----
        const { data } = await axios.post(`${API_BASE_URL}/api/users/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);

        // Set default header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // Redirect admin or normal user
        const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
        if (data.email === ADMIN_EMAIL) {
          setMessage("Welcome, Admin!");
          navigate("/admin-panel");
        } else {
          setMessage("Login successful!");
          navigate("/");
        }
      } else {
        // ---- REGISTER ----
        if (formData.password !== formData.confirmPassword) {
          setMessage("Passwords do not match!");
          setLoading(false);
          return;
        }

        await axios.post(`${API_BASE_URL}/api/users/register`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });

        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FFF3E0] to-[#FFF9F4] relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-xl bg-white/30"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl mx-4 bg-white/40 rounded-3xl shadow-2xl flex overflow-hidden backdrop-blur-md"
      >
        {/* LEFT SIDE */}
        <div className="w-1/2 hidden md:flex flex-col justify-center items-center p-10 bg-linear-to-br from-[#5C2C06]/90 to-[#C68B59]/80 text-white text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-wide">
            {isLogin ? "Welcome Back to NutriCart!" : "Join the NutriCart Family!"}
          </h1>
          <p className="text-lg leading-relaxed text-white/90">
            {isLogin
              ? "Login to explore premium dry fruits, exclusive offers, and a seamless shopping experience."
              : "Create an account and start enjoying healthy, premium-quality dry fruits delivered to your doorstep."}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-[#5C2C06] mb-6">
            {isLogin ? "Login to Your Account" : "Create a New Account"}
          </h2>

          <motion.form
            onSubmit={handleSubmit}
            key={isLogin ? "loginForm" : "registerForm"}
            initial={{ opacity: 0, x: isLogin ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? -40 : 40 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-4"
          >
            {!isLogin && (
              <>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-[#C68B59]" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E6D5C3] focus:outline-none focus:ring-2 focus:ring-[#C68B59]"
                    required
                  />
                </div>
                <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-[#C68B59]" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E6D5C3] focus:outline-none focus:ring-2 focus:ring-[#C68B59]"
                    required
                  />
                </div>
                <div className="relative">
                  <FaPhone className="absolute top-3 left-3 text-[#C68B59]" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E6D5C3] focus:outline-none focus:ring-2 focus:ring-[#C68B59]"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-[#C68B59]" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E6D5C3] focus:outline-none focus:ring-2 focus:ring-[#C68B59]"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-[#C68B59]" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E6D5C3] focus:outline-none focus:ring-2 focus:ring-[#C68B59]"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-[#C68B59]" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E6D5C3] focus:outline-none focus:ring-2 focus:ring-[#C68B59]"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#C68B59] text-white py-2 rounded-lg font-semibold hover:bg-[#A66D3C] transition-all"
            >
              {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
            </button>

            {message && (
              <p className="text-center mt-3 text-sm font-medium text-[#5C2C06]">{message}</p>
            )}

            <p className="text-center text-gray-700 mt-4">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#C68B59] font-medium hover:underline"
              >
                {isLogin ? "Register Here" : "Login Here"}
              </button>
            </p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
